import React, { useState } from 'react';
import axios from 'axios';


import "../../../style/dektop/add-admin.css";

export default function AddAdmin() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('http://localhost:5000/admin/add-admin',
        { username, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Admin added successfully!');
      setGeneratedPassword(res.data.generatedPassword);
    } catch (err) {
      console.error(err);
      alert('Failed to add admin.');
    }
  };

  return (
    <div className="add-admin-form-container">
      <h2>Add Admin</h2>
      <form onSubmit={handleSubmit}>
        <div className='add-admin-inputs'>
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <button type="submit">Add</button>
      </form>
      {generatedPassword && (
        <div className="generated-password">
          <p>Generated password: <strong>{generatedPassword}</strong></p>
        </div>
      )}
    </div>
  );
}
