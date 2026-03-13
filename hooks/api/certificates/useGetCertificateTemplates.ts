import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type {
  GetCertificateTemplatesParams,
  GetCertificateTemplatesResponse,
} from "@/types/certificate";

export function useGetCertificateTemplates(params: GetCertificateTemplatesParams = {}) {
  const { page = 1, limit = 10, status, name, courseId, batchId } = params;

  return useQuery<GetCertificateTemplatesResponse>({
    queryKey: [queryKeys.certificateTemplates, { page, limit, status, name, courseId, batchId }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      searchParams.set("page", String(page));
      searchParams.set("limit", String(limit));
      if (status) searchParams.set("status", status);
      if (name) searchParams.set("name", name);
      if (courseId) searchParams.set("courseId", courseId);
      if (batchId) searchParams.set("batchId", batchId);

      const response = await api.get(
        `${API_ENDPOINTS.certificateTemplates.GET_ALL}?${searchParams.toString()}`
      );

      return response.data.data;
    },
  });
}
