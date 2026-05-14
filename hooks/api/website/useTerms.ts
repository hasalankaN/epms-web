import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TermsAndConditions {
  id?: string;
  content: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useGetTerms() {
  return useQuery<TermsAndConditions>({
    queryKey: [queryKeys.websiteTerms],
    queryFn: async () => {
      const response = await api.get(API_ENDPOINTS.website.TERMS);

      return response.data.data;
    },
  });
}

export function useUpdateTerms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const response = await api.patch(API_ENDPOINTS.website.TERMS, {
        content,
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.websiteTerms] });
      toast.success("Terms & Conditions saved successfully.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to save Terms & Conditions.",
      );
    },
  });
}
