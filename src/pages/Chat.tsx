
import React from "react";
import ChatLayout from "@/components/chat/ChatLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";

const Chat = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-care-dark">Messages</h1>
        <p className="text-gray-500">Connect with your healthcare team</p>
      </div>
      
      <div className="h-[calc(100vh-16rem)]">
        <ChatLayout />
      </div>
    </DashboardLayout>
  );
};

export default Chat;
