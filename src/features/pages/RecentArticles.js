import axios from "axios";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function RecentArticles() {

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/public/recent-articles')
            .then(res => setArticles(res.data))
            .catch(err => console.error('Error fetching recent articles:', err));
    }, []);
    return (
        <div className="recent-articles-div">
            {/* 📰 Recent Articles Section */}
            <section className="recent-articles">
                <h2>📰 Recent Articles</h2>
                {articles.map(article => (
                    <div key={article.id} className="article-card">
                        <h3>{article.title}</h3>
                        <p className="author-date">
                            by {article.username} • {new Date(article.created_at).toLocaleDateString()}
                        </p>
                        <p className="preview">{article.contentPreview}</p>
                        <NavLink to={`/article/${article.id}`}>Read More →</NavLink>
                    </div>
                ))}
            </section>
        </div>
    )
}