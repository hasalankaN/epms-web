import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

interface AddDiscountParams {
  enrollmentId: string;
  installment_id: string;
  discount_amount: number;
  reason?: string;
}

/**
 * Hook to apply a discount to an enrollment installment.
 */
export function useAddEnrollmentDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ enrollmentId, ...data }: AddDiscountParams) => {
      const response = await api.post(
        API_ENDPOINTS.enrollments.ADD_DISCOUNT(enrollmentId),
        data
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Discount applied successfully.");
      queryClient.invalidateQueries({ queryKey: [queryKeys.students] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to apply discount.");
    },
  });
}
