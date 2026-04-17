import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

interface GetPaymentDetailsParams {
  enrollmentId: string;
}

/**
 * Hook to fetch payment details for a specific enrollment.
 * This can be used as a mutation to fetch data on demand (e.g. when opening a modal).
 */
export function useGetEnrollmentPaymentDetails() {
  return useMutation({
    mutationFn: async ({ enrollmentId }: GetPaymentDetailsParams) => {
      const response = await api.get(
        API_ENDPOINTS.enrollments.GET_PAYMENT_DETAILS(enrollmentId)
      );

      return response.data.data;
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to fetch enrollment payment details.");
    },
  });
}
