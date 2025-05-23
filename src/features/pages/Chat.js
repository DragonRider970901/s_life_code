import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MessagesWithUser from './MessagesWithUser';

export default function Chat() {
  const [partners, setPartners] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/admin/message-partners', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setPartners(res.data));
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

      <div className="message-viewer">
        {selected && <MessagesWithUser userId={selected} />}
      </div>
    </div>
  );
}
