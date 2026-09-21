import React, { useState } from "react";
import axios from "axios";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import "../../style/desktop.css";
import "../../style/dektop/signup.css";

import { useTranslation } from "react-i18next";

export default function Signup() {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [ email, setEmail ] = useState();
    const [ confirmPassword, setConfirmPassword ] = useState();

    const { t } = useTranslation("auth");

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
            <h1>{t("signup.title")}</h1>
            <form onSubmit={handleSignup}>
                <input placeholder={t("signup.username")} onChange={(e) => setUsername(e.target.value)} value={username}/>
                <input placeholder={t("signup.email")} onChange={(e) => setEmail(e.target.value)} value={email} />
                <input placeholder={t("signup.password")} type="password" onChange={(e) => setPassword(e.target.value)} value={password}/>
                <input placeholder={t("signup.confirmPassword")} type="password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
                <button type="submit">{t("signup.submit")}</button>
            </form>
            <div className="signup-to-login">
                <p>{t("signup.accountExists")}</p>
                <NavLink to="/login" className="login-link">{t("signup.loginlink")}</NavLink>
            </div>
        </div>
        
        </>
    );
}