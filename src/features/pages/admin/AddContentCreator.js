import React, { useState } from 'react';
import axios from 'axios';
import "../../../style/dektop/add-content-creator.css";

export default function AddContentCreator() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleAdd = async () => {
    if (!username || !email) {
      alert('Please fill in both fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/admin/add-content-creator', {
        username,
        email
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Content creator added!');
      setUsername('');
      setEmail('');
    } catch (err) {
      console.error(err);
      alert('Failed to add content creator');
    }
  };

  return (
    <div className="add-creator-container">
      <h2>Add Content Creator</h2>
      <div className="creator-inputs">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
