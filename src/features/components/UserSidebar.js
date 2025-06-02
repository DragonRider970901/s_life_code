import { NavLink } from "react-router-dom";
import React, { useState } from "react";

export default function UserSidebar() {
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menu) => {
        setOpenMenu((prev) => (prev === menu ? null : menu));
    }

    return (
        <div className="sidebar-container">
            <div className="profile-picture"> </div>

            <div className="accordion-section">
                <p onClick={() => toggleMenu("profile")}>My Profile</p>
                {openMenu === "profile" && (
                    <div className="submenu">
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