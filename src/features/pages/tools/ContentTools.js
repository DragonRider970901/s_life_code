import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../../style/dektop/content-tools.css";

export default function ContentTools() {
  const [content, setContent] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    axios.get(`${process.env.REACT_APP_API_URL}/admin/all-content`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setContent(res.data));
  }, []);

  const filtered = content.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.creator_id.toString().includes(searchTerm) ||
    item.type.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="content-tools">
      <h2>Content Tools</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>CREATOR</th>
            <th>TITLE</th>
            <th>TYPE</th>
            <th>DATE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.creator_id}</td>
              <td>{item.title}</td>
              <td>{item.type}</td>
              <td>{item.date}</td>
              <td className='content-tools-actions'>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="filter-row">
        <input
          type="text"
          placeholder="Search by creator, title, or type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label>Rows visible:</label>
        <select>
          <option>4</option>
          <option>10</option>
          <option>25</option>
        </select>
      </div>
    </div>
  );
}
