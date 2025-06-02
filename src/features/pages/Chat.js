import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MessagesWithUser from './MessagesWithUser';
import StartNewChat from '../components/StartNewChat';

export default function Chat() {
  const [partners, setPartners] = useState([]);
  const [selected, setSelected] = useState(null);
  const [role, setRole] = useState('');
  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const userRole = res.data.role;
      setRole(userRole);
      return axios.get(`http://localhost:5000/${userRole}/message-partners`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }).then(res => setPartners(res.data))
      .catch(err => {
        console.error('Failed to fetch user role:', err);
      })

  }, []);

  return (
    <div className="chats-page">
      <div className="partner-list">
        <h3>Conversations</h3>

        <StartNewChat />
        
        <ul>
          {partners.map(p => (
            <li key={p.id} onClick={() => setSelected(p.id)}>
              {p.username} ({p.role})
            </li>
          ))}
        </ul>
      </div>

      <div className="message-viewer">
        {selected && <MessagesWithUser userId={selected} role={role} />}
      </div>
    </div>
  );
}
