import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface ChatParticipant {
  userId: string;
  joinedAt: string;
  lastReadAt: string | null;
  fullName: string;
  email: string;
  role: string;
}

export function useGetChatParticipants(roomId: string) {
  return useQuery<ChatParticipant[]>({
    queryKey: [queryKeys.chatMessages, "participants", roomId],
    queryFn: async () => {
      const response = await api.get(
        API_ENDPOINTS.chat.GET_PARTICIPANTS(roomId)
      );

      return response.data.data ?? [];
    },
    enabled: !!roomId,
  });
}
