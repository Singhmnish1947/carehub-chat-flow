
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { usePatients } from "@/hooks/use-patients";
import { Loader2 } from "lucide-react";

const Patients = () => {
  const { data: patients, loading, error } = usePatients({
    orderBy: { column: 'created_at', ascending: false }
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-red-500">Error loading patients. Please try again later.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <p className="text-gray-600">Manage patient records and information</p>
      </div>

      {/* Display patients data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients?.map((patient) => (
          <div key={patient.id} className="p-4 rounded-lg border bg-white shadow-sm">
            <h3 className="font-semibold text-lg">{patient.name}</h3>
            <p className="text-sm text-gray-500">{patient.email}</p>
            <p className="text-sm text-gray-500">Phone: {patient.phone}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {patient.patient_type}
              </span>
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {patient.current_status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Patients;
