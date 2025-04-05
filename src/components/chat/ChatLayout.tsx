
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

// Mock data
const mockContacts = [
  {
    id: "care-provider-1",
    name: "Dr. Sarah Johnson",
    avatarUrl: "/placeholder.svg",
    lastMessage: "Perfect! I'd like to do a quick follow-up...",
    timestamp: new Date(Date.now() - 3200000).toISOString(),
    unread: 1,
    status: "online" as const
  },
  {
    id: "care-provider-2",
    name: "Dr. Michael Chen",
    avatarUrl: "/placeholder.svg",
    lastMessage: "Your test results look good! Let me know if...",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    unread: 0,
    status: "offline" as const
  },
  {
    id: "care-provider-3",
    name: "Nurse Emma Roberts",
    avatarUrl: "/placeholder.svg",
    lastMessage: "Don't forget to take your medication with...",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    unread: 0,
    status: "busy" as const
  },
  {
    id: "care-provider-4",
    name: "Dr. Lisa Wong",
    avatarUrl: "/placeholder.svg",
    lastMessage: "How has your recovery been progressing?",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    unread: 0,
    status: "offline" as const
  },
  {
    id: "care-provider-5",
    name: "Dr. James Martinez",
    avatarUrl: "/placeholder.svg",
    lastMessage: "I've updated your care plan. Please review...",
    timestamp: new Date(Date.now() - 345600000).toISOString(),
    unread: 0,
    status: "offline" as const
  }
];

const ChatLayout: React.FC = () => {
  const isMobile = useIsMobile();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const currentUserId = "patient-1"; // In a real app, this would come from authentication
  
  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId);
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
      <div className="h-[calc(100vh-4rem)] bg-white">
        {showMobileSidebar || !selectedContactId ? (
          <ChatSidebar 
            contacts={mockContacts}
            selectedContactId={selectedContactId}
            onSelectContact={handleSelectContact}
            isMobile={true}
            onClose={selectedContactId ? () => setShowMobileSidebar(false) : undefined}
          />
        ) : (
          <div className="h-full flex flex-col">
            <ChatWindow 
              recipientId={selectedContactId}
              currentUserId={currentUserId}
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
    <div className="h-[calc(100vh-4rem)] flex bg-white rounded-lg shadow-lg overflow-hidden">
      <ChatSidebar 
        contacts={mockContacts}
        selectedContactId={selectedContactId}
        onSelectContact={handleSelectContact}
      />
      
      {selectedContactId ? (
        <div className="flex-1">
          <ChatWindow 
            recipientId={selectedContactId}
            currentUserId={currentUserId}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-care-light">
          <div className="text-center p-6">
            <div className="mx-auto w-16 h-16 bg-care-primary/10 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={32} className="text-care-primary" />
            </div>
            <h2 className="text-xl font-medium mb-2">Select a conversation</h2>
            <p className="text-gray-500 max-w-sm">
              Choose a conversation from the list or start a new one to begin messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
