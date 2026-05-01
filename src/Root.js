import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

import "./style/desktop.css";
//import Logo from "./style/res/Untitled_Artwork.jpg";
import Logo from "./style/res/SmileyFaceLogo.png";
import { useDispatch } from 'react-redux';
import { fetchMe, clearUser } from './store/userSlice';
import Menu from "./style/res/icons/menu.png";
import Close from "./style/res/icons/close.png";

export default function Root() {

    const [loggedIn, setLoggedIn] = useState(false);
    let location = useLocation();
    const dispatch = useDispatch();

    const [showmenu, setShowMenu] = useState(false);

    const isAuthPage = location.pathname === '/signup' || location.pathname === '/login';

    const checkLogin = async () => {
        const token = localStorage.getItem('token');

        if (!token) return setLoggedIn(false);
        try {
            await axios.get(`${process.env.REACT_APP_API_URL}/me`, {
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

    }, [location.pathname, dispatch]);

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
                <NavLink to="/"><img src={Logo} className="logo" alt="Logo" /></NavLink>
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

                {!isAuthPage &&
                    (<img src={Menu} alt="menu icon" className={`phone-menu ${showmenu ? 'hidden' : ''}`} onClick={() => setShowMenu(true)} />)}

            </div>
            <nav className={`phone-nav ${showmenu ? 'show' : 'hidden'}`}>
                <div className="phone-nav-background">
                    <img src={Close} alt="close icon" className={`close-menu ${showmenu ? '' : 'hidden'}`} onClick={() => setShowMenu(false)} />

                    <NavLink to='/' className="main-menu-link" onClick={() => setShowMenu(false)}>HOME</NavLink>
                    <NavLink to='test' className="main-menu-link" onClick={() => setShowMenu(false)}>TEST</NavLink>
                    {!loggedIn && !isAuthPage &&
                        (<>
                            <NavLink to='signup' className="main-menu-link" onClick={() => setShowMenu(false)}>SIGNUP</NavLink>
                            <NavLink to='login' className="main-menu-link" onClick={() => setShowMenu(false)}>LOGIN</NavLink>
                        </>)
                    }
                    {loggedIn && (
                        <NavLink to='dashboard/overview' className="main-menu-link main-menu-profile">My Profile</NavLink>
                    )}

                </div>
            </nav>
            <Outlet />

            <div className="footer">
                <p className="copyright">@Copyright Inana Susa, 2025</p>
                <p className="location">Alba Iulia, Alba, Romania</p>
            </div>
        </div>
    );

}