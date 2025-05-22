import React, { useState }from 'react';

export default function UserRow({ user, onDelete, onEdit }) {

    const [editing, setEditing] = useState(false);
    const [newRole, setNewRole] = useState(user.role);

    const handleSave = () => {
        if (newRole !== user.role) {
            onEdit(user.id, newRole);
        }
        setEditing(false);
    };

    return (
        <tr>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>
                {editing ? (
                    <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="creator">Content Creator</option>
                        <option value="admin">Admin</option>
                    </select>
                ) : (
                    user.role
                )}
            </td>
            <td>{user.role}</td>
            <td>
                <button title="Delete" onClick={() => onDelete(user.id)} style={{ marginRight: '10px' }}>
                    ✖
                </button>
                {!editing ? (
                    <button title="Edit" onClick={() => setEditing(true)}>✏️</button>
                ) : (
                    <button title="Save" onClick={handleSave}>💾</button>
                )}
                
            </td>
        </tr>
    );
}
