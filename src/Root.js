import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

import "./style/desktop.css";
import Logo from "./style/res/_S_Life_Code.png";

import { useDispatch, useSelector } from 'react-redux';
import { fetchMe, clearUser } from './store/userSlice';

export default function Root() {

    const [loggedIn, setLoggedIn] = useState(false);
    let location = useLocation();
    const dispatch = useDispatch();

    const isAuthPage = location.pathname === '/signup' || location.pathname === '/login';

    const checkLogin = async () => {
        const token = localStorage.getItem('token');
        if (!token) return setLoggedIn(false);
        try {
            await axios.get('http://localhost:5000/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoggedIn(true);
        } catch {
            localStorage.removeItem('token');
            setLoggedIn(false);
        }
    };

    useEffect(() => { checkLogin(); }, [location.pathname]);

    useEffect(() => {
        // if token exists, populate user on app load / route change
        if (localStorage.getItem('token')) dispatch(fetchMe());
        else dispatch(clearUser());

    }, [location.pathname]);

    useEffect(() => {
        const handler = () => {
            if (localStorage.getItem('token')) dispatch(fetchMe());
            else dispatch(clearUser());
        };
        window.addEventListener('auth-changed', handler);
        return () => window.removeEventListener('auth-changed', handler);
    }, [dispatch]);


    return (
        <div className="root">
            <div className="header">
                <img src={Logo} className="logo" />
                <nav className="main-nav">
                    <NavLink to='/' className="main-menu-link">Home</NavLink>
                    <NavLink to='test' className="main-menu-link">Test</NavLink>
                    {!loggedIn && !isAuthPage &&
                        (<>
                            <NavLink to='signup' className="main-menu-link" >Signup</NavLink>
                            <NavLink to='login' className="main-menu-link">Login</NavLink>
                        </>)
                    }
                    {loggedIn && (<NavLink to='dashboard/overview' className="main-menu-link main-menu-profile">My Profile</NavLink>)}

                </nav>
            </div>

            <Outlet />

            <div className="footer">
                <p className="copyright">@Copyright Inana Susa, 2025</p>
                <p className="location">Alba Iulia, Alba, Romania</p>
            </div>
        </div>
    );

}