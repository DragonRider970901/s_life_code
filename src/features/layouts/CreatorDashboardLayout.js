import React, { useEffect } from "react";

import CreatorSidebar from "../components/CreatorSidebar";
import { Outlet } from "react-router-dom";
import '../../style/desktop.css';

export default function CreatorDashboardLayout({username}) {


  return (
    <div className="dashboard-container">
        
      <div className="sidebar">
        <CreatorSidebar />
      </div>
      <div className="main-content">
        <h2>Welcome, {username}!</h2>
        <Outlet />
      </div>
    </div>
  );
}
