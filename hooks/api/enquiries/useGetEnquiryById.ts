import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { EnquiryDetail } from "@/types/inquiry";

export interface EnquiryDetailResponse {
  status: string;
  message: string | null;
  data: EnquiryDetail;
}

export function useGetEnquiryById(id: string | null) {
  return useQuery({
    queryKey: [queryKeys.enquiries, id],
    queryFn: async () => {
      if (!id) return null;

      const response = await api.get<EnquiryDetailResponse>(
        API_ENDPOINTS.enquiries.GET_BY_ID(id)
      );

      return response.data.data;
    },
    enabled: !!id,
  });
}
