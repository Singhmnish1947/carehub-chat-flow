
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Locations = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
        <p className="text-gray-500">Manage hospital locations and facilities</p>
      </div>
      
      <div className="border rounded-lg p-8 text-center bg-white">
        <h2 className="text-lg font-medium">Location Management</h2>
        <p className="text-gray-500 mt-2">Location management functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Locations;
