import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

import "./style/desktop.css";
import Logo from "./style/res/_S_Life_Code.png";


export default function Root() {

    const [loggedIn, setLoggedIn] = useState(false);
    let location = useLocation();
    const isAuthPage = location.pathname === '/signup' || location.pathname === '/login';

    useEffect(() => {

        const checkLogin = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await axios.get('http://localhost:5000/me', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setLoggedIn(true);
                } catch (err) {
                    localStorage.removeItem('token');
                    setLoggedIn(false);
                }
            }

        }

        checkLogin();
        //console.log(location.pathname);
    }, []);

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
                    {loggedIn && (<NavLink to='dashboard' className="main-menu-link main-menu-profile">My Profile</NavLink>)}

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