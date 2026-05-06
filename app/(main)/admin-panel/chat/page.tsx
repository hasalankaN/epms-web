"use client";

import React, { useState, Suspense, useMemo, useCallback, useEffect } from "react";

import Link from "next/link";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import { ChatSidebar } from "@/components/admin-panel/chat/ChatSidebar";
import { ChatWindow } from "@/components/admin-panel/chat/ChatWindow";
import { StartNewChatModal } from "@/components/admin-panel/chat/modals/StartNewChatModal";
import type { ChatContact, ChatGroup, ChatMessage } from "@/components/admin-panel/chat/types";
import { useGetChatRooms } from "@/hooks/api/chat/useGetChatRooms";
import { useGetChatMessages } from "@/hooks/api/chat/useGetChatMessages";
import { useMarkRoomAsRead } from "@/hooks/api/chat/useMarkRoomAsRead";
import { useCreateDirectRoom } from "@/hooks/api/chat/useCreateDirectRoom";
import { useGetChatParticipants } from "@/hooks/api/chat/useGetChatParticipants";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useAuthStore } from "@/store/authStore";
import {
  formatChatSidebarTime,
  formatMessageTime,
  getMessageGroupDate,
  getAttachmentFileType,
} from "@/lib/chat-utils";
import type { ChatMessageItem } from "@/types/chat";

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const selectedId = searchParams.get("id");

  const authData = useAuthStore((state) => state.authData);
  const currentUserId = authData?.user?.id ?? "";

  const { data: rooms } = useGetChatRooms();

  const { data: messagesData } = useGetChatMessages({
    roomId: selectedId ?? "",
  });

  const { mutate: markAsRead } = useMarkRoomAsRead();
  const { mutateAsync: createDirectRoom } = useCreateDirectRoom();
  const { data: participants } = useGetChatParticipants(selectedId ?? "");

  const [showSidebar, setShowSidebar] = useState(true);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [localMessages, setLocalMessages] = useState<Record<string, ChatGroup[]>>({});
  const [mutedRoomIds, setMutedRoomIds] = useState<Set<string>>(new Set());
  const [typingRoomIds, setTypingRoomIds] = useState<Set<string>>(new Set());

  // Build contacts from rooms
  const contacts: ChatContact[] = useMemo(() => {
    if (!rooms) return [];

    return rooms.map((room) => {
      const isBatch = room.type === "BATCH";

      const name = isBatch
        ? room.batch_name || "Batch Chat"
        : room.peer_name || room.peer_email || "Unknown";

      return {
        id: room.id,
        name,
        lastMessage: room.last_message_content || "No messages yet",
        time: formatChatSidebarTime(room.last_message_at),
        unreadCount: room.unread_count || 0,
        isOnline: false,
        isMuted: mutedRoomIds.has(room.id),
      };
    });
  }, [rooms, mutedRoomIds]);

  // Transform API messages to ChatGroup[] format
  const apiMessageGroups: ChatGroup[] = useMemo(() => {
    if (!messagesData?.data) return [];

    // Messages come newest-first from API; reverse for display
    const sorted = [...messagesData.data].reverse();

    const groups: Record<string, ChatMessage[]> = {};

    for (const msg of sorted) {
      const dateKey = getMessageGroupDate(msg.created_at);
      const isSent = msg.sender_id === currentUserId;

      const chatMsg: ChatMessage = {
        id: msg.id,
        type: isSent ? "sent" : "received",
        text: msg.content,
        time: formatMessageTime(msg.created_at),
      };

      if (msg.attachments && msg.attachments.length > 0) {
        const att = msg.attachments[0];

        chatMsg.attachment = {
          name: att.fileName || "Attachment",
          date: new Date(msg.created_at).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          size: att.fileSize ? `${(att.fileSize / 1024).toFixed(1)} KB` : "",
          fileType: getAttachmentFileType(att.type),
          url: att.url,
        };
      }

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].push(chatMsg);
    }

    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }));
  }, [messagesData, currentUserId]);

  // Merge API messages with any real-time messages
  const groups = selectedId ? (localMessages[selectedId] ?? apiMessageGroups) : [];

  const selectedContact = contacts.find((c) => c.id === selectedId) ?? null;
  const unreadTotal = contacts.filter((c) => (c.unreadCount ?? 0) > 0).length;

  // Get peer role for header
  const peerParticipant = participants?.find((p) => p.userId !== currentUserId);
  const participantRole = peerParticipant?.role || "User";

  const updateUrl = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (id) {
        params.set("id", id);
      } else {
        params.delete("id");
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const handleNewMessage = useCallback(
    (message: ChatMessageItem, roomId: string) => {
      if (message.sender_id === currentUserId) return;

      const dateKey = getMessageGroupDate(message.created_at);
      const timeStr = formatMessageTime(message.created_at);

      const newMsg: ChatMessage = {
        id: message.id,
        type: "received",
        text: message.content,
        time: timeStr,
      };

      if (message.attachments && message.attachments.length > 0) {
        const att = message.attachments[0];

        newMsg.attachment = {
          name: att.fileName || "Attachment",
          date: new Date(message.created_at).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          size: att.fileSize ? `${(att.fileSize / 1024).toFixed(1)} KB` : "",
          fileType: getAttachmentFileType(att.type),
          url: att.url,
        };
      }

      setLocalMessages((prev) => {
        const existing = prev[roomId] ?? [];
        const groupIndex = existing.findIndex((g) => g.date === dateKey);

        if (groupIndex >= 0) {
          const updated = [...existing];

          updated[groupIndex] = {
            ...updated[groupIndex],
            messages: [...updated[groupIndex].messages, newMsg],
          };

          return { ...prev, [roomId]: updated };
        }

        return {
          ...prev,
          [roomId]: [...existing, { date: dateKey, messages: [newMsg] }],
        };
      });
    },
    [currentUserId]
  );

  const { sendMessage, sendTyping, isConnected } = useChatSocket({
    currentRoomId: selectedId,
    onNewMessage: handleNewMessage,
    onTyping: (roomId, _userId, isTyping) => {
      setTypingRoomIds((prev) => {
        const next = new Set(prev);

        if (isTyping) {
          next.add(roomId);
        } else {
          next.delete(roomId);
        }

        return next;
      });
    },
  });

  const handleSelectContact = useCallback(
    (id: string) => {
      updateUrl(id);
      setShowSidebar(false);
      markAsRead(id);

      // Clear local messages for this room to fetch fresh
      setLocalMessages((prev) => {
        const next = { ...prev };

        delete next[id];

        return next;
      });
    },
    [updateUrl, markAsRead]
  );

  const handleBack = useCallback(() => {
    setShowSidebar(true);
    updateUrl(null);
  }, [updateUrl]);

  const handleSendMessage = useCallback(
    (text: string, attachment?: any[]) => {
      if (!selectedId || !currentUserId) return;

      if (!isConnected) {
        toast.error("Chat connection is not active. Please wait or refresh the page.");

        return;
      }

      const attachments = attachment?.map((att) => ({
        url: att.url,
        type: att.type,
        fileName: att.name,
        fileSize: att.size ? parseFloat(att.size) * 1024 : undefined,
      }));

      sendMessage(selectedId, text, attachments?.length ? "FILE" : "TEXT", attachments);

      // Optimistically add message to local state
      const now = new Date();
      const dateKey = getMessageGroupDate(now.toISOString());
      const timeStr = formatMessageTime(now.toISOString());

      const newMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        type: "sent",
        text,
        time: timeStr,
      };

      if (attachment && attachment.length > 0) {
        const att = attachment[0];

        newMsg.attachment = {
          name: att.name || "Attachment",
          date: now.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          size: att.size || "",
          fileType: att.fileType || "other",
          url: att.url,
        };
      }

      setLocalMessages((prev) => {
        const existing = prev[selectedId] ?? [];
        const groupIndex = existing.findIndex((g) => g.date === dateKey);

        if (groupIndex >= 0) {
          const updated = [...existing];

          updated[groupIndex] = {
            ...updated[groupIndex],
            messages: [...updated[groupIndex].messages, newMsg],
          };

          return { ...prev, [selectedId]: updated };
        }

        return {
          ...prev,
          [selectedId]: [...existing, { date: dateKey, messages: [newMsg] }],
        };
      });
    },
    [selectedId, currentUserId, sendMessage, isConnected]
  );

  const handleStartChat = useCallback(
    async (_role: string, personId: string) => {
      try {
        const room = await createDirectRoom({ targetUserId: personId });
        const roomId = room?.id;

        if (roomId) {
          updateUrl(roomId);
          setShowSidebar(false);
        }
      } catch {
        // Error handled by mutation
      } finally {
        setIsNewChatModalOpen(false);
      }
    },
    [createDirectRoom, updateUrl]
  );

  const handleToggleMute = useCallback((id: string) => {
    setMutedRoomIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }, []);

  // When API messages load, reset local messages for that room
  useEffect(() => {
    if (selectedId && messagesData?.data) {
      setLocalMessages((prev) => {
        const next = { ...prev };

        delete next[selectedId];

        return next;
      });
    }
  }, [selectedId, messagesData?.data]);

  return (
    <div className="flex h-full flex-col p-4 md:p-6">
      {/* ===== Page Header ===== */}
      <div className="flex items-center gap-[12px]">
        <Link
          href="/admin-panel/dashboard"
          className="hidden md:flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[6px] border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-[#F1F5F9]"
          aria-label="Back to dashboard"
        >
          <ChevronLeft className="h-[20px] w-[20px] shrink-0 text-[#314158]" />
        </Link>
        <h1 className="font-inter text-[24px] font-semibold leading-[38px] text-[#0F172B]">
          Chat
        </h1>
      </div>

      {/* ===== Chat Area ===== */}
      <div className="mt-[16px] flex flex-1 overflow-hidden rounded-[8px] border border-[#E2E8F0]">
        {/* Sidebar */}
        <div
          className={[
            "h-full w-full md:block md:w-[320px] md:shrink-0",
            showSidebar ? "block" : "hidden md:block",
          ].join(" ")}
        >
          <ChatSidebar
            contacts={contacts}
            selectedId={selectedId}
            onSelectContact={handleSelectContact}
            onNewChat={() => setIsNewChatModalOpen(true)}
            unreadTotal={unreadTotal}
          />
        </div>

        {/* Right: Chat window */}
        <div
          className={[
            "flex-1 h-full overflow-hidden",
            !showSidebar ? "flex md:flex" : "hidden md:flex",
          ].join(" ")}
        >
          <ChatWindow
            contact={selectedContact}
            groups={groups}
            onBack={handleBack}
            onSendMessage={handleSendMessage}
            onToggleMute={handleToggleMute}
            participantRole={participantRole}
            isTyping={selectedId ? typingRoomIds.has(selectedId) : false}
            onTyping={(isTyping) => {
              if (selectedId) sendTyping(selectedId, isTyping);
            }}
          />
        </div>
      </div>

      <StartNewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onStartChat={handleStartChat}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#94A3B8]">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
