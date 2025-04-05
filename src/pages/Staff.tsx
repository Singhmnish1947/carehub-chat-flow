
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Staff = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Staff</h1>
        <p className="text-gray-500">Manage hospital staff and personnel</p>
      </div>
      
      <div className="border rounded-lg p-8 text-center bg-white">
        <h2 className="text-lg font-medium">Staff Management</h2>
        <p className="text-gray-500 mt-2">Staff management functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Staff;
