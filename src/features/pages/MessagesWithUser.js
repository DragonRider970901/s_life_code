import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../style/dektop/messages-with-user.css'; // We'll style it next

export default function MessagesWithUser({ userId }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');

  const fetchMessages = () => {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:5000/admin/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMessages(res.data));
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  const handleSend = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/admin/send-message', {
        receiverId: userId,
        message: newMsg
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMsg('');
      fetchMessages();
    } catch (err) {
      alert('Failed to send message.');
    }
  };

  const adminId = parseInt(localStorage.getItem('userId'));

  return (
    <div className="chat-container">
      <div className="chat-thread">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-bubble ${msg.sender_id === adminId ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>
            <span className="chat-time">{new Date(msg.sent_at).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <form className="chat-input-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
