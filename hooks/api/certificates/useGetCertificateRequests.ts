import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type {
  GetCertificateRequestsParams,
  CertificateRequestsListResponse,
} from "@/types/certificate";

export function useGetCertificateRequests(params: GetCertificateRequestsParams = {}) {
  const {
    page = 1,
    limit = 10,
    search,
    batch_id,
    course_id,
    certificate_type,
    status,
    date_from,
    date_to,
  } = params;

  return useQuery<CertificateRequestsListResponse>({
    queryKey: [
      queryKeys.certificateRequests,
      { page, limit, search, batch_id, course_id, certificate_type, status, date_from, date_to },
    ],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      searchParams.set("page", String(page));
      searchParams.set("limit", String(limit));
      
      if (search) searchParams.set("search", search);
      if (batch_id) searchParams.set("batch_id", batch_id);
      if (course_id) searchParams.set("course_id", course_id);
      if (certificate_type) searchParams.set("certificate_type", certificate_type);
      if (status) searchParams.set("status", status);
      if (date_from) searchParams.set("date_from", date_from);
      if (date_to) searchParams.set("date_to", date_to);

      const response = await api.get(
        `${API_ENDPOINTS.certificateRequests.GET_ALL}?${searchParams.toString()}`
      );

      return response.data.data;
    },
  });
}
