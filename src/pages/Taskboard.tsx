
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Taskboard = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Taskboard</h1>
        <p className="text-gray-500">Manage and track your tasks</p>
      </div>
      
      <div className="border rounded-lg p-8 text-center bg-white">
        <h2 className="text-lg font-medium">Taskboard Module</h2>
        <p className="text-gray-500 mt-2">Task management functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Taskboard;
