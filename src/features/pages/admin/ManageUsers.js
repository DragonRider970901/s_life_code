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

    const token = localStorage.getItem('token');
    const FRONTEND_URL = process.env.FRONTEND_URL;
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${FRONTEND_URL}/admin/users`, {
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


    const handleDelete = async (id) => {
        const confirm = window.confirm('Are you sure you want to delete this user?');
        if (!confirm) return;

        try {
            await axios.delete(`${FRONTEND_URL}/admin/users/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const handleUpdate = async (id, newRole) => {
        try {
            await axios.put(`${FRONTEND_URL} /admin/users/${id}`, { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUsers((prev) =>
                prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
            );
        } catch (err) {
            alert('Failed to update role');
        }
    };

    return (
        <div className="manage-users-container">
            <h2>Manage Users</h2>

            <div className="filters">
                <input
                    placeholder="Search user by id, username or role"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='search'
                />

                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className='filter-role'>
                    <option value="">All roles</option>
                    <option value="user">User</option>
                    <option value="creator">Content Creator</option>
                    <option value="admin">Admin</option>
                </select>

                <label className='rows-visible'>
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
                        <th className='table-header'>ID</th>
                        <th className='table-header'>USERNAME</th>
                        <th className='table-header'>ROLE</th>
                        <th className='table-header'>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedUsers.map((user) => (
                        <UserRow
                            key={user.id}
                            user={user}
                            onDelete={handleDelete}
                            onEdit={handleUpdate}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
