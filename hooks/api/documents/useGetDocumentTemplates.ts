import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type {
  GetDocumentTemplatesParams,
  GetDocumentTemplatesResponse,
} from "@/types/document";

export function useGetDocumentTemplates(params: GetDocumentTemplatesParams = {}) {
  const { page = 1, limit = 10, search, document_type, is_active } = params;

  return useQuery<GetDocumentTemplatesResponse>({
    queryKey: [queryKeys.documentTemplates, { page, limit, search, document_type, is_active }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      searchParams.set("page", String(page));
      searchParams.set("limit", String(limit));
      if (search) searchParams.set("search", search);
      if (document_type) searchParams.set("document_type", document_type);
      if (is_active !== undefined) searchParams.set("is_active", String(is_active));

      const response = await api.get(
        `${API_ENDPOINTS.documentTemplates.GET_ALL}?${searchParams.toString()}`
      );

      return response.data.data;
    },
  });
}
