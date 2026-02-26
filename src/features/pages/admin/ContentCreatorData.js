import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../../style/dektop/view-content-creators.css";


export default function ContentCreatorData({ id }) {
  const [info, setInfo] = useState(null);
  const [content, setContent] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    axios.get(`${window.location.origin}/admin/creator/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setInfo(res.data))
      .catch(err => console.error("Error fetching creator info:", err.response?.data || err.message));

    axios.get(`${window.location.origin}/admin/creator-content/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log("Content fetched:", res.data);
        setContent(res.data);
      })
      .catch(err => console.error("Error fetching content:", err.response?.data || err.message));
  }, [id]);


  if (!info) return <p>Loading...</p>;

  return (
    <div>
      <h3>{info.username}</h3>
      <p>ID: {info.id}</p>
      <p>Joined: {new Date(info.joined).toLocaleDateString()}</p>
      <p>Articles: {info.articles}</p>
      <p>Surveys: {info.surveys}</p>

      <h4>Content Created</h4>
      <table>
        <thead>
          <tr><th>ID</th><th>Title</th><th>Type</th><th>Date</th></tr>
        </thead>
        <tbody>
          {content.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.title}</td>
              <td>{c.type}</td>
              <td>{new Date(c.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
