"use client";

import { useEffect, useRef, useCallback, useState } from "react";

import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getSession } from "@/lib/authentication";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ChatMessageItem } from "@/types/chat";

const SOCKET_NAMESPACE = "/chat";

interface UseChatSocketOptions {
  currentRoomId?: string | null;
  onNewMessage?: (message: ChatMessageItem, roomId: string) => void;
  onTyping?: (roomId: string, userId: string, isTyping: boolean) => void;
  onUnreadCountUpdate?: (total: number) => void;
}

export function useChatSocket(options: UseChatSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();
  const optionsRef = useRef(options);

  optionsRef.current = options;

  const connectSocket = useCallback(async () => {
    if (socketRef.current?.connected) return;

    const session = await getSession();
    const token = session?.tokens.accessToken;

    if (!token) {
      console.warn("No access token found for socket connection");

      return;
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

    const socket = io(`${baseUrl}${SOCKET_NAMESPACE}`, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
      socket.emit("identify");
    });

    socket.on("identified", (data: { userId: string }) => {
      console.log("Socket identified as user:", data.userId);
    });

    socket.on(
      "new_message",
      ({ message, roomId }: { message: ChatMessageItem; roomId: string }) => {
        optionsRef.current.onNewMessage?.(message, roomId);
        queryClient.invalidateQueries({ queryKey: [queryKeys.chatRooms] });
      }
    );

    socket.on(
      "unread_count_update",
      ({ total }: { total: number }) => {
        optionsRef.current.onUnreadCountUpdate?.(total);
        queryClient.invalidateQueries({ queryKey: [queryKeys.chatUnreadCount] });
      }
    );

    socket.on(
      "typing",
      ({
        roomId,
        userId,
        isTyping,
      }: {
        roomId: string;
        userId: string;
        isTyping: boolean;
      }) => {
        optionsRef.current.onTyping?.(roomId, userId, isTyping);
      }
    );

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
      setIsConnected(false);
    });

    socket.on("exception", (err: any) => {
      console.error("Socket exception from server:", err);
      toast.error(err?.message || "Chat server error");
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    socketRef.current = socket;
  }, [queryClient]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    socketRef.current?.emit("join_room", { roomId });
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    socketRef.current?.emit("leave_room", { roomId });
  }, []);

  const sendMessage = useCallback(
    (
      roomId: string,
      content: string,
      messageType?: "TEXT" | "FILE" | "IMAGE",
      attachments?: Array<{ url: string; type: string; fileName?: string; fileSize?: number }>
    ) => {
      console.log("[useChatSocket] sendMessage called:", { roomId, content, connected: socketRef.current?.connected, socketId: socketRef.current?.id });

      if (!socketRef.current?.connected) {
        toast.error("Not connected to chat server. Please wait or refresh the page.");

        return;
      }

      const payload: any = {
        roomId,
        content,
        messageType: messageType || "TEXT",
      };

      if (attachments && attachments.length > 0) {
        payload.attachments = attachments;
      }

      socketRef.current.emit("send_message", payload);

      console.log("[useChatSocket] send_message emitted to socket:", socketRef.current?.id);
    },
    []
  );

  const sendTyping = useCallback(
    (roomId: string, isTyping: boolean) => {
      socketRef.current?.emit("typing", { roomId, isTyping });
    },
    []
  );

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  useEffect(() => {
    if (!options.currentRoomId || !isConnected) return;

    joinRoom(options.currentRoomId);

    return () => {
      leaveRoom(options.currentRoomId!);
    };
  }, [options.currentRoomId, joinRoom, leaveRoom, isConnected]);

  return {
    socket: socketRef.current,
    joinRoom,
    leaveRoom,
    sendMessage,
    sendTyping,
    isConnected,
  };
}
