import React from "react";

export default function Logout() {
    return (
        <div>
            <button className="logout-button" onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/';
            }}>
                Logout
            </button>
        </div>);
}