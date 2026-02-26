import React, { useState } from "react";
import axios from "axios";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import "../../style/desktop.css";

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
            
            await axios.post(`${process.env.REACT_APP_API_URL}/signup`, { username, email, password });
            //alert('Signup successful!');
            navigate('/login');
        } catch (err) {
            console.log(err);
            alert('Signup failed. Please try again.');
        }


    }


    return (
        <>

        <div className="signup-form-container">
            <h1>Sign Up</h1>
            <form onSubmit={handleSignup}>
                <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} value={username}/>
                <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
                <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                <input placeholder="Confirm Password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                <button type="submit">Signup</button>
            </form>
            <div className="signup-to-login">
                <p>Already have an account? </p>
                <NavLink to="/login" className="login-link">Log in here.</NavLink>
            </div>
        </div>
        
        </>
    );
}