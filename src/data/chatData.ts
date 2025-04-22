
import { v4 as uuidv4 } from 'uuid';

export type UserStatus = "online" | "offline" | "busy";

export type Contact = {
  id: string;
  name: string;
  avatarUrl?: string;
  role?: string;
  status: UserStatus;
  lastMessage?: string;
  timestamp?: string;
  unread?: number;
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
  contactStatus?: UserStatus;
  contactRole?: string;
  lastMessage?: string;
  lastMessageTimestamp?: string;
  unreadCount?: number;
};

// Dummy user IDs
const currentUserId = "user-current";
const contactIds = {
  drJones: "user-dr-jones",
  drSmith: "user-dr-smith",
  nurseWilliams: "user-nurse-williams",
  labTech: "user-lab-tech",
  pharmacist: "user-pharmacist",
  receptionist: "user-receptionist",
  admin: "user-admin",
};

// Generate dummy contacts
export const dummyContacts: Contact[] = [
  {
    id: contactIds.drJones,
    name: "Dr. Jones",
    avatarUrl: "/placeholder.svg",
    role: "Cardiologist",
    status: "online",
    lastMessage: "Let's discuss the patient's ECG results",
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    unread: 2,
  },
  {
    id: contactIds.drSmith,
    name: "Dr. Smith",
    avatarUrl: "/placeholder.svg",
    role: "Neurologist",
    status: "busy",
    lastMessage: "The MRI results are in",
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    unread: 0,
  },
  {
    id: contactIds.nurseWilliams,
    name: "Nurse Williams",
    avatarUrl: "/placeholder.svg",
    role: "Head Nurse",
    status: "online",
    lastMessage: "Patient in room 302 needs assistance",
    timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    unread: 1,
  },
  {
    id: contactIds.labTech,
    name: "Alex Lab",
    avatarUrl: "/placeholder.svg",
    role: "Lab Technician",
    status: "offline",
    lastMessage: "Blood test results are ready",
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    unread: 0,
  },
  {
    id: contactIds.pharmacist,
    name: "Lisa Pharma",
    avatarUrl: "/placeholder.svg",
    role: "Pharmacist",
    status: "online",
    lastMessage: "Medication ready for pickup",
    timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    unread: 0,
  },
  {
    id: contactIds.receptionist,
    name: "Mia Front",
    avatarUrl: "/placeholder.svg",
    role: "Receptionist",
    status: "online",
    lastMessage: "New patient arrived",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    unread: 0,
  },
  {
    id: contactIds.admin,
    name: "Admin Team",
    avatarUrl: "/placeholder.svg",
    role: "Administration",
    status: "offline",
    lastMessage: "Staff meeting tomorrow at 9 AM",
    timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
    unread: 0,
  },
];

// Generate dummy conversations
export const dummyConversations: Conversation[] = [
  {
    id: uuidv4(),
    participants: [currentUserId, contactIds.drJones],
    contactId: contactIds.drJones,
    contactName: "Dr. Jones",
    contactAvatar: "/placeholder.svg",
    contactStatus: "online",
    contactRole: "Cardiologist",
    lastMessage: "Let's discuss the patient's ECG results",
    lastMessageTimestamp: new Date(Date.now() - 25 * 60000).toISOString(),
    unreadCount: 2,
  },
  {
    id: uuidv4(),
    participants: [currentUserId, contactIds.nurseWilliams],
    contactId: contactIds.nurseWilliams,
    contactName: "Nurse Williams",
    contactAvatar: "/placeholder.svg",
    contactStatus: "online",
    contactRole: "Head Nurse",
    lastMessage: "Patient in room 302 needs assistance",
    lastMessageTimestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
    unreadCount: 1,
  },
  {
    id: uuidv4(),
    participants: [currentUserId, contactIds.labTech],
    contactId: contactIds.labTech,
    contactName: "Alex Lab",
    contactAvatar: "/placeholder.svg",
    contactStatus: "offline",
    contactRole: "Lab Technician",
    lastMessage: "Blood test results are ready",
    lastMessageTimestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    unreadCount: 0,
  },
  {
    id: uuidv4(),
    participants: [currentUserId, contactIds.pharmacist],
    contactId: contactIds.pharmacist,
    contactName: "Lisa Pharma",
    contactAvatar: "/placeholder.svg",
    contactStatus: "online",
    contactRole: "Pharmacist",
    lastMessage: "Medication ready for pickup",
    lastMessageTimestamp: new Date(Date.now() - 30 * 60000).toISOString(),
    unreadCount: 0,
  },
];

// Generate dummy messages for each conversation
export const generateDummyMessages = (conversationId: string, contact: Contact): Message[] => {
  const baseTime = new Date(Date.now() - 2 * 86400000); // 2 days ago
  const messages: Message[] = [];

  // First day messages
  messages.push({
    id: uuidv4(),
    conversationId,
    content: `Hello, I'm ${contact.name}. How can I help you today?`,
    sender: {
      id: contact.id,
      name: contact.name,
      avatarUrl: contact.avatarUrl,
    },
    timestamp: new Date(baseTime.getTime() + 1 * 3600000).toISOString(),
    isCurrentUser: false,
    isRead: true,
  });

  messages.push({
    id: uuidv4(),
    conversationId,
    content: `Hi ${contact.name}, I need some information about a patient case.`,
    sender: {
      id: currentUserId,
      name: "You",
      avatarUrl: "/placeholder.svg",
    },
    timestamp: new Date(baseTime.getTime() + 1 * 3600000 + 5 * 60000).toISOString(),
    isCurrentUser: true,
    isRead: true,
  });

  messages.push({
    id: uuidv4(),
    conversationId,
    content: "Sure, I'd be happy to help. What specific information do you need?",
    sender: {
      id: contact.id,
      name: contact.name,
      avatarUrl: contact.avatarUrl,
    },
    timestamp: new Date(baseTime.getTime() + 1 * 3600000 + 8 * 60000).toISOString(),
    isCurrentUser: false,
    isRead: true,
  });

  // More recent messages
  messages.push({
    id: uuidv4(),
    conversationId,
    content: "I've reviewed the case and here are my thoughts.",
    sender: {
      id: currentUserId,
      name: "You",
      avatarUrl: "/placeholder.svg",
    },
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
    isCurrentUser: true,
    isRead: true,
  });

  messages.push({
    id: uuidv4(),
    conversationId,
    content: "Thanks for the update. Let's discuss this further when you have time.",
    sender: {
      id: contact.id,
      name: contact.name,
      avatarUrl: contact.avatarUrl,
    },
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
    isCurrentUser: false,
    isRead: true,
  });

  // Latest messages (unread if the contact has unread count)
  if (contact.unread && contact.unread > 0) {
    for (let i = 0; i < contact.unread; i++) {
      messages.push({
        id: uuidv4(),
        conversationId,
        content: `I have an update on this case. ${i === 0 ? 'Can we discuss it soon?' : 'Please let me know when you\'re available.'}`,
        sender: {
          id: contact.id,
          name: contact.name,
          avatarUrl: contact.avatarUrl,
        },
        timestamp: new Date(Date.now() - (30 - i * 10) * 60000).toISOString(),
        isCurrentUser: false,
        isRead: false,
      });
    }
  }

  return messages;
};

// Generate all dummy messages
export const dummyMessages: Record<string, Message[]> = {};

dummyConversations.forEach((conversation) => {
  const contact = dummyContacts.find(c => c.id === conversation.contactId);
  if (contact) {
    dummyMessages[conversation.id] = generateDummyMessages(conversation.id, contact);
  }
});
