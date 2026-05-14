import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface UpdateCertificateTemplatePayload {
  name: string;
  pricing_type: "FREE" | "PAID";
  price: number;
  template_file_url: string;
  file_type: string;
  tag_layout: Record<string, any>;
  signature_layout: Record<string, any>;
  signature_image_url: string | null;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateCertificateTemplateResponse {
  status: string;
  message: string | null;
  data: {
    command: string;
    rowCount: number;
    oid: null;
    rows: any[];
    fields: any[];
    _types: Record<string, any>;
    RowCtor: null;
    rowAsArray: boolean;
    _prebuiltEmptyResultObject: null;
  };
}

export function useUpdateCertificateTemplate(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateCertificateTemplatePayload) => {
      const response = await api.patch<UpdateCertificateTemplateResponse>(
        API_ENDPOINTS.certificateTemplates.UPDATE_TEMPLATE(id),
        payload
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Certificate template updated successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.certificateTemplates] });
    },
    onError: () => {
      toast.error("Failed to update certificate template. Please try again.");
    },
  });
}
