import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export type LookupType = "STAFF" | "LECTURER" | "STUDENT" | "REFERRAL_AGENT" | "COURSE" | "BATCH";
export type LookupStatus = "ACTIVE" | "INACTIVE" | "ALL";

export interface GetLookupParams {
  type: LookupType;
  search?: string;
  limit?: number;
  page?: number;
  status?: LookupStatus;
}

export interface LookupResultItem {
  value: string;
  label: string;
  subLabel?: string;
  handle?: string;
}

export interface GetLookupResponse {
  results: LookupResultItem[];
  totalResults: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  page: number;
  size: number;
  totalPages: number;
}

export function useGetLookup(params: GetLookupParams, enabled = true) {
  // Clean params - only include defined, non-empty values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetLookupResponse>({
    queryKey: [queryKeys.lookup, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        type: params.type,
        page: params.page || 1,
        limit: params.limit || 20,
        status: params.status || "ACTIVE",
      };

      if (params.search) {
        apiParams.search = params.search;
      }

      const response = await api.get(API_ENDPOINTS.lookup.GET, {
        params: apiParams,
      });

      return response.data.data;
    },
    enabled: enabled && !!params.type,
  });
}
