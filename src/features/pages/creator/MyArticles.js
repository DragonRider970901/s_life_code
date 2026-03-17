import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


import "../../../style/dektop/my-articles.css";

export default function MyArticles() {
    const [articles, setArticles] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    const token = localStorage.getItem('token');
    
     const fetchArticles = useCallback(async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/creator/articles`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setArticles(res.data);
        } catch (err) {
            console.error("Failed to fetch articles:", err);
        }
    }, [token]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const handleDelete = async (id) => {
        
        if (window.confirm("Are you sure you want to delete this article?")) {
            await axios.delete(`${process.env.REACT_APP_API_URL}/creator/articles/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchArticles();
        }
    };

    const startEdit = (article) => {
        setEditingId(article.id);
        setEditTitle(article.title);
        setEditContent(article.content);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle('');
        setEditContent('');
    };

    const handleEditSubmit = async (id) => {
        
        await axios.put(`${process.env.REACT_APP_API_URL}/creator/articles/${id}`, {
            title: editTitle,
            content: editContent
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        cancelEdit();
        fetchArticles();
    };

    return (
        <div className="my-articles">
            <h2>My Articles</h2>
            <table>
                <thead>
                    <tr><th>ID</th><th>Title</th><th>Created At</th><th>Actions</th></tr>
                </thead>
                <tbody>
                    {articles.map(article => (
                        editingId === article.id ? (
                            <tr key={article.id}>
                                <td>{article.id}</td>
                                <td colSpan="4">
                                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                    <ReactQuill
                                        theme="snow"
                                        value={editContent}
                                        onChange={setEditContent}
                                        style={{ minWidth: '300px', marginBottom: '20px', marginTop: '1rem' }}
                                    />

                                    <button onClick={() => handleEditSubmit(article.id)}>Save</button>
                                    <button onClick={cancelEdit}>Cancel</button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={article.id}>
                                <td>{article.id}</td>
                                <td>{article.title}</td>
                                <td>{new Date(article.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => startEdit(article)}>✏️</button>
                                    <button onClick={() => handleDelete(article.id)}>❌</button>
                                </td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
    );
}
