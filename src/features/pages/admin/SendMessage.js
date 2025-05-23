import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SendMessage() {
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data));
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post('http://localhost:5000/admin/send-message',
        { receiverId, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Message sent!');
      setMessage('');
    } catch (err) {
      console.error(err);
      alert('Failed to send message');
    }
  };

  return (
    <div className="form-container">
      <h2>Send Direct Message</h2>
      <form onSubmit={handleSend}>
        <select value={receiverId} onChange={e => setReceiverId(e.target.value)}>
          <option value="">Select user</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
          ))}
        </select>
        <textarea
          placeholder="Enter your message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
