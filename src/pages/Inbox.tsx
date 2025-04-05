
import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Mail, 
  Send, 
  Plus, 
  Trash, 
  Archive, 
  Star, 
  Inbox as InboxIcon,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Email {
  id: number;
  subject: string;
  sender: {
    name: string;
    email: string;
    avatar: string;
    initials: string;
  };
  content: string;
  date: string;
  isRead: boolean;
  folder: 'inbox' | 'sent' | 'drafts' | 'archived';
  isStarred: boolean;
}

const Inbox = () => {
  const { toast } = useToast();
  const [emails, setEmails] = useState<Email[]>([
    {
      id: 1,
      subject: "Monthly Department Meeting",
      sender: {
        name: "Dr. Vikram Sharma",
        email: "vikram.s@havenmed.com",
        avatar: "/placeholder.svg",
        initials: "VS"
      },
      content: `
        Dear Team,

        This is a reminder that our monthly department meeting is scheduled for tomorrow at 10:00 AM in the conference room. We'll be discussing the following agenda items:
        
        1. Review of last month's performance
        2. Upcoming changes to patient care protocols
        3. Staff scheduling for the holiday season
        4. Equipment procurement updates
        
        Please come prepared with your updates and questions. If you cannot attend, kindly let me know in advance.
        
        Best regards,
        Dr. Vikram Sharma
        Head of Cardiology
      `,
      date: "Today, 9:45 AM",
      isRead: false,
      folder: "inbox",
      isStarred: false
    },
    {
      id: 2,
      subject: "New Patient Referral",
      sender: {
        name: "Dr. Priya Patel",
        email: "priya.p@havenmed.com",
        avatar: "/placeholder.svg",
        initials: "PP"
      },
      content: `
        Hi Dr. John,

        I'm referring a new patient, Mr. Rajesh Kumar, to you. He's been experiencing recurring chest pain and shortness of breath. His initial ECG shows some abnormalities that I believe warrant further investigation.
        
        I've attached his medical records and test results for your review. He's available for an appointment any day next week.
        
        Thanks,
        Dr. Priya Patel
        General Medicine
      `,
      date: "Yesterday, 3:20 PM",
      isRead: true,
      folder: "inbox",
      isStarred: true
    },
    {
      id: 3,
      subject: "Hospital Budget Review",
      sender: {
        name: "Anil Kapoor",
        email: "anil.k@havenmed.com",
        avatar: "/placeholder.svg",
        initials: "AK"
      },
      content: `
        Dear Department Heads,

        We need to review the Q3 budget allocations for all departments. There have been some adjustments based on the hospital board's recent decisions.
        
        Please submit your revised budget requirements by the end of this week. The finance team will schedule individual meetings with each department next week.
        
        Regards,
        Anil Kapoor
        Chief Financial Officer
      `,
      date: "Sep 10, 11:00 AM",
      isRead: true,
      folder: "inbox",
      isStarred: false
    },
    {
      id: 4,
      subject: "Patient Treatment Plan",
      sender: {
        name: "Dr. John Doe",
        email: "john.doe@havenmed.com",
        avatar: "/placeholder.svg",
        initials: "JD"
      },
      content: `
        Dear Nursing Team,

        Here's the updated treatment plan for Mrs. Sharma in room 305. Please ensure the following:
        
        1. Administer antibiotics as per the new schedule
        2. Monitor vitals every 4 hours
        3. Assist with physical therapy exercises twice daily
        4. Update the patient chart after each interaction
        
        Let me know if you notice any adverse reactions or concerns.
        
        Thank you,
        Dr. John Doe
      `,
      date: "Sep 8, 2:15 PM",
      isRead: true,
      folder: "sent",
      isStarred: false
    },
    {
      id: 5,
      subject: "Medical Equipment Order",
      sender: {
        name: "Dr. John Doe",
        email: "john.doe@havenmed.com",
        avatar: "/placeholder.svg",
        initials: "JD"
      },
      content: `
        To Procurement Team,

        We need to order the following equipment for the cardiology department:
        
        - 2x Portable ECG machines (Philips HeartStart model)
        - 5x Blood pressure monitors
        - 1x Portable ultrasound device
        
        Please let me know the estimated delivery timeframe and budget impact.
        
        Regards,
        Dr. John Doe
      `,
      date: "Aug 25, 10:30 AM",
      isRead: true,
      folder: "archived",
      isStarred: false
    }
  ]);
  
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'archived'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  
  // Compose email state
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    content: ''
  });
  const [isSending, setIsSending] = useState(false);

  const filteredEmails = emails.filter(email => {
    // Filter by folder
    if (email.folder !== activeFolder) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        email.subject.toLowerCase().includes(query) ||
        email.sender.name.toLowerCase().includes(query) ||
        email.content.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const handleEmailClick = (email: Email) => {
    // Mark as read when opened
    if (!email.isRead) {
      setEmails(emails.map(e => 
        e.id === email.id ? { ...e, isRead: true } : e
      ));
    }
    setSelectedEmail(email);
  };

  const handleStarEmail = (id: number) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  const handleDeleteEmail = (id: number) => {
    setEmails(emails.filter(email => email.id !== id));
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(null);
    }
    toast({
      title: "Email deleted",
      description: "The email has been moved to trash.",
    });
  };

  const handleArchiveEmail = (id: number) => {
    setEmails(emails.map(email => 
      email.id === id ? { ...email, folder: 'archived' } : email
    ));
    if (selectedEmail && selectedEmail.id === id) {
      setSelectedEmail(null);
    }
    toast({
      title: "Email archived",
      description: "The email has been archived.",
    });
  };

  const handleSendEmail = () => {
    if (!newEmail.to || !newEmail.subject) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSending(true);
    
    // Simulate sending delay
    setTimeout(() => {
      const sentEmail: Email = {
        id: Date.now(),
        subject: newEmail.subject,
        sender: {
          name: "Dr. John Doe",
          email: "john.doe@havenmed.com",
          avatar: "/placeholder.svg",
          initials: "JD"
        },
        content: newEmail.content,
        date: "Just now",
        isRead: true,
        folder: "sent",
        isStarred: false
      };
      
      setEmails([sentEmail, ...emails]);
      setIsSending(false);
      setIsComposeOpen(false);
      setNewEmail({
        to: '',
        subject: '',
        content: ''
      });
      
      toast({
        title: "Email sent",
        description: "Your email has been sent successfully.",
      });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inbox</h1>
          <p className="text-gray-500">Manage your emails and communications</p>
        </div>
        <Button 
          onClick={() => setIsComposeOpen(true)}
          className="bg-care-primary"
        >
          <Plus className="mr-2 h-4 w-4" /> Compose
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input 
                  placeholder="Search emails" 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <nav className="space-y-1">
              <Button 
                variant={activeFolder === 'inbox' ? "default" : "ghost"} 
                className={`w-full justify-start ${activeFolder === 'inbox' ? "bg-care-primary" : ""}`}
                onClick={() => setActiveFolder('inbox')}
              >
                <InboxIcon className="mr-2 h-4 w-4" />
                Inbox
                <Badge className="ml-auto" variant="secondary">
                  {emails.filter(e => e.folder === 'inbox' && !e.isRead).length}
                </Badge>
              </Button>
              <Button 
                variant={activeFolder === 'sent' ? "default" : "ghost"} 
                className={`w-full justify-start ${activeFolder === 'sent' ? "bg-care-primary" : ""}`}
                onClick={() => setActiveFolder('sent')}
              >
                <Send className="mr-2 h-4 w-4" />
                Sent
              </Button>
              <Button 
                variant={activeFolder === 'drafts' ? "default" : "ghost"} 
                className={`w-full justify-start ${activeFolder === 'drafts' ? "bg-care-primary" : ""}`}
                onClick={() => setActiveFolder('drafts')}
              >
                <Mail className="mr-2 h-4 w-4" />
                Drafts
              </Button>
              <Button 
                variant={activeFolder === 'archived' ? "default" : "ghost"} 
                className={`w-full justify-start ${activeFolder === 'archived' ? "bg-care-primary" : ""}`}
                onClick={() => setActiveFolder('archived')}
              >
                <Archive className="mr-2 h-4 w-4" />
                Archived
              </Button>
            </nav>
          </Card>
        </div>
        
        {/* Email List & Content */}
        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-13rem)] flex flex-col">
            {filteredEmails.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                {/* Email List */}
                <div className="border-r border-gray-200 overflow-auto">
                  {filteredEmails.map(email => (
                    <div 
                      key={email.id} 
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedEmail?.id === email.id ? 'bg-gray-50' : ''
                      } ${!email.isRead ? 'font-medium' : ''}`}
                      onClick={() => handleEmailClick(email)}
                    >
                      <div className="flex items-center mb-2">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={email.sender.avatar} />
                          <AvatarFallback>{email.sender.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{email.sender.name}</p>
                          <p className="text-xs text-gray-500 truncate">{email.date}</p>
                        </div>
                        <button 
                          className="text-gray-400 hover:text-yellow-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStarEmail(email.id);
                          }}
                        >
                          <Star className={`h-4 w-4 ${email.isStarred ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                        </button>
                      </div>
                      <h3 className="text-sm font-medium mb-1 truncate">{email.subject}</h3>
                      <p className="text-xs text-gray-500 truncate">{email.content.split('\n')[0]}</p>
                    </div>
                  ))}
                </div>
                
                {/* Email Content */}
                <div className="overflow-auto flex flex-col h-full">
                  {selectedEmail ? (
                    <>
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-lg font-bold">{selectedEmail.subject}</h2>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleArchiveEmail(selectedEmail.id)}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteEmail(selectedEmail.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center mb-4">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={selectedEmail.sender.avatar} />
                            <AvatarFallback>{selectedEmail.sender.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedEmail.sender.name}</p>
                            <p className="text-xs text-gray-500">{selectedEmail.sender.email}</p>
                          </div>
                          <p className="ml-auto text-sm text-gray-500">{selectedEmail.date}</p>
                        </div>
                      </div>
                      <div className="p-4 flex-1 overflow-auto">
                        <div className="whitespace-pre-line text-sm">
                          {selectedEmail.content}
                        </div>
                      </div>
                      <div className="p-4 border-t border-gray-200 mt-auto">
                        <div className="flex gap-2">
                          <Button onClick={() => {
                            setNewEmail({
                              to: selectedEmail.sender.email,
                              subject: `Re: ${selectedEmail.subject}`,
                              content: `\n\n-------- Original Message --------\nFrom: ${selectedEmail.sender.name}\nDate: ${selectedEmail.date}\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.content}`
                            });
                            setIsComposeOpen(true);
                          }}>
                            Reply
                          </Button>
                          <Button variant="outline">
                            Forward
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <Mail className="h-12 w-12 mb-2" />
                      <p>Select an email to view</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                {activeFolder === 'inbox' ? (
                  <>
                    <InboxIcon className="h-12 w-12 mb-2" />
                    <p>Your inbox is empty</p>
                  </>
                ) : activeFolder === 'sent' ? (
                  <>
                    <Send className="h-12 w-12 mb-2" />
                    <p>No sent emails</p>
                  </>
                ) : activeFolder === 'drafts' ? (
                  <>
                    <Mail className="h-12 w-12 mb-2" />
                    <p>No draft emails</p>
                  </>
                ) : (
                  <>
                    <Archive className="h-12 w-12 mb-2" />
                    <p>No archived emails</p>
                  </>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Compose Email Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compose Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium" htmlFor="to">To:</label>
              <Input 
                id="to"
                value={newEmail.to} 
                onChange={(e) => setNewEmail({...newEmail, to: e.target.value})}
                placeholder="recipient@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="subject">Subject:</label>
              <Input 
                id="subject"
                value={newEmail.subject} 
                onChange={(e) => setNewEmail({...newEmail, subject: e.target.value})}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Textarea 
                value={newEmail.content} 
                onChange={(e) => setNewEmail({...newEmail, content: e.target.value})}
                placeholder="Write your message here..."
                rows={10}
                className="min-h-[200px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendEmail} 
              className="bg-care-primary"
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Inbox;
