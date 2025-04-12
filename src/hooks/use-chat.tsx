
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

export type Contact = {
  id: string;
  name: string;
  avatarUrl?: string;
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
  status?: "online" | "offline" | "busy";
  role?: string;
};

export type Message = {
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

export type Conversation = {
  id: string;
  participants: string[];
  contactId?: string;
  contactName?: string;
  contactAvatar?: string;
  contactStatus?: "online" | "offline" | "busy";
  contactRole?: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount?: number;
};

export const useChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Fetch all available contacts (staff members)
  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;
      
      setContactsLoading(true);
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id);
          
        if (profilesError) {
          throw profilesError;
        }
        
        const formattedContacts: Contact[] = profilesData.map(profile => ({
          id: profile.id,
          name: profile.full_name || 'Unknown User',
          avatarUrl: '/placeholder.svg',
          role: profile.role,
          status: Math.random() > 0.7 ? 'online' : Math.random() > 0.5 ? 'busy' : 'offline',
        }));
        
        setContacts(formattedContacts);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch contacts',
          variant: 'destructive',
        });
      } finally {
        setContactsLoading(false);
      }
    };
    
    fetchContacts();
  }, [user, toast]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // In the new schema, participants is an array of strings
        const { data, error } = await supabase
          .from('conversations')
          .select('*')
          .contains('participants', [user.id])
          .order('updated_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          const formattedConversations: Conversation[] = await Promise.all(data.map(async (convo) => {
            // Find the other participant
            const otherParticipantId = convo.participants.find(id => id !== user.id);
            
            // Get the other participant's profile
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', otherParticipantId)
              .single();
              
            // Get unread count
            const { data: unreadMessages, error: unreadError } = await supabase
              .from('messages')
              .select('id')
              .eq('conversation_id', convo.id)
              .eq('is_read', false)
              .neq('sender_id', user.id);
              
            const unreadCount = unreadMessages?.length || 0;
              
            return {
              id: convo.id,
              participants: convo.participants,
              contactId: otherParticipantId,
              contactName: profileData?.full_name || 'Unknown User',
              contactAvatar: '/placeholder.svg',
              contactRole: profileData?.role,
              contactStatus: Math.random() > 0.7 ? 'online' : Math.random() > 0.5 ? 'busy' : 'offline',
              lastMessage: convo.last_message || '',
              lastMessageTimestamp: convo.last_message_timestamp || convo.created_at,
              unreadCount,
            };
          }));
          
          setConversations(formattedConversations);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch conversations',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversations();
    
    // Setup real-time updates for conversations
    const conversationsSubscription = supabase
      .channel('conversations-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'conversations', filter: `participants=cs.{${user?.id}}` },
        (payload) => {
          console.log('Conversation updated:', payload);
          fetchConversations();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(conversationsSubscription);
    };
  }, [user, toast]);

  // Fetch messages for active conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversation || !user) return;
      
      setMessagesLoading(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*, sender:profiles!sender_id(*)')
          .eq('conversation_id', activeConversation)
          .order('created_at', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          const formattedMessages: Message[] = data.map(msg => ({
            id: msg.id,
            conversationId: msg.conversation_id,
            content: msg.content,
            sender: {
              id: msg.sender_id,
              name: msg.sender?.full_name || 'Unknown User',
              avatarUrl: '/placeholder.svg',
            },
            timestamp: msg.created_at,
            isCurrentUser: msg.sender_id === user.id,
            isRead: msg.is_read,
          }));
          
          setMessages(formattedMessages);
          
          // Mark unread messages as read
          const unreadMessages = data.filter(msg => !msg.is_read && msg.sender_id !== user.id);
          if (unreadMessages.length > 0) {
            await supabase
              .from('messages')
              .update({ is_read: true })
              .in('id', unreadMessages.map(msg => msg.id));
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setMessagesLoading(false);
      }
    };
    
    fetchMessages();
    
    // Setup real-time updates for messages
    const messagesSubscription = supabase
      .channel('messages-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConversation}` },
        (payload) => {
          console.log('Message updated:', payload);
          fetchMessages();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [activeConversation, user, toast]);

  const sendMessage = async (content: string) => {
    if (!user || !activeConversation || !content.trim()) return;
    
    try {
      const messageId = uuidv4();
      const newMessage = {
        id: messageId,
        conversation_id: activeConversation,
        content,
        sender_id: user.id,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      
      // Add message to Supabase
      const { error } = await supabase
        .from('messages')
        .insert(newMessage);
        
      if (error) {
        throw error;
      }
      
      // Update conversation's last_message and updated_at
      await supabase
        .from('conversations')
        .update({
          last_message: content,
          last_message_timestamp: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', activeConversation);
        
      // Optimistic update
      setMessages(prev => [
        ...prev,
        {
          id: messageId,
          conversationId: activeConversation,
          content,
          sender: {
            id: user.id,
            name: user.user_metadata?.full_name || 'You',
            avatarUrl: '/placeholder.svg',
          },
          timestamp: new Date().toISOString(),
          isCurrentUser: true,
          isRead: false,
        }
      ]);
      
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

  const createConversation = async (participantId: string) => {
    if (!user) return null;
    
    try {
      // Check if conversation already exists
      const { data: existingConvo, error: checkError } = await supabase
        .from('conversations')
        .select('*')
        .contains('participants', [user.id, participantId]);
        
      if (checkError) {
        throw checkError;
      }
      
      // If conversation exists, return it
      if (existingConvo && existingConvo.length > 0) {
        setActiveConversation(existingConvo[0].id);
        return existingConvo[0].id;
      }
      
      // Create new conversation
      const conversationId = uuidv4();
      const { error } = await supabase
        .from('conversations')
        .insert({
          id: conversationId,
          participants: [user.id, participantId],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        
      if (error) {
        throw error;
      }
      
      setActiveConversation(conversationId);
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
