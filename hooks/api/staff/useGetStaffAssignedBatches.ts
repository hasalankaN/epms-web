import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface StaffAssignedBatch {
  batch_id: string;
  batch_created_at: string;
  batch_name: string;
  start_date: string;
  end_date: string;
  base_price: string;
  enrollment_count: number;
}

export function useGetStaffAssignedBatches(staffId: string | null) {
  return useQuery<StaffAssignedBatch[]>({
    queryKey: [queryKeys.staff, staffId, "batches"],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.staff.GET_ASSIGNED_BATCHES(staffId!));

      
      return res.data.data ?? [];
    },
    enabled: !!staffId,
  });
}
