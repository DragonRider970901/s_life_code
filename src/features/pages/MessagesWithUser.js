import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../style/dektop/messages-with-user.css'; // We'll style it next
import { useSelector } from 'react-redux';

export default function MessagesWithUser({ userId, role }) {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');


  const user = useSelector(s => s.user.data);

  const fetchMessages = () => {
    
    const token = localStorage.getItem('token');
    
    axios.get(`${window.location.origin}/${role}/messages/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMessages(res.data));
  };

  

  useEffect(() => {
    console.log("ROLE IN MessagesWithUser: ", role);
    fetchMessages();
    
  }, [userId]);

  const handleSend = async (e) => {
    e.preventDefault();
    

    const token = localStorage.getItem('token');
    try {
      //console.log("I am here!");
     
      await axios.post(`${window.location.origin}/${role}/send-message`, {
        receiverId: userId,
        message: newMsg
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMsg('');
      alert('Message sent!');
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
          <div key={msg.id} className={`chat-bubble ${msg.sender_id === user.id ? 'sent' : 'received'}`}>
            <div className='chat-bubble-text'><p>{msg.message}</p></div>
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
