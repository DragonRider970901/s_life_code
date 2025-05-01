import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./style/desktop.css";
import Logo from "./style/res/_S_Life_Code.png";


export default function Root() {

    return (
        <div className="root">
            <div className="header">
                <img src={Logo} className="logo"/>
                <nav className="main-nav">
                    <NavLink to='/' className="main-menu-link">Home</NavLink>
                    <NavLink to='test' className="main-menu-link">Test</NavLink>
                    <NavLink to='signup' className="main-menu-link">Signup</NavLink>
                    <NavLink to='login' className="main-menu-link">Login</NavLink>
                    <NavLink to='dashboard' className="main-menu-link main-menu-profile">My Profile</NavLink>
                </nav>
            </div>
            
            <Outlet />
        </div>
    );

}