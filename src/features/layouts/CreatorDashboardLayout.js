import React, { useEffect, useState } from "react";

import CreatorSidebar from "../components/CreatorSidebar";
import { Outlet } from "react-router-dom";
import '../../style/desktop.css';
import { useSelector } from "react-redux";

export default function CreatorDashboardLayout() {

  const user = useSelector(s => s.user.data);

  return (
    <div className="dashboard-container">
        
      <div className="sidebar">
        <CreatorSidebar />
      </div>
      <div className="main-content">
        <h2>Welcome, {user.username}!</h2>
        <Outlet />
      </div>
    </div>
  );
}
