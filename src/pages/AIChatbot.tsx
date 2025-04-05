
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const AIChatbot = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">AI Chatbot</h1>
        <p className="text-gray-500">Interact with our AI assistant</p>
      </div>
      
      <div className="border rounded-lg p-8 text-center bg-white">
        <h2 className="text-lg font-medium">AI Chatbot Interface</h2>
        <p className="text-gray-500 mt-2">AI Chatbot functionality will be implemented here.</p>
      </div>
    </DashboardLayout>
  );
};

export default AIChatbot;
