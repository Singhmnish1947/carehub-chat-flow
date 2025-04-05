
export type EmailFolder = "inbox" | "sent" | "archive" | "trash";

export interface EmailPerson {
  name: string;
  email: string;
  avatar?: string;
}

export interface EmailAttachment {
  name: string;
  size: string;
  type: string;
}

export interface Email {
  id: string;
  subject: string;
  from: EmailPerson;
  to: EmailPerson[];
  cc?: EmailPerson[];
  bcc?: EmailPerson[];
  body: string;
  date: string;
  read: boolean;
  starred?: boolean;
  folder: EmailFolder;
  attachments?: EmailAttachment[];
  replies?: Email[];
}
