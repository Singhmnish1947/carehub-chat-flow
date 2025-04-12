
import React from "react";
import { ArrowLeft, MoreVertical, Phone, Video, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

interface ChatHeaderProps {
  recipient: {
    id: string;
    name: string;
    avatarUrl?: string;
    status?: "online" | "offline" | "busy";
    role?: string;
  };
  onBack?: () => void;
  showBackButton?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ recipient, onBack, showBackButton = false }) => {
  return (
    <div className="flex items-center justify-between border-b border-care-border glass-navbar p-3 h-16 sticky top-0 z-10">
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
          <div className="flex items-center text-xs">
            {recipient.status && (
              <div className="flex items-center text-gray-500 mr-2">
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
            {recipient.role && (
              <span className="text-care-primary">{recipient.role}</span>
            )}
          </div>
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
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-care-dark">
              <Info size={20} />
              <span className="sr-only">Contact info</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-dialog">
            <DialogHeader>
              <DialogTitle>Contact Information</DialogTitle>
              <DialogDescription>Details about {recipient.name}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center pt-4 pb-2">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={recipient.avatarUrl} alt={recipient.name} />
                <AvatarFallback className="text-2xl bg-care-primary text-white">
                  {recipient.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{recipient.name}</h2>
              {recipient.role && (
                <p className="text-care-primary">{recipient.role}</p>
              )}
              {recipient.status && (
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <span 
                    className={`h-2.5 w-2.5 rounded-full mr-1.5 ${
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
            <div className="pt-4 space-y-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <Button className="glass-button" variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
                <Button className="glass-button" variant="outline">
                  <Video className="mr-2 h-4 w-4" />
                  Video
                </Button>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Department</h3>
                <p className="text-sm text-gray-600">Cardiology</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Email</h3>
                <p className="text-sm text-gray-600">contact@example.com</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Phone</h3>
                <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-care-dark">
              <MoreVertical size={20} />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass">
            <DropdownMenuItem>Search in conversation</DropdownMenuItem>
            <DropdownMenuItem>Mute notifications</DropdownMenuItem>
            <DropdownMenuItem>Block contact</DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">Clear conversation</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
