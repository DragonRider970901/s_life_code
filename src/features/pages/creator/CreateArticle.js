import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';

import "../../../style/dektop/create-article.css";
import 'react-quill/dist/quill.snow.css';


export default function CreateArticle() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean']
        ]
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const res = await axios.post('http://localhost:5000/creator/articles', {
                title,
                content
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(res.data.message);
            setTitle('');
            setContent('');
        } catch (err) {
            console.error(err);
            alert('Failed to create article');
        }
    };

    return (
        <div className="create-article-container">
            <h2>Create Article</h2>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className='input-title'
                />
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                />

                <button type="submit">Publish</button>
            </form>
        </div>
    );
}
