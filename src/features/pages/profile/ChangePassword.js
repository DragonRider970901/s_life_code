import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {

    const [ userId, setUserId ] = useState();
    const [ currentPassword, setCurrentPassword ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if(token) {
            axios.get('http://localhost:5000/me', {
                headers: {Authorization: `Bearer: ${token}`},
            }).then((res) => {setUserId(res.data.id)})
            .catch((err) => alert('Failed to fetch user data'));
        }

    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        

        try {
            const res = await axios.post('http://localhost:5000/me/change-password', {userId, currentPassword, newPassword}, {headers: {Authorization: `Bearer: ${token}`}});
            alert('Password changed successfuly!');
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