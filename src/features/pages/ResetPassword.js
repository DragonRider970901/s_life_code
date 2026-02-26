import React, { useState } from "react";
import axios from "axios";
import  { useParams, useNavigate } from 'react-router-dom';
export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [ password, setPassword ] = useState('');
    const [ confirm, setConfirm ] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();

        if (password !== confirm) {
            alert('Passwords do not match!');

            return;


        }

        try {
            
            await axios.post(`${window.location.origin}/reset-password/${token}`, { password, });

            alert('Password reset successful! You can now log in.');
            navigate('/login');

        } catch(err) {

            console.error(err);
            alert('Invalid or expired token. Please try again.');
        }
    }

    return (
        <div className="reset-password-container">
            <h1>Set New Password</h1>

            <form onSubmit={handleReset}>
                <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" placeholder="Confirm New Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );

}