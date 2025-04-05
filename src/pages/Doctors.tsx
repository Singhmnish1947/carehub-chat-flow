
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Doctors = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
        <p className="text-gray-500">Manage doctor profiles and schedules</p>
      </div>
      
      <div className="border rounded-lg p-8 text-center bg-white">
        <h2 className="text-lg font-medium">Doctor Management</h2>
        <p className="text-gray-500 mt-2">Doctor management functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Doctors;
