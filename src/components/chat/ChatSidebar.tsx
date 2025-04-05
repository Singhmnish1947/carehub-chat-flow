
import React, { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Contact {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
  status?: "online" | "offline" | "busy";
}

interface ChatSidebarProps {
  contacts: Contact[];
  selectedContactId: string | null;
  onSelectContact: (contactId: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  contacts,
  selectedContactId,
  onSelectContact,
  isMobile = false,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className={`flex flex-col bg-white border-r border-care-border h-full ${isMobile ? 'w-full' : 'w-80'}`}>
      <div className="p-4 border-b border-care-border flex justify-between items-center">
        <h2 className="font-semibold text-lg">Messages</h2>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
            <span className="sr-only">Close</span>
          </Button>
        )}
      </div>
      
      <div className="px-4 py-3 border-b border-care-border">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-care-gray border-none focus:ring-care-primary focus-visible:ring-care-primary"
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="py-2">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <button
                key={contact.id}
                className={`w-full text-left px-4 py-3 hover:bg-care-gray flex items-start space-x-3 ${
                  selectedContactId === contact.id ? "bg-care-gray" : ""
                }`}
                onClick={() => onSelectContact(contact.id)}
              >
                <div className="relative flex-shrink-0">
                  <Avatar>
                    <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                    <AvatarFallback className="bg-care-primary text-white">
                      {contact.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {contact.status && (
                    <span 
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                        contact.status === "online" 
                          ? "bg-green-500" 
                          : contact.status === "busy" 
                            ? "bg-amber-500" 
                            : "bg-gray-400"
                      }`}
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    {contact.timestamp && (
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(contact.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex mt-0.5 justify-between items-center">
                    {contact.lastMessage && (
                      <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                    )}
                    
                    {contact.unread && contact.unread > 0 && (
                      <Badge className="ml-2 bg-care-primary hover:bg-care-primary">
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No conversations found
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-care-border">
        <Button className="w-full bg-care-primary hover:bg-care-dark">
          <Plus size={18} className="mr-2" />
          New conversation
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;
