import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import DOMPurify from "dompurify";

import "../../style/dektop/article-page.css";
import Heart from "../../style/res/icons/heart.png";
import HeartFilled from "../../style/res/icons/heart-filled.png";
import Save from "../../style/res/icons/save-instagram.png";
import SaveHover from "../../style/res/icons/bookmark.png";
import Share from "../../style/res/icons/share.png";
import ShareHover from "../../style/res/icons/share-hover.png";
import More from "../../style/res/icons/dots.png";
import MoreHover from "../../style/res/icons/dots-hover.png";


export default function ArticlePage() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [ author, setAuthor ] = useState(null);
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        
        axios.get(`${process.env.REACT_APP_API_URL}/public/article/${id}`)
            .then(res => setArticle(res.data))
            .catch(err => {
                console.error(err);
                setError("Failed to load article.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (article) {
            
            axios.get(`${process.env.REACT_APP_API_URL}/public/get-author/${article.creator_id}`).then(res => setAuthor(res.data.username)).catch(err => console.error('Error fetching author:', err));
        }
        
    }, [article])

    useEffect(() => {
        
        axios.get(`${process.env.REACT_APP_API_URL}/public/recent-articles`)
            .then(res => setArticles(res.data))
            .catch(err => console.error('Error fetching recent articles:', err));
    }, []);


    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!article) return <p>Article not found.</p>;


    const safeHtml = DOMPurify.sanitize(article.content || "");

    return (
        <div className="article-page">
            <div className="article-side-menu">

                <div className="article-menu-button">
                    <img src={Heart} className="icon"/>
                    <img src={HeartFilled} className="icon-hover"/>
                </div>

                <div className="article-menu-button">
                    <img src={Save} className="icon"/>
                    <img src={SaveHover} className="icon-hover"/>
                </div>

                <div className="article-menu-button">
                    <img src={Share} className="icon"/>
                    <img src={ShareHover} className="icon-hover"/>
                </div>

                <div className="article-menu-button">
                    <img src={More} className="icon"/>
                    <img src={MoreHover} className="icon-hover"/>
                </div>

            </div>

            <div className="article-section">
                <h1>{article.title}</h1>
                <p className="author-date">
                    by {author} • {new Date(article.created_at).toLocaleDateString()}
                </p>

                <div
                    className="article-body ql-editor"
                    dangerouslySetInnerHTML={{ __html: safeHtml }}
                />
            </div>

            <div className="article-suggested-panel">
                <h3>Recent Articles</h3>
                <div className="right-panel-recent-articles">
                    {articles.map(recent => (
                        <NavLink key={recent.id} className="right-recent-article" to={`/article/${recent.id}`}>
                            <div>
                                <h4>{recent.title}</h4>
                                <p>by {recent.username}</p>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>

        </div>
    );
}
