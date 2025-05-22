import React, { useState }from 'react';
import "../../style/dektop/manage-users.css";

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
            <td className='table-value'>{user.id}</td>
            <td className='table-value'>{user.username}</td>
            <td className='table-value'>
                {editing ? (
                    <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className='table-role'>
                        <option value="user" >User</option>
                        <option value="creator" >Content Creator</option>
                        <option value="admin" >Admin</option>
                    </select>
                ) : (
                    user.role
                )}
            </td>
            <td className='table-value'>{user.role}</td>
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
