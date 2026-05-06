import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { CreateDirectRoomPayload } from "@/types/chat";

export function useCreateDirectRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateDirectRoomPayload) => {
      const response = await api.post(
        API_ENDPOINTS.chat.CREATE_DIRECT_ROOM,
        payload
      );

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.chatRooms] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create chat room");
    },
  });
}
