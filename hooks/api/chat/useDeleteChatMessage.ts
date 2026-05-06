import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useDeleteChatMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const response = await api.delete(
        API_ENDPOINTS.chat.DELETE_MESSAGE(messageId)
      );

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.chatMessages] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.chatRooms] });
      toast.success("Message deleted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete message");
    },
  });
}
