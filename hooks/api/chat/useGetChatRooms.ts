import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ChatRoom } from "@/types/chat";

export function useGetChatRooms() {
  return useQuery<ChatRoom[]>({
    queryKey: [queryKeys.chatRooms],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.chat.GET_ROOMS);

      return response.data.data ?? [];
    },
  });
}
