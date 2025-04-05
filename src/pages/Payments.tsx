
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Payments = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-gray-500">Manage billing and payment processing</p>
      </div>
      
      <div className="border rounded-lg p-8 text-center bg-white">
        <h2 className="text-lg font-medium">Payment & Billing</h2>
        <p className="text-gray-500 mt-2">Payment processing functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
