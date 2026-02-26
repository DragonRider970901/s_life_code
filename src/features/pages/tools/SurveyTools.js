import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../../style/dektop/survey-tools.css";

export default function SurveyTools() {
  const [surveys, setSurveys] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    axios.get(`${window.location.origin}/admin/surveys`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setSurveys(res.data));
  }, []);

  const filtered = surveys.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.creator_id.toString().includes(searchTerm) ||
    s.created_at.includes(searchTerm)
  );

  return (
    <div className="survey-tools">
      <h2>Survey Tools</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>CREATOR</th>
            <th>TITLE</th>
            <th>DATE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(survey => (
            <tr key={survey.id}>
              <td>{survey.id}</td>
              <td>{survey.creator_id}</td>
              <td>{survey.title}</td>
              <td>{survey.created_at}</td>
              <td className='survey-tools-actions'>
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
          placeholder="Search by creator, title or date"
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
