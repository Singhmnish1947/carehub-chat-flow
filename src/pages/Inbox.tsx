
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  Inbox as InboxIcon, 
  Send, 
  Archive, 
  Trash2, 
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import EmailList from "@/components/inbox/EmailList";
import EmailView from "@/components/inbox/EmailView";
import ComposeDialog from "@/components/inbox/ComposeDialog";
import { Email, EmailFolder } from "@/types/email";
import { useToast } from "@/hooks/use-toast";
import { emailData } from "@/data/emailData";

const Inbox = () => {
  const { toast } = useToast();
  const [emails, setEmails] = useState<Email[]>(emailData);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolder, setCurrentFolder] = useState<EmailFolder>("inbox");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState<Email | null>(null);

  // Filter emails based on search and current folder
  const filteredEmails = emails.filter(email => {
    const matchesSearch = !searchQuery || 
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.body.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFolder = email.folder === currentFolder;
    
    return matchesSearch && matchesFolder;
  });

  const handleSendEmail = (email: Email) => {
    setIsLoading(true);
    
    // Simulate sending email
    setTimeout(() => {
      if (replyToEmail) {
        // For replies, add to existing thread
        const updatedEmails = emails.map(e => {
          if (e.id === replyToEmail.id) {
            return {
              ...e,
              replies: [...(e.replies || []), email]
            };
          }
          return e;
        });
        setEmails(updatedEmails);
        setReplyToEmail(null);
      } else {
        // For new emails
        const newEmail: Email = {
          ...email,
          id: `email-${Date.now()}`,
          folder: "sent" as EmailFolder,
          read: true,
          date: new Date().toISOString()
        };
        setEmails([newEmail, ...emails]);
      }
      
      setIsLoading(false);
      setIsComposeOpen(false);
      
      toast({
        title: "Email sent",
        description: "Your email has been sent successfully."
      });
    }, 1500);
  };

  const handleDeleteEmail = (emailId: string) => {
    const updatedEmails = emails.map(email => {
      if (email.id === emailId) {
        return { ...email, folder: "trash" as EmailFolder };
      }
      return email;
    });
    
    setEmails(updatedEmails);
    setSelectedEmail(null);
    
    toast({
      title: "Email moved to trash",
      description: "The email has been moved to the trash folder."
    });
  };

  const handleArchiveEmail = (emailId: string) => {
    const updatedEmails = emails.map(email => {
      if (email.id === emailId) {
        return { ...email, folder: "archive" as EmailFolder };
      }
      return email;
    });
    
    setEmails(updatedEmails);
    setSelectedEmail(null);
    
    toast({
      title: "Email archived",
      description: "The email has been archived."
    });
  };

  const handleStarEmail = (emailId: string) => {
    const updatedEmails = emails.map(email => {
      if (email.id === emailId) {
        return { ...email, starred: !email.starred };
      }
      return email;
    });
    
    setEmails(updatedEmails);
    
    toast({
      title: "Email updated",
      description: "Email starred status has been updated."
    });
  };

  const handleMarkAsRead = (emailId: string) => {
    const updatedEmails = emails.map(email => {
      if (email.id === emailId) {
        return { ...email, read: true };
      }
      return email;
    });
    
    setEmails(updatedEmails);
  };

  const handleSelectEmail = (email: Email) => {
    setSelectedEmail(email);
    
    // Mark as read when selected
    if (!email.read) {
      handleMarkAsRead(email.id);
    }
  };

  const handleReplyToEmail = (email: Email) => {
    setReplyToEmail(email);
    setIsComposeOpen(true);
  };

  const folders = [
    { value: "inbox", label: "Inbox", icon: InboxIcon },
    { value: "sent", label: "Sent", icon: Send },
    { value: "archive", label: "Archived", icon: Archive },
    { value: "trash", label: "Trash", icon: Trash2 }
  ];

  const unreadCount = emails.filter(email => !email.read && email.folder === "inbox").length;

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col">
        <div className="border-b p-4 flex items-center justify-between bg-white">
          <h1 className="text-2xl font-bold text-gray-900">Inbox</h1>
          <Button 
            onClick={() => {
              setReplyToEmail(null);
              setIsComposeOpen(true);
            }}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r bg-white">
            <div className="p-4">
              <Button 
                variant="outline" 
                className="w-full flex justify-start border-gray-200" 
                onClick={() => {
                  setReplyToEmail(null);
                  setIsComposeOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Compose Email
              </Button>
            </div>
            
            <nav className="px-2">
              {folders.map((folder) => {
                const Icon = folder.icon;
                return (
                  <button
                    key={folder.value}
                    onClick={() => {
                      setCurrentFolder(folder.value as EmailFolder);
                      setSelectedEmail(null);
                    }}
                    className={`w-full flex items-center px-3 py-2 my-1 rounded text-left ${
                      currentFolder === folder.value 
                        ? "bg-gray-200 text-gray-900" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className={`h-4 w-4 mr-3 ${currentFolder === folder.value ? "text-gray-900" : "text-gray-500"}`} />
                    {folder.label}
                    {folder.value === "inbox" && unreadCount > 0 && (
                      <span className="ml-auto bg-black text-white text-xs rounded-full px-2 py-0.5">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            {/* Email List */}
            <div className={`w-full md:w-1/3 border-r overflow-hidden ${selectedEmail ? 'hidden md:block' : ''}`}>
              <div className="p-4 border-b bg-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200"
                  />
                </div>
              </div>
              
              <EmailList 
                emails={filteredEmails} 
                selectedEmailId={selectedEmail?.id}
                onSelectEmail={handleSelectEmail}
                onDeleteEmail={handleDeleteEmail}
                onArchiveEmail={handleArchiveEmail}
                onStarEmail={handleStarEmail}
              />
            </div>
            
            {/* Email View */}
            {selectedEmail ? (
              <div className="flex-1 overflow-auto">
                <EmailView 
                  email={selectedEmail} 
                  onReply={handleReplyToEmail}
                  onDelete={() => handleDeleteEmail(selectedEmail.id)}
                  onArchive={() => handleArchiveEmail(selectedEmail.id)}
                  onStar={() => handleStarEmail(selectedEmail.id)}
                  onBack={() => setSelectedEmail(null)}
                />
              </div>
            ) : (
              <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
                <div className="text-center p-6">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    {currentFolder === "inbox" ? (
                      <InboxIcon size={32} className="text-gray-600" />
                    ) : currentFolder === "sent" ? (
                      <Send size={32} className="text-gray-600" />
                    ) : currentFolder === "archive" ? (
                      <Archive size={32} className="text-gray-600" />
                    ) : (
                      <Trash2 size={32} className="text-gray-600" />
                    )}
                  </div>
                  <h2 className="text-xl font-medium mb-2 text-gray-900">No email selected</h2>
                  <p className="text-gray-500 max-w-sm">
                    Select an email from the list to view its contents
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ComposeDialog 
        open={isComposeOpen} 
        onOpenChange={setIsComposeOpen}
        onSend={handleSendEmail}
        replyToEmail={replyToEmail}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
};

export default Inbox;
