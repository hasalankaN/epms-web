import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { GetMessagesResponse } from "@/types/chat";

export interface GetChatMessagesParams {
  roomId: string;
  cursor?: string;
  limit?: number;
}

export function useGetChatMessages(params: GetChatMessagesParams) {
  return useQuery<GetMessagesResponse>({
    queryKey: [queryKeys.chatMessages, params.roomId, params.cursor],
    queryFn: async () => {
      const response = await api.get(
        API_ENDPOINTS.chat.GET_MESSAGES(params.roomId),
        {
          params: {
            cursor: params.cursor,
            limit: params.limit || 30,
          },
        }
      );

      return response.data.data;
    },
    enabled: !!params.roomId,
  });
}
