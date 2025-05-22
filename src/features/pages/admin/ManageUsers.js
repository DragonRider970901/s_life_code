import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserRow from '../../components/UserRow';
import "../../../style/dektop/manage-users.css";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [rowsVisible, setRowsVisible] = useState(4);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/admin/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(res.data);
            } catch (err) {
                console.error('Failed to load users', err);
                alert('Failed to load users');
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        let filtered = [...users];

        // search
        if (search) {
            filtered = filtered.filter(
                (user) =>
                    user.id.toString().includes(search) ||
                    user.username.toLowerCase().includes(search.toLowerCase()) ||
                    user.role.toLowerCase().includes(search.toLowerCase())
            );
        }

        // role filter
        if (roleFilter) {
            filtered = filtered.filter((user) => user.role === roleFilter);
        }

        // limit rows
        setDisplayedUsers(filtered.slice(0, rowsVisible));
    }, [search, roleFilter, rowsVisible, users]);

    return (
        <div className="manage-users-container">
            <h2>Manage Users</h2>

            <div className="filters">
                <input
                    placeholder="Search user by id, username or role"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                    <option value="">All roles</option>
                    <option value="user">User</option>
                    <option value="creator">Content Creator</option>
                    <option value="admin">Admin</option>
                </select>

                <label>
                    Rows visible:
                    <input
                        type="number"
                        value={rowsVisible}
                        min="1"
                        max="100"
                        onChange={(e) => setRowsVisible(parseInt(e.target.value))}
                    />
                </label>
            </div>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>USERNAME</th>
                        <th>ROLE</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedUsers.map((user) => (
                        <UserRow
                            key={user.id}
                            user={user}
                            onDelete={(id) => alert(`Delete user ID: ${id}`)}
                            onEdit={(id) => alert(`Edit user ID: ${id}`)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
