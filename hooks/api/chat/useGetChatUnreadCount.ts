import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ChatUnreadCountResponse } from "@/types/chat";

export function useGetChatUnreadCount() {
  return useQuery<ChatUnreadCountResponse>({
    queryKey: [queryKeys.chatUnreadCount],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.chat.GET_UNREAD_COUNT);

      return response.data.data;
    },
  });
}
