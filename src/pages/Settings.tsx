
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-gray-500">Configure system preferences and options</p>
      </div>
      
      <div className="border rounded-lg p-8 text-center bg-white">
        <h2 className="text-lg font-medium">System Settings</h2>
        <p className="text-gray-500 mt-2">Settings configuration functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
