import React, { useEffect } from "react";

import { Outlet } from "react-router-dom";
import '../../style/desktop.css';
import UserSidebar from "../components/UserSidebar";

export default function UserDashboardLayout({username}) {


  return (
    <div className="dashboard-container">
        
      <div className="sidebar">
        <UserSidebar />
      </div>
      <div className="main-content">
        <h2>Welcome, {username}!</h2>
        <Outlet />
      </div>
    </div>
  );
}
