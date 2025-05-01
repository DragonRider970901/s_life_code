import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:5000/login', { username, password });
            console.log(res)
            if (res.data.token) {
                
                localStorage.setItem('token', res.data.token);
                alert('Login successful!');
                
                navigate('/dashboard');
                
            } else {
                alert(res.data.message || 'Login failed. Please try again.')
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred. Please try again');
        }

    }
    return (
        <form onSubmit={handleLogin}> 
            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username} />
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
            <button type="submit">Login</button>
        </form>
    );
}