import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../../style/dektop/access-logs.css";

export default function AccessLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    axios.get(`${process.env.REACT_APP_API_URL}/admin/access-logs`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setLogs(res.data));
  }, []);

  const filtered = logs.filter(log =>
    log.username.toLowerCase().includes(search.toLowerCase()) ||
    log.role.toLowerCase().includes(search.toLowerCase()) ||
    log.ip_address.includes(search)
  );

  return (
    <div className="access-logs">
      <h2>Access Logs</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>USER</th>
            <th>ROLE</th>
            <th>ACTION</th>
            <th>IP</th>
            <th>TIME</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(log => (
            <tr key={log.id}>
              <td>{log.id}</td>
              <td>{log.username}</td>
              <td>{log.role}</td>
              <td>{log.action}</td>
              <td>{log.ip_address}</td>
              <td>{log.time}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="filter-row">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select>
          <option>4</option>
          <option>10</option>
          <option>25</option>
        </select>
      </div>
    </div>
  );
}
