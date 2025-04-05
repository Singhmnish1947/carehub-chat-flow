
import React from "react";
import ChatLayout from "@/components/chat/ChatLayout";

const Chat = () => {
  return (
    <div className="container mx-auto px-4 py-6 h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-care-dark">Care Messages</h1>
        <p className="text-gray-500">Connect with your healthcare team</p>
      </div>
      
      <div className="h-[calc(100vh-10rem)]">
        <ChatLayout />
      </div>
    </div>
  );
};

export default Chat;
