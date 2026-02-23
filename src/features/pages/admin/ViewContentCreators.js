import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContentCreatorData from './ContentCreatorData';
import "../../../style/dektop/view-content-creators.css";

export default function ViewContentCreators() {
  const [creators, setCreators] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filteredCreators = creators.filter(c =>
    c.username.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toString().includes(search)
  );



  useEffect(() => {
    const token = localStorage.getItem('token');
    const FRONTEND_URL = process.env.FRONTEND_URL;
    axios.get(`${FRONTEND_URL}/admin/content-creators`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCreators(res.data));
  }, []);

  return (
    <>
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search by ID or username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <table>
        {/* header row */}
        <tbody>
          {filteredCreators.map(c => (
            <tr key={c.id} onClick={() => setSelected(c.id)}>
              <td>{c.id}</td>
              <td>{c.username}</td>
              <td className="action-cell">View</td>
            </tr>
          ))}
        </tbody>

      </table>

      {selected && <ContentCreatorData id={selected} />}
    </>
  );
}
