import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import CreatorDashboardLayout from "../layouts/CreatorDashboardLayout";
import UserDashboardLayout from "../layouts/UserDashboardLayout";

export default function Dashboard() {

    const [ username, setUsername ] = useState('');
    const [ role, setRole ] = useState('');

    useEffect(() => {

        const token = localStorage.getItem('token');
        const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || 'http://localhost:3000';
        //console.log("Token:",token);
        if(token) {
            axios.get(`${FRONTEND_URL}/me`, {
                headers: { Authorization: `Bearer ${token}`},
            }).then((res) => {
                setRole(res.data.role);
                setUsername(res.data.username);
            }).catch((err) => {
                alert('Failed to fetch user data.');
            })
        }
    }, []);


    return (
        <div>
            
            {role === "admin" && (<AdminDashboardLayout username={username}/>)}
            {role === "creator" && (<CreatorDashboardLayout username={username}/>)}
            {role === 'user' && (<UserDashboardLayout username={username} />)}
            <div className="dashboard-root">
                
            </div>
            
        </div>
    );
}