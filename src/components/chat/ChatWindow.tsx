
import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage, { MessageType } from "./ChatMessage";
import ChatInput from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface ChatWindowProps {
  recipientId: string;
  currentUserId: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

// Mock data for the demo
const mockMessages: MessageType[] = [
  {
    id: "1",
    content: "Hello! How are you feeling today?",
    sender: {
      id: "care-provider-1",
      name: "Dr. Sarah Johnson",
      avatarUrl: "/placeholder.svg"
    },
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    isCurrentUser: false
  },
  {
    id: "2",
    content: "I'm feeling much better, thank you. The medication you prescribed helped with the pain.",
    sender: {
      id: "patient-1",
      name: "John Doe",
      avatarUrl: "/placeholder.svg"
    },
    timestamp: new Date(Date.now() - 3500000).toISOString(), // 58 minutes ago
    isCurrentUser: true
  },
  {
    id: "3",
    content: "That's great to hear! Have you been following the exercises we discussed?",
    sender: {
      id: "care-provider-1",
      name: "Dr. Sarah Johnson",
      avatarUrl: "/placeholder.svg"
    },
    timestamp: new Date(Date.now() - 3400000).toISOString(), // 56 minutes ago
    isCurrentUser: false
  },
  {
    id: "4",
    content: "Yes, I've been doing them daily. The shoulder mobility has improved significantly.",
    sender: {
      id: "patient-1", 
      name: "John Doe",
      avatarUrl: "/placeholder.svg"
    },
    timestamp: new Date(Date.now() - 3300000).toISOString(), // 55 minutes ago
    isCurrentUser: true
  },
  {
    id: "5",
    content: "Perfect! I'd like to do a quick follow-up appointment next week to check your progress. How does Tuesday at 2pm work?",
    sender: {
      id: "care-provider-1",
      name: "Dr. Sarah Johnson",
      avatarUrl: "/placeholder.svg"
    },
    timestamp: new Date(Date.now() - 3200000).toISOString(), // 53 minutes ago
    isCurrentUser: false
  }
];

const recipient = {
  id: "care-provider-1",
  name: "Dr. Sarah Johnson",
  avatarUrl: "/placeholder.svg",
  status: "online" as const
};

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  recipientId, 
  currentUserId,
  showBackButton = false,
  onBack
}) => {
  const [messages, setMessages] = useState<MessageType[]>(mockMessages);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = (content: string) => {
    setIsLoading(true);
    
    // Create new message
    const newMessage: MessageType = {
      id: `${Date.now()}`,
      content,
      sender: {
        id: currentUserId,
        name: "John Doe",
        avatarUrl: "/placeholder.svg"
      },
      timestamp: new Date().toISOString(),
      isCurrentUser: true
    };
    
    // Add to messages
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate server response
    setTimeout(() => {
      setIsLoading(false);
      
      // In a real app, this would be where you'd send the message to your backend
      toast({
        title: "Message sent",
        description: "Your message has been successfully delivered.",
      });
      
      // Simulate doctor response after a delay in this demo
      if (content.toLowerCase().includes("appointment") || content.toLowerCase().includes("schedule")) {
        setTimeout(() => {
          const responseMessage: MessageType = {
            id: `${Date.now() + 1}`,
            content: "I'll check my calendar and confirm your appointment request. I'll get back to you shortly.",
            sender: {
              id: recipientId,
              name: "Dr. Sarah Johnson",
              avatarUrl: "/placeholder.svg"
            },
            timestamp: new Date().toISOString(),
            isCurrentUser: false
          };
          
          setMessages(prev => [...prev, responseMessage]);
        }, 3000);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden border border-care-border">
      <ChatHeader 
        recipient={recipient}
        showBackButton={showBackButton}
        onBack={onBack}
      />
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 bg-care-light">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatWindow;
