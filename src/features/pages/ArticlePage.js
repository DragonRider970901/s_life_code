import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ArticlePage() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/public/article/${id}`)
            .then(res => setArticle(res.data))
            .catch(err => {
                console.error(err);
                setError("Failed to load article.");
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!article) return <p>Article not found.</p>;

    return (
        <div className="article-page">
            <h1>{article.title}</h1>
            <p className="author-date">
                by {article.username} • {new Date(article.created_at).toLocaleDateString()}
            </p>
            <div className="content">{article.content}</div>
        </div>
    );
}
