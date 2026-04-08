import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { DocumentTemplateDetail } from "@/types/document";

interface DocumentTemplateDetailResponse {
  status: string;
  message: string | null;
  data: DocumentTemplateDetail;
}

export function useGetDocumentTemplateById(id: string | null) {
  return useQuery({
    queryKey: [queryKeys.documentTemplates, id],
    queryFn: async () => {
      if (!id) return null;

      const response = await api.get<DocumentTemplateDetailResponse>(
        API_ENDPOINTS.documentTemplates.GET_BY_ID(id)
      );

      return response.data.data;
    },
    enabled: !!id,
  });
}
