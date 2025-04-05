
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type MessageType = {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  timestamp: string;
  isCurrentUser: boolean;
};

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { content, sender, timestamp, isCurrentUser } = message;
  
  return (
    <div
      className={cn(
        "flex w-full mb-4 max-w-[85%]",
        isCurrentUser ? "ml-auto justify-end" : "mr-auto justify-start"
      )}
    >
      {!isCurrentUser && (
        <div className="flex-shrink-0 mr-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={sender.avatarUrl} alt={sender.name} />
            <AvatarFallback className="bg-care-primary text-white">
              {sender.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <div className="flex flex-col">
        {!isCurrentUser && (
          <span className="text-xs text-gray-500 mb-1">{sender.name}</span>
        )}
        
        <div className="flex flex-col">
          <div
            className={cn(
              "rounded-lg py-2 px-3",
              isCurrentUser 
                ? "bg-care-primary text-white rounded-tr-none" 
                : "bg-care-gray text-gray-800 rounded-tl-none border border-care-border"
            )}
          >
            {content}
          </div>
          <span className={cn(
            "text-xs mt-1 text-gray-500", 
            isCurrentUser ? "text-right" : "text-left"
          )}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
      
      {isCurrentUser && (
        <div className="flex-shrink-0 ml-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={sender.avatarUrl} alt={sender.name} />
            <AvatarFallback className="bg-care-dark text-white">
              {sender.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
