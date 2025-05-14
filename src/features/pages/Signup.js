import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

export default function Signup() {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [ email, setEmail ] = useState();
    const [ confirmPassword, setConfirmPassword ] = useState();

    const navigate = useNavigate();
    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
        }

        try {

            await axios.post('http://localhost:5000/signup', { username, email, password });
            alert('Signup successful!');
            navigate('/login');
        } catch (err) {
            console.log(err);
            alert('Signup failed. Please try again.');
        }


    }


    return (
        <>

        <div className="signup-form-container">
            <form onSubmit={handleSignup}>
                <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username}/>
                <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
                <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                <input placeholder="Confirm Password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                <button type="submit">Signup</button>
            </form>
        </div>
        
        </>
    );
}