import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface ComplaintHistoryItem {
  id: string;
  old_status: string | null;
  new_status: string;
  note: string | null;
  created_at: string;
  updated_by: string;
}

export interface ComplaintDetailItem {
  id: string;
  complaint_id: string;
  type: string;
  status: string;
  holder_name: string;
  mobile_number: string;
  description: string;
  notes: string | null;
  submitted_by_user_id: string;
  assignee_user_id: string | null;
  filed_at: string;
  assigned_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  assignee_name: string | null;
}

export interface ComplaintDetailData {
  complaint: ComplaintDetailItem;
  turnaround_time: string | null;
  is_resolved: boolean;
  history: ComplaintHistoryItem[];
}

export interface ComplaintDetailResponse {
  status: string;
  message: string | null;
  data: ComplaintDetailData;
}

export function useGetComplaintById(id: string | null) {
  return useQuery({
    queryKey: [queryKeys.complaints, id],
    queryFn: async () => {
      if (!id) return null;

      const response = await api.get<ComplaintDetailResponse>(
        API_ENDPOINTS.complaints.GET_BY_ID(id)
      );
      
      return response.data.data;
    },
    enabled: !!id,
  });
}
