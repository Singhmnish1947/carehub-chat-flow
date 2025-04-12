
import React from "react";
import ChatLayout from "@/components/chat/ChatLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Chat = () => {
  return (
    <DashboardLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Connect with your healthcare team</p>
      </div>
      
      <div className="h-[calc(100vh-12rem)]">
        <ChatLayout />
      </div>
    </DashboardLayout>
  );
};

export default Chat;
