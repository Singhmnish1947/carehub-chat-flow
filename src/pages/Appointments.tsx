
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Appointments = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Appointments</h1>
        <p className="text-gray-500">Schedule and manage patient appointments</p>
      </div>
      
      <div className="border rounded-lg p-8 text-center bg-white">
        <h2 className="text-lg font-medium">Appointment Management</h2>
        <p className="text-gray-500 mt-2">Appointment scheduling functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;
