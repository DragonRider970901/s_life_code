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
        //console.log("Token:",token);
        if(token) {
            axios.get('http://localhost:5000/me', {
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