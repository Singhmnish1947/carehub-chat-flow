
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { 
  Contact, 
  Conversation, 
  Message, 
  dummyContacts, 
  dummyConversations, 
  dummyMessages 
} from '@/data/chatData';

export const useChatLocal = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Load dummy data
  useEffect(() => {
    const loadDummyData = () => {
      setContactsLoading(true);
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        setContacts(dummyContacts);
        setConversations(dummyConversations);
        setContactsLoading(false);
        setLoading(false);
      }, 1000);
    };
    
    loadDummyData();
  }, []);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) {
      setMessages([]);
      return;
    }
    
    setMessagesLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const conversationMessages = dummyMessages[activeConversation] || [];
      setMessages(conversationMessages);
      
      // Mark messages as read
      if (conversationMessages.length > 0) {
        const updatedConversations = conversations.map(convo => {
          if (convo.id === activeConversation) {
            return { ...convo, unreadCount: 0 };
          }
          return convo;
        });
        setConversations(updatedConversations);
      }
      
      setMessagesLoading(false);
    }, 800);
  }, [activeConversation, conversations]);

  const sendMessage = async (content: string) => {
    if (!activeConversation || !content.trim()) return false;
    
    try {
      // Find the current conversation
      const conversation = conversations.find(c => c.id === activeConversation);
      if (!conversation) return false;
      
      const messageId = uuidv4();
      const timestamp = new Date().toISOString();
      
      // Create new message
      const newMessage: Message = {
        id: messageId,
        conversationId: activeConversation,
        content,
        sender: {
          id: 'user-current',
          name: 'You',
          avatarUrl: '/placeholder.svg',
        },
        timestamp,
        isCurrentUser: true,
        isRead: false,
      };
      
      // Update messages
      setMessages(prev => [...prev, newMessage]);
      
      // Update conversation
      const updatedConversations = conversations.map(convo => {
        if (convo.id === activeConversation) {
          return {
            ...convo,
            lastMessage: content,
            lastMessageTimestamp: timestamp,
          };
        }
        return convo;
      });
      
      setConversations(updatedConversations);
      
      // Simulate reply after delay (for demo purposes)
      setTimeout(() => {
        const contact = contacts.find(c => c.id === conversation.contactId);
        if (contact) {
          const replyId = uuidv4();
          const replyTimestamp = new Date().toISOString();
          
          const reply: Message = {
            id: replyId,
            conversationId: activeConversation,
            content: `This is an automated reply from ${contact.name}. In a real app, this would come from the actual user.`,
            sender: {
              id: contact.id,
              name: contact.name,
              avatarUrl: contact.avatarUrl,
            },
            timestamp: replyTimestamp,
            isCurrentUser: false,
            isRead: true,
          };
          
          setMessages(prev => [...prev, reply]);
          
          // Update conversation with reply
          setConversations(prev => 
            prev.map(convo => {
              if (convo.id === activeConversation) {
                return {
                  ...convo,
                  lastMessage: reply.content,
                  lastMessageTimestamp: replyTimestamp,
                };
              }
              return convo;
            })
          );
        }
      }, 2000);
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      return false;
    }
  };

  const createConversation = async (contactId: string) => {
    try {
      // Check if conversation already exists
      const existingConversation = conversations.find(c => 
        c.participants.includes(contactId) && c.participants.length === 2
      );
      
      if (existingConversation) {
        setActiveConversation(existingConversation.id);
        return existingConversation.id;
      }
      
      // Find contact details
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return null;
      
      // Create new conversation
      const conversationId = uuidv4();
      const newConversation: Conversation = {
        id: conversationId,
        participants: ['user-current', contactId],
        contactId: contactId,
        contactName: contact.name,
        contactAvatar: contact.avatarUrl,
        contactStatus: contact.status,
        contactRole: contact.role,
        lastMessage: '',
        lastMessageTimestamp: new Date().toISOString(),
        unreadCount: 0,
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversation(conversationId);
      
      // Initialize empty messages for this conversation
      dummyMessages[conversationId] = [];
      
      return conversationId;
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast({
        title: 'Error',
        description: 'Failed to create conversation',
        variant: 'destructive',
      });
      return null;
    }
  };

  return {
    contacts,
    contactsLoading,
    conversations,
    loading,
    messages,
    messagesLoading,
    activeConversation,
    setActiveConversation,
    sendMessage,
    createConversation,
  };
};
