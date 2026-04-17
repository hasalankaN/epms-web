import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

interface EmailInvoiceParams {
  enrollmentId: string;
}

/**
 * Hook to trigger an automated invoice email for an enrollment.
 */
export function useEmailEnrollmentInvoice() {
  return useMutation({
    mutationFn: async ({ enrollmentId }: EmailInvoiceParams) => {
      const response = await api.post(
        API_ENDPOINTS.enrollments.EMAIL_INVOICE(enrollmentId)
      );

      return response.data;
    },
    onSuccess: (data) => {
      if (data?.sent) {
        toast.success("Invoice email sent successfully.");
      } else {
        toast.success("Invoice request processed.");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send invoice email.");
    },
  });
}
