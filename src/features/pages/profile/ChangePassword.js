import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {

    const [ userId, setUserId ] = useState();
    const [ currentPassword, setCurrentPassword ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');

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
            const res = await axios.post('http://localhost:5000/me/change-password', {userId, currentPassword, newPassword}, {headers: {Authorization: `Bearer: ${token}`}});
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
    <div>
        Change Password

        <form className="form" onSubmit={handleSubmit}>
            <input type="password" name="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
            <input type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
            <button type="submit">Done</button>
        </form>

        
    </div>);
}