import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContentCreatorData from './ContentCreatorData';

export default function ViewContentCreators() {
  const [creators, setCreators] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/admin/content-creators', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setCreators(res.data));
  }, []);

  return (
    <>
      <table>
        {/* header row */}
        <tbody>
          {creators.map(c => (
            <tr key={c.id} onClick={() => setSelected(c.id)}>
              <td>{c.id}</td>
              <td>{c.username}</td>
              <td>View</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && <ContentCreatorData id={selected} />}
    </>
  );
}
