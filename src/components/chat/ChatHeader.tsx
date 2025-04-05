
import React from "react";
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  recipient: {
    id: string;
    name: string;
    avatarUrl?: string;
    status?: "online" | "offline" | "busy";
  };
  onBack?: () => void;
  showBackButton?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ recipient, onBack, showBackButton = false }) => {
  return (
    <div className="flex items-center justify-between border-b border-care-border bg-white p-3 h-16 sticky top-0 z-10">
      <div className="flex items-center">
        {showBackButton && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft size={20} />
            <span className="sr-only">Go back</span>
          </Button>
        )}
        
        <Avatar className="h-10 w-10">
          <AvatarImage src={recipient.avatarUrl} alt={recipient.name} />
          <AvatarFallback className="bg-care-primary text-white">
            {recipient.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="ml-3">
          <h2 className="font-medium">{recipient.name}</h2>
          {recipient.status && (
            <div className="flex items-center text-xs text-gray-500">
              <div 
                className={`h-2 w-2 rounded-full mr-1 ${
                  recipient.status === "online" 
                    ? "bg-green-500" 
                    : recipient.status === "busy" 
                      ? "bg-amber-500" 
                      : "bg-gray-400"
                }`}
              />
              <span className="capitalize">{recipient.status}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-care-dark">
          <Phone size={20} />
          <span className="sr-only">Call</span>
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-care-dark">
          <Video size={20} />
          <span className="sr-only">Video call</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-care-dark">
              <MoreVertical size={20} />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Search in conversation</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Clear conversation</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
