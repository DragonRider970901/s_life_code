import { NavLink } from "react-router-dom";
import React, { useState } from "react";

export default function Sidebar() {
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menu) => {
        setOpenMenu((prev) => (prev === menu ? null : menu));
    }

    return (
        <div className="sidebar-container">
            <div className="profile-picture"> </div>

            <div className="accordion-section">
                <p onClick={() => toggleMenu("admin")}>Admin Features</p>
                {openMenu === "admin" && (
                    <div className="submenu">
                        <NavLink to='/admin/stats' className="admin-menu-link">Stats</NavLink>
                        <NavLink to="/admin/manage-users" className="admin-menu-link">Manage Users</NavLink>
                        <NavLink to="/admin/add-content-creator" className="admin-menu-link">Add Content Creator</NavLink>
                        <NavLink to="/admin/view-content-creator" className="admin-menu-link">View Content Creator</NavLink>
                        <NavLink to="/admin/add-admin" className="admin-menu-link">Add Admin</NavLink>
                        <NavLink to="/admin/send-message" className="admin-menu-link">Send Direct Message</NavLink>
                    </div>
                )}
            </div>

            <div className="accordion-section">
                <p onClick={() => toggleMenu("tools")}>Tools</p>
                {openMenu === "tools" && (
                    <div className="submenu">
                        <NavLink to="/admin/test-tools" className="admin-menu-link">Test Tools</NavLink>
                        <NavLink to="/admin/survey-tools" className="admin-menu-link">Survey Tools</NavLink>
                        <NavLink to="/admin/content-tools" className="admin-menu-link">Content Tools</NavLink>
                        <NavLink to="/admin/data-visualisation" className="admin-menu-link">Data Visualisation</NavLink>
                        <NavLink to="/admin/machine-learning" className="admin-menu-link">Machine Learning</NavLink>
                        <NavLink to="/admin/access-logs" className="admin-menu-link">Access Logs</NavLink>
                    </div>
                )}
            </div>

            <div className="accordion-section">
                <p onClick={() => toggleMenu("profile")}>My Profile</p>
                {openMenu === "profile" && (
                    <div className="submenu">
                        <NavLink to="/admin/edit-profile" className="admin-menu-link">Edit Profile</NavLink>
                        <NavLink to="/admin/change-password" className="admin-menu-link">Change Password</NavLink>
                        <NavLink to="/admin/notifications" className="admin-menu-link">Notifications</NavLink>
                        <NavLink to="/admin/logout" className="admin-menu-link">Log out</NavLink>
                        
                    </div>
                )}
            </div>
        </div>
    );
}