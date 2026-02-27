import React from "react";

import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import '../../style/desktop.css';
import { useSelector } from "react-redux";

export default function AdminDashboardLayout({username}) {

  const user = useSelector(s => s.user.data);

  return (
    <div className="dashboard-container">
        
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main-content">
        <h2 className="welcome">Welcome, <span className="welcome-username" >{user.username}</span>!</h2>
        <Outlet />
      </div>
    </div>
  );
}
