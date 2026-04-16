import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

// ─── API Payload Types ───────────────────────────────────────────────────────

/** A single tag entry in the tag_layout payload sent to the API. */
export interface ApiTagEntry {
  x: number;
  y: number;
  fontSize: number;
  fontColor: string;
  fontFamily?: string;
  fontWeight?: string;
  opacity?: number;
}

/** A single signature entry in the signature_layout payload. */
export interface ApiSignatureEntry {
  x: number;
  y: number;
  width: number;

  /** Height is optional — backend can infer from image aspect ratio */
  height?: number;

  opacity?: number;
  rotation?: number;
}

export interface CreateCertificateTemplatePayload {
  name: string;

  pricing_type: "FREE" | "PAID";

  price: number;

  /** URL of the uploaded template image (e.g. from the file upload endpoint) */
  template_file_url: string;

  /** MIME type of the template, e.g. "image/jpeg" */
  file_type: string;

  /** Tag positions and styling in pixel-based coordinates */
  tag_layout: Record<string, ApiTagEntry>;

  /** Optional signature overlay layout. Key is the signature identifier. */
  signature_layout?: Record<string, ApiSignatureEntry> | null;

  /** Optional URL of the signature image */
  signature_image_url?: string | null;
}

export interface CreateCertificateTemplateResponse {
  id: string;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCreateCertificateTemplate() {
  const queryClient = useQueryClient();

  return useMutation<CreateCertificateTemplateResponse, Error, CreateCertificateTemplatePayload>({
    mutationFn: async (payload) => {
      const response = await api.post(API_ENDPOINTS.certificateTemplates.CREATE, payload);

      return response.data.data;
    },
    onSuccess: () => {
      toast.success("Certificate template created successfully");
      queryClient.invalidateQueries({ queryKey: [queryKeys.certificateTemplates] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create certificate template";

      toast.error(message);
    },
  });
}
