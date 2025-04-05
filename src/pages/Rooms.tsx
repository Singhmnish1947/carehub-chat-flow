
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Rooms = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Rooms & Beds</h1>
        <p className="text-gray-500">Manage hospital rooms and bed allocation</p>
      </div>
      
      <div className="border rounded-lg p-8 text-center bg-white">
        <h2 className="text-lg font-medium">Room & Bed Management</h2>
        <p className="text-gray-500 mt-2">Room and bed management functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Rooms;
