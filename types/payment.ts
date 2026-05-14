/**
 * Payment data structure for the referral panel
 */
export interface PaymentDataType {
  id: string;
  requestedDate: string;
  requestedAmount: string;
  status: string;
  paidDate: string;
  paidAmount: string;
  evidenceUrl: string | null;
}

export type PaymentStatus = "Active" | "Pending" | "Completed" | "Rejected";

export const PAYMENT_STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  "Active": { bg: "#DCFCE7", text: "#16A34A" },
  "Pending": { bg: "#FFF7D7", text: "#F59E0B" },
  "Completed": { bg: "#DFFFF0", text: "#16A34A" },
  "Rejected": { bg: "#FEE2E2", text: "#EF4444" },
};
