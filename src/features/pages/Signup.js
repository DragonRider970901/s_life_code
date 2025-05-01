import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

export default function Signup() {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();
    const handleSignup = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:5000/signup', { username, password });
            alert('Signup successful!');
            navigate('/login');
        } catch (err) {
            console.log(err);
            alert('Signup failed. Please try again.');
        }


    }


    return (
        <form onSubmit={handleSignup}>
            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username}/>
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
            <button type="submit">Signup</button>
        </form>
    );
}