import React, { useEffect } from "react";

import { Outlet } from "react-router-dom";
import '../../style/desktop.css';
import "../../style/dektop/user-dashboard.css";

import UserSidebar from "../components/UserSidebar";
import { useSelector } from "react-redux";

export default function UserDashboardLayout({username}) {

  const user = useSelector(s => s.user.data);
  return (
    <div className="dashboard-container">
        
      <div className="sidebar">
        <UserSidebar />
      </div>
      <div className="main-content">
        <h2 className="welcome">Welcome, <span className="welcome-username">{user.username}</span>!</h2>
        <Outlet />
      </div>
    </div>
  );
}
