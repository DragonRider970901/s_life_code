import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


import "../../../style/dektop/change-password.css";

export default function ChangePassword() {

    const [userId, setUserId] = useState();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        if (!currentPassword || !newPassword) {
            alert("Please fill in both fields!");
        }

        if (newPassword.length < 8) {
            alert("New password should be at least 8 characters long!");
        }


        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/me/change-password`, { userId, currentPassword, newPassword }, { headers: { Authorization: `Bearer ${token}` } });
            alert('Password changed successfuly!');
            setCurrentPassword('');
            setNewPassword('');
            navigate("/login");

        } catch (err) {
            console.log(err);
            alert('Failed to change password');
        }

    }
    return (
        <div className="change-password">
            <h2>Change Password</h2>

            <form className="form" onSubmit={handleSubmit}>
                <div className="change-password-input-fields">
                    <input type="password" name="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Current Password" />
                    <input type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                </div>

                <button type="submit">Done</button>
            </form>


        </div>);
}