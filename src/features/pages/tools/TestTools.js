import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { determineType } from '../../../utils/personalityUtils';
import "../../../style/dektop/test-tools.css";

export default function TestTools() {
    const [tests, setTests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        axios.get(`${process.env.REACT_APP_API_URL}/admin/test-results`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setTests(res.data));
    }, []);

    const filtered = tests.filter(t => {
        const type = determineType(JSON.parse(t.result || '{}')); // ✅ safely get type
        return (
            t.user_id.toString().includes(searchTerm) ||
            t.date.includes(searchTerm) ||
            type.toLowerCase().includes(searchTerm.toLowerCase()) // ✅ fix error here
        );
    });

    return (
        <div className="test-tools">
            <h2>Test Tools</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>USER</th>
                        <th>DATE</th>
                        <th>TYPE</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map(test => {
                        let type = 'Unknown';

                        try {
                            if (test.result && test.result !== 'undefined') {
                                const parsed = JSON.parse(test.result);
                                type = determineType(parsed);
                            }
                        } catch (err) {
                            console.error('Invalid test result JSON', err);
                        }

                        return (
                            <tr key={test.id}>
                                <td>{test.id}</td>
                                <td>{test.user_id}</td>
                                <td>{test.date}</td>
                                <td>{type}</td>
                                <td className='test-tools-actions'>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="filter-row">
                <input
                    type="text"
                    placeholder="Search for test result by user id, type or date"
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
