
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/contexts/AuthContext";

const ChatLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { 
    contacts, 
    contactsLoading,
    conversations, 
    loading,
    activeConversation, 
    setActiveConversation,
    createConversation
  } = useChat();
  
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    // If we have conversations but no active conversation, set the first one as active
    if (conversations?.length > 0 && !activeConversation) {
      setActiveConversation(conversations[0].id);
    }
  }, [conversations, activeConversation, setActiveConversation]);
  
  const handleSelectContact = async (contactId: string) => {
    const conversationExists = conversations.find(c => 
      c.participants.includes(contactId) && c.participants.length === 2
    );
    
    if (conversationExists) {
      setActiveConversation(conversationExists.id);
    } else {
      await createConversation(contactId);
    }
    
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };
  
  const handleSelectConversation = (conversationId: string) => {
    setActiveConversation(conversationId);
    if (isMobile) {
      setShowMobileSidebar(false);
    }
  };
  
  // For mobile: toggle between sidebar and chat view
  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };
  
  if (isMobile) {
    // Mobile layout
    return (
      <div className="h-[calc(100vh-4rem)] bg-white rounded-lg shadow-md">
        {showMobileSidebar || !activeConversation ? (
          <ChatSidebar 
            contacts={contacts}
            conversations={conversations}
            activeConversationId={activeConversation}
            onSelectContact={handleSelectContact}
            onSelectConversation={handleSelectConversation}
            isLoading={loading || contactsLoading}
            isMobile={true}
            onClose={activeConversation ? () => setShowMobileSidebar(false) : undefined}
          />
        ) : (
          <div className="h-full flex flex-col">
            <ChatWindow 
              conversationId={activeConversation}
              showBackButton={true}
              onBack={() => setShowMobileSidebar(true)}
            />
          </div>
        )}
      </div>
    );
  }
  
  // Desktop layout
  return (
    <div className="h-[calc(100vh-4rem)] flex bg-white rounded-lg shadow-md overflow-hidden">
      <ChatSidebar 
        contacts={contacts}
        conversations={conversations}
        activeConversationId={activeConversation}
        onSelectContact={handleSelectContact}
        onSelectConversation={handleSelectConversation}
        isLoading={loading || contactsLoading}
      />
      
      {activeConversation ? (
        <div className="flex-1">
          <ChatWindow 
            conversationId={activeConversation}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-blue-50">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={32} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-medium mb-2 text-gray-900">Select a conversation</h2>
            <p className="text-gray-600 max-w-sm">
              Choose a conversation from the list or start a new one to begin messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
