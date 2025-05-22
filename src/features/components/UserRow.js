import React from 'react';

export default function UserRow({ user, onDelete, onEdit }) {
  return (
    <tr>
      <td>{user.id}</td>
      <td>{user.username}</td>
      <td>{user.role}</td>
      <td>
        <button title="Delete" onClick={() => onDelete(user.id)} style={{ marginRight: '10px' }}>
          ✖
        </button>
        <button title="Edit" onClick={() => onEdit(user.id)}>✏️</button>
      </td>
    </tr>
  );
}
