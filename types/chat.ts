export interface ChatRoom {
  id: string;
  type: "DIRECT" | "BATCH";
  batch_id: string | null;
  updated_at: string;
  last_read_at: string | null;
  batch_name: string | null;
  peer_id: string | null;
  peer_name: string | null;
  peer_email: string | null;
  unread_count: number;
  last_message_content: string | null;
  last_message_at: string | null;
}

export interface ChatMessageAttachment {
  url: string;
  type: string;
  fileName?: string;
  fileSize?: number;
}

export interface ChatMessageItem {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  message_type: "TEXT" | "FILE" | "IMAGE";
  attachments: ChatMessageAttachment[] | null;
  is_deleted: boolean;
  created_at: string;
  sender_name: string;
  sender_email: string;
  sender_role: string;
}

export interface GetMessagesResponse {
  data: ChatMessageItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ChatUnreadCountResponse {
  total: number;
}

export interface CreateDirectRoomPayload {
  targetUserId: string;
}

export interface SendMessagePayload {
  roomId: string;
  content: string;
  messageType?: "TEXT" | "FILE" | "IMAGE";
  attachments?: ChatMessageAttachment[];
}
