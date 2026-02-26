import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {

    const [ email, setEmail ] = useState('');
    const [ sent, setSent ] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            
            await axios.post(`${window.location.origin}/forgot-password`, { email });
            setSent(true);
        } catch(err) {
            alert('Email not found or error sending reset link.');
        }
    };

    return (
        <div className="forgot-pass-form-cont">
            <h1>Reset Password</h1>
            {sent ? (
                <p>A password reset link has been sent to your email.</p>
            ): (
                <form onSubmit={handleSubmit}>
                    <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <button type="submit">Send Reset Link</button>
                </form>
            )}
        </div>
    );
}