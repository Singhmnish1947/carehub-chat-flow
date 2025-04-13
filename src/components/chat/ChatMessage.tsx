
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Check, CheckCheck } from "lucide-react";

export type MessageType = {
  id: string;
  conversationId: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  timestamp: string;
  isCurrentUser: boolean;
  isRead: boolean;
};

interface ChatMessageProps {
  message: MessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { content, sender, timestamp, isCurrentUser, isRead } = message;
  
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
            <AvatarFallback className="bg-black text-white">
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
                ? "bg-black text-white rounded-tr-none" 
                : "bg-white text-gray-800 rounded-tl-none border border-gray-200"
            )}
          >
            {content}
          </div>
          <div className={cn(
            "flex items-center mt-1 text-xs text-gray-500", 
            isCurrentUser ? "justify-end" : "justify-start"
          )}>
            <span>
              {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
            </span>
            
            {isCurrentUser && (
              <span className="ml-1 flex items-center">
                {isRead ? (
                  <CheckCheck size={12} className="text-blue-500" />
                ) : (
                  <Check size={12} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {isCurrentUser && (
        <div className="flex-shrink-0 ml-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={sender.avatarUrl} alt={sender.name} />
            <AvatarFallback className="bg-black text-white">
              {sender.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
