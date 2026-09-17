import axios from "axios";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import '../../style/dektop/recent-articles.css';

export default function RecentArticles() {

    const { t } = useTranslation("home");

    const [articles, setArticles] = useState([]);

    useEffect(() => {
       
        axios.get(`${process.env.REACT_APP_API_URL}/public/recent-articles`)
            .then(res => setArticles(res.data))
            .catch(err => console.error('Error fetching recent articles:', err));
    }, []);
    return (
        <div className="recent-articles-div">
            {/* 📰 Recent Articles Section */}
            <section className="recent-articles">
                <h2>{t("recentArticles")}</h2>
                <div className="article-cards-container">
                    {articles.map(article => (
                        <div key={article.id} className="article-card">
                            <div className="title-preview">
                                <h3>{article.title}</h3>
                                <p className="author-date">
                                    by {article.username} • {new Date(article.created_at).toLocaleDateString()}
                                </p>
                                <p className="preview">{article.contentPreview}</p>
                            </div>
                            <NavLink to={`/article/${article.id}`} className="read-more">READ</NavLink>
                        </div>
                    ))}
                </div>

            </section>
        </div>
    )
}