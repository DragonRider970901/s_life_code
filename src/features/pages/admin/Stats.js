import axios from "axios";
import React, { useEffect, useState } from "react";
import "../../../style/desktop.css";

export default function Stats() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        normalUsers: 0,
        contentCreators: 0,
        admins: 0,
        testsTaken: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(res.data);
            } catch (err) {
                console.log('Failed to load stats: ', err);
                alert('Failed to load statistics');
            }
        };

        fetchStats();
    }, []);
    return (
        <div className="stats-container">
            <h2>Stats</h2>
            <ul>
                <li><span className="table-header">Total users</span> <span className="table-value">{stats.totalUsers}</span></li>
                <li><span className="table-header">Normal users</span> <span className="table-value">{stats.normalUsers}</span></li>
                <li><span className="table-header">Content creators</span> <span className="table-value">{stats.contentCreators}</span></li>
                <li><span className="table-header">Admins</span> <span className="table-value">{stats.admins}</span></li>
                <li><span className="table-header">Tests taken</span> <span className="table-value">{stats.testsTaken}</span></li>
            </ul>
        </div>);
}