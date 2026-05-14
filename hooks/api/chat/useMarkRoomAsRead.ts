import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useMarkRoomAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roomId: string) => {
      const response = await api.patch(
        API_ENDPOINTS.chat.MARK_AS_READ(roomId)
      );

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.chatRooms] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.chatUnreadCount] });
    },
  });
}
