import React, { useState } from 'react';
import axios from 'axios';

import "../../../style/dektop/create-article.css";

export default function CreateArticle() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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
      <h1>Create Article</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          rows="10"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
}
