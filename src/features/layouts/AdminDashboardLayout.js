import React, { useEffect } from "react";

import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import '../../style/desktop.css';

export default function AdminDashboardLayout() {


  return (
    <div className="dashboard-container">
        
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
