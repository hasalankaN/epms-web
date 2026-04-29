export interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export interface ChatMessage {
  id: string;
  type: "sent" | "received";
  text?: string;
  time: string;
  attachment?: {
    name: string;
    date: string;
    size: string;
    fileType: "pdf" | "image" | "doc" | "other";
  };
}

export interface ChatGroup {
  date: string; // e.g. "TODAY", "YESTERDAY"
  messages: ChatMessage[];
}
