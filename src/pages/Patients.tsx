
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Patients = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
        <p className="text-gray-500">Manage patient records and information</p>
      </div>
      
      <div className="border rounded-lg p-8 text-center bg-white">
        <h2 className="text-lg font-medium">Patient Management</h2>
        <p className="text-gray-500 mt-2">Patient management functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Patients;
