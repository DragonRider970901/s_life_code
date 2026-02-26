import axios from "axios";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";


import "../../style/desktop.css";
import { useDispatch } from "react-redux";
import { fetchMe } from "../../store/userSlice";

export default function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { username, password });
            //console.log(res)
            if (res.data.token) {

                localStorage.setItem('token', res.data.token);
                //alert('Login successful!');
                dispatch(fetchMe());
                navigate('/');
                window.dispatchEvent(new Event('auth-changed'));

            } else {
                alert(res.data.message || 'Login failed. Please try again.')
            }
        } catch (err) {
            console.error(err);
            alert('An error occurred. Please try again');
        }

    }
    return (
        <>
            <div className="login-form-container">
                <h1>Log In</h1>

                <form onSubmit={handleLogin}>
                    <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username} />
                    <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} />
                    <button type="submit">Login</button>
                </form>

                <div className="login-to-signup">
                    <p>Don't have an account? </p>
                    <NavLink to='/signup' className="signup-link">Register for free here.</NavLink>
                </div>

                <div className="reset-password-link">
                    <p>Did you forget your password? </p>
                    <NavLink to='/forgot-password' className="reset-link">Create a new one here.</NavLink>
                </div>
            </div>
        </>

    );
}