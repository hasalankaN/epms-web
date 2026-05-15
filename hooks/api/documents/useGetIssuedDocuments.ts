import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type {
  GetIssuedDocumentsParams,
  GetIssuedDocumentsResponse,
} from "@/types/document";

export function useGetIssuedDocuments(params: GetIssuedDocumentsParams = {}) {
  const {
    page = 1,
    limit = 10,
    search,
    document_type,
    course_id,
    batch_id,
    issued_from,
    issued_to,
    include_deleted,
  } = params;

  return useQuery<GetIssuedDocumentsResponse>({
    queryKey: [
      queryKeys.issuedDocuments,
      {
        page,
        limit,
        search,
        document_type,
        course_id,
        batch_id,
        issued_from,
        issued_to,
        include_deleted,
      },
    ],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      searchParams.set("page", String(page));
      searchParams.set("limit", String(limit));
      if (search) searchParams.set("search", search);
      if (document_type) searchParams.set("document_type", document_type);
      if (course_id) searchParams.set("course_id", course_id);
      if (batch_id) searchParams.set("batch_id", batch_id);
      if (issued_from) searchParams.set("issued_from", issued_from);
      if (issued_to) searchParams.set("issued_to", issued_to);
      if (include_deleted !== undefined)
        searchParams.set("include_deleted", String(include_deleted));

      const response = await api.get(
        `${API_ENDPOINTS.issuedDocuments.GET_ALL}?${searchParams.toString()}`,
      );

      return response.data.data;
    },
  });
}
