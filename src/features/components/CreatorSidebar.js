import { NavLink } from "react-router-dom";
import React, { useState } from "react";

export default function CreatorSidebar() {
    const [openMenu, setOpenMenu] = useState(null);

    const toggleMenu = (menu) => {
        setOpenMenu((prev) => (prev === menu ? null : menu));
    }

    return (
        <div className="sidebar-container">
            <div className="profile-picture"> </div>

            <div className="accordion-section">
                <p onClick={() => toggleMenu("tools")}>Creator Tools</p>
                {openMenu === "tools" && (
                    <div className="submenu">
                        <NavLink to='/creator/create-article' className="admin-menu-link">Create Article</NavLink>
                        <NavLink to="/creator/create-survey-full" className="admin-menu-link">Create Survey</NavLink>
                        <NavLink to="/creator/my-articles" className="admin-menu-link">My Articles</NavLink>
                    </div>
                )}
            </div>

            <div className="accordion-section">
                <p onClick={() => toggleMenu("insights-and-stats")}>Insights & Stats</p>
                {openMenu === "insights-and-stats" && (
                    <div className="submenu">
                        <NavLink to="/creator/content-performance" className="admin-menu-link">Content Performance</NavLink>
                        <NavLink to="/creator/survey-results" className="admin-menu-link">Survey Results</NavLink>
                    </div>
                )}
            </div>

            <div className="accordion-section">
                <p onClick={() => toggleMenu("community")}>Collaboration & Community</p>
                {openMenu === "community" && (
                    <div className="submenu">
                        <NavLink to="/creator/mentions-and-messages" className="admin-menu-link">Mentions & Messages</NavLink>
                        <NavLink to="/creator/feedback-inbox" className="admin-menu-link">Feedback Inbox</NavLink>
                    </div>
                )}
            </div>

            <div className="accordion-section">
                <p onClick={() => toggleMenu("planner")}>Content & Planner</p>
                {openMenu === "planner" && (
                    <div className="submenu">
                        <NavLink to="/creator/drafts" className="admin-menu-link">Drafts</NavLink>
                        <NavLink to="/creator/scheduled-posts" className="admin-menu-link">Scheduled Posts</NavLink>
                        <NavLink to="/creator/ideas-vault" className="admin-menu-link">Ideas Vault</NavLink>
                    </div>
                )}
            </div>

            <div className="accordion-section">
                <p onClick={() => toggleMenu("profile")}>My Profile</p>
                {openMenu === "profile" && (
                    <div className="submenu">
                        <NavLink to="/dashboard/overview" className="admin-menu-link">Overview</NavLink>
                        <NavLink to="/creator/edit-profile" className="admin-menu-link">Edit Profile</NavLink>
                        <NavLink to="/creator/change-password" className="admin-menu-link">Change Password</NavLink>
                        <NavLink to="/creator/chats" className="admin-menu-link">Chats</NavLink>
                        <NavLink to="/creator/notifications" className="admin-menu-link">Notifications</NavLink>
                        <NavLink to="/creator/logout" className="admin-menu-link">Log out</NavLink>
                        
                    </div>
                )}
            </div>
        </div>
    );
}