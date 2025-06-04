import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MessagesWithUser from './MessagesWithUser';
import StartNewChat from '../components/StartNewChat';

export default function Chat() {
  const [partners, setPartners] = useState([]);
  const [selected, setSelected] = useState(null);
  const [role, setRole] = useState('');

  const fetchPartners = async (role, token) => {
    try {
      const res = await axios.get(`http://localhost:5000/${role}/message-partners`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPartners(res.data);
    } catch (err) {
      console.error("Failed to fetch message partners:", err);
    }
  };


  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://localhost:5000/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      const userRole = res.data.role;
      setRole(userRole);
      fetchPartners(userRole, token);

    }).then(res => setPartners(res.data))
      .catch(err => {
        console.error('Failed to fetch user role:', err);
      })

  }, []);

  return (
    <div className="chats-page">
      <div className="partner-list">
        <h3>Conversations</h3>



        <ul>
          {partners.map(p => (
            <li key={p.id} onClick={() => setSelected(p.id)}>
              {p.username} ({p.role})
            </li>
          ))}
        </ul>
      </div>
      <StartNewChat role={role} onNewChat={() => {
        const token = localStorage.getItem('token');
        fetchPartners(role, token);
      }} />
      <div className="message-viewer">
        {selected && <MessagesWithUser userId={selected} role={role} />}
      </div>
    </div>
  );
}
