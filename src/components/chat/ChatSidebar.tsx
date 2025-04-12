
import React, { useState, useMemo } from "react";
import { Search, Plus, X, Info, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Conversation, Contact } from "@/hooks/use-chat";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatSidebarProps {
  contacts: Contact[];
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectContact: (contactId: string) => void;
  onSelectConversation: (conversationId: string) => void;
  isLoading: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  contacts,
  conversations,
  activeConversationId,
  onSelectContact,
  onSelectConversation,
  isLoading,
  isMobile = false,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("chats");
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);
  
  const filteredConversations = useMemo(() => {
    return conversations.filter(convo => 
      convo.contactName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);
  
  // Loading states
  if (isLoading) {
    return (
      <div className={`flex flex-col glass bg-white/80 border-r border-care-border h-full ${isMobile ? 'w-full' : 'w-80'}`}>
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
              className="pl-8 glass-input border-none focus:ring-care-primary focus-visible:ring-care-primary"
              disabled
            />
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col glass bg-white/80 border-r border-care-border h-full ${isMobile ? 'w-full' : 'w-80'}`}>
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
            className="pl-8 glass-input border-none focus:ring-care-primary focus-visible:ring-care-primary"
          />
        </div>
      </div>
      
      <Tabs defaultValue="chats" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full grid grid-cols-2 m-0 rounded-none border-b">
          <TabsTrigger value="chats" className="rounded-none">Chats</TabsTrigger>
          <TabsTrigger value="contacts" className="rounded-none">Contacts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chats" className="flex-1 pt-0 pb-0 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="py-2">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={`w-full text-left px-4 py-3 hover:bg-care-gray flex items-start space-x-3 ${
                      activeConversationId === conversation.id ? "bg-care-gray" : ""
                    }`}
                    onClick={() => onSelectConversation(conversation.id)}
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar>
                        <AvatarImage src={conversation.contactAvatar} alt={conversation.contactName} />
                        <AvatarFallback className="bg-care-primary text-white">
                          {conversation.contactName?.substring(0, 2).toUpperCase() || 'UN'}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.contactStatus && (
                        <span 
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                            conversation.contactStatus === "online" 
                              ? "bg-green-500" 
                              : conversation.contactStatus === "busy" 
                                ? "bg-amber-500" 
                                : "bg-gray-400"
                          }`}
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">{conversation.contactName}</h3>
                        {conversation.lastMessageTimestamp && (
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDistanceToNow(new Date(conversation.lastMessageTimestamp), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                      
                      {conversation.contactRole && (
                        <p className="text-xs text-care-primary">{conversation.contactRole}</p>
                      )}
                      
                      <div className="flex mt-0.5 justify-between items-center">
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                        )}
                        
                        {conversation.unreadCount && conversation.unreadCount > 0 && (
                          <Badge className="ml-2 bg-care-primary hover:bg-care-primary">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : searchQuery ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations found
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="contacts" className="flex-1 pt-0 pb-0 m-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="py-2">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <button
                    key={contact.id}
                    className="w-full text-left px-4 py-3 hover:bg-care-gray flex items-start space-x-3"
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
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{contact.name}</h3>
                      {contact.role && (
                        <p className="text-xs text-care-primary">{contact.role}</p>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No contacts found
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t border-care-border">
        <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
          <DialogTrigger asChild>
            <Button className="w-full glass-button bg-care-primary hover:bg-care-dark">
              <Plus size={18} className="mr-2" />
              New conversation
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-dialog">
            <DialogHeader>
              <DialogTitle>Start a new conversation</DialogTitle>
              <DialogDescription>
                Select a staff member to message
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Users size={16} className="mr-2" />
                Staff Members
              </h3>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    className="flex items-center p-2 w-full text-left rounded-md hover:bg-care-gray"
                    onClick={() => {
                      onSelectContact(contact.id);
                      setIsNewChatOpen(false);
                    }}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                      <AvatarFallback className="bg-care-primary text-white">
                        {contact.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      {contact.role && (
                        <p className="text-xs text-care-primary">{contact.role}</p>
                      )}
                    </div>
                    {contact.status && (
                      <span 
                        className={`ml-auto h-2.5 w-2.5 rounded-full ${
                          contact.status === "online" 
                            ? "bg-green-500" 
                            : contact.status === "busy" 
                              ? "bg-amber-500" 
                              : "bg-gray-400"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChatSidebar;
