import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export function useMarkCommissionPaid(staffId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commissionId: string) =>
      api.patch(API_ENDPOINTS.staff.MARK_COMMISSION_PAID(commissionId)),
    onSuccess: () => {
      toast.success("Commission marked as paid.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.staff, staffId] });
    },
    onError: () => {
      toast.error("Failed to mark commission as paid.");
    },
  });
}
