
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Inbox = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
        <p className="text-gray-500">Manage your emails and communications</p>
      </div>
      
      <div className="border rounded-lg p-8 text-center bg-white">
        <h2 className="text-lg font-medium">Mail System</h2>
        <p className="text-gray-500 mt-2">Email functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Inbox;
