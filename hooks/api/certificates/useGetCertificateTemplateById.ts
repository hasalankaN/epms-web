import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface CertificateTemplateDetailData {
  id: string;
  name: string;
  pricing_type: "FREE" | "PAID";
  price: string;
  template_file_url: string;
  file_type: string;
  tag_layout: Record<string, any>;
  signature_layout: Record<string, any>;
  signature_image_url: string | null;
  status: string;
  version: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

export interface CertificateTemplateDetailResponse {
  status: string;
  message: string | null;
  data: CertificateTemplateDetailData;
}

export function useGetCertificateTemplateById(id: string | null) {
  return useQuery({
    queryKey: [queryKeys.certificateTemplates, id],
    queryFn: async () => {
      if (!id) return null;

      const response = await api.get<CertificateTemplateDetailResponse>(
        API_ENDPOINTS.certificateTemplates.GET_TEMPLATE_BY_ID(id)
      );

      return response.data.data;
    },
    enabled: !!id,
  });
}
