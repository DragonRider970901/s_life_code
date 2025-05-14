import React, { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";

export default function Dashboard() {

    const [ username, setUsername ] = useState('');

    useEffect(() => {

        const token = localStorage.getItem('token');
        //console.log("Token:",token);
        if(token) {
            axios.get('http://localhost:5000/me', {
                headers: { Authorization: `Bearer ${token}`},
            }).then((res) => {
                setUsername(res.data.username);
            }).catch((err) => {
                alert('Failed to fetch user data.');
            })
        }
    }, []);


    return (
        <div>
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
            <h2>Welcome, {username}!</h2>
        </div>
    );
}