import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          {/* This Outlet renders whatever child route is currently active */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;