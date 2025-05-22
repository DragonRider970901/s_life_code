import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";

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
            <h2>Welcome, {username}!</h2>
            {role === "admin" && (<AdminDashboardLayout />)}
            <div className="dashboard-root">
                <div className="dashboard-side-menu">
                    <button className="logout-button" onClick={() => {
                        localStorage.removeItem('token');
                        window.location.href = '/';
                        }}>
                        Logout
                    </button>
                </div>
            </div>
            
        </div>
    );
}