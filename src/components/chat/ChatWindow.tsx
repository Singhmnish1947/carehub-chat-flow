
import React, { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/use-chat";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatWindowProps {
  conversationId: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  conversationId,
  showBackButton = false,
  onBack
}) => {
  const { 
    conversations, 
    messages, 
    messagesLoading,
    sendMessage
  } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const conversation = conversations.find(c => c.id === conversationId);
  const recipient = conversation ? {
    id: conversation.contactId,
    name: conversation.contactName || 'Unknown User',
    avatarUrl: conversation.contactAvatar,
    status: conversation.contactStatus,
    role: conversation.contactRole
  } : null;

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
    if (content.trim() === '') return;
    sendMessage(content);
  };

  // Loading state
  if (!recipient) {
    return (
      <div className="flex flex-col h-full glass bg-white/80 rounded-lg shadow-md overflow-hidden border border-care-border">
        <div className="flex items-center justify-between border-b border-care-border p-3 h-16">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="ml-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-16 mt-1" />
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 bg-care-light">
          <div className="flex justify-center items-center h-full">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        
        <div className="border-t border-care-border p-4">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full glass bg-white/80 rounded-lg shadow-md overflow-hidden border border-care-border">
      <ChatHeader 
        recipient={recipient}
        showBackButton={showBackButton}
        onBack={onBack}
      />
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 bg-care-light">
        <div className="space-y-4">
          {messagesLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`flex w-full mb-4 max-w-[85%] ${i % 2 === 0 ? 'mr-auto' : 'ml-auto'}`}>
                {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full mr-2" />}
                <div className="flex-1">
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
                {i % 2 !== 0 && <Skeleton className="h-8 w-8 rounded-full ml-2" />}
              </div>
            ))
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet</p>
              <p className="text-sm">Send a message to start the conversation</p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
        </div>
      </ScrollArea>
      
      <ChatInput onSendMessage={handleSendMessage} disabled={messagesLoading} />
    </div>
  );
};

export default ChatWindow;
