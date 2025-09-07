import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../style/dektop/user-dashboard.css";

export default function UserSidebar() {
    const [openMenu, setOpenMenu] = useState(null);
     const [profilePic, setProfilePic] = useState(null);

    const toggleMenu = (menu) => {
        setOpenMenu((prev) => (prev === menu ? null : menu));
    }
     useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get("http://localhost:5000/me", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                
                setProfilePic(res.data.profilePic); // this should be the filename
                
            })
            .catch((err) => console.error("Failed to fetch user info", err));
    }, []);

    return (
        <div className="sidebar-container">
            <div className="profile-picture"> <img
                src={profilePic ? `http://localhost:5000${profilePic}` : "/default-profile.png"}
                alt="Profile"
                className="profile-img"
            />
            </div>

            <div className="accordion-section">
                <p onClick={() => toggleMenu("profile")}>My Profile</p>
                {openMenu === "profile" && (
                    <div className="submenu">
                        <NavLink to='/dashboard/overview' className="admin-menu-link">Overview</NavLink>
                        <NavLink to="/user/edit-profile" className="admin-menu-link">Edit Profile</NavLink>
                        <NavLink to="/user/change-password" className="admin-menu-link">Change Password</NavLink>
                        <NavLink to="/user/chats" className="admin-menu-link">Chats</NavLink>
                        <NavLink to="/user/notifications" className="admin-menu-link">Notifications</NavLink>
                        <NavLink to="/user/logout" className="admin-menu-link">Log out</NavLink>
                        
                    </div>
                )}
            </div>
        </div>
    );
}