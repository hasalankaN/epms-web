// =============================================
// Student Data Types for Batch View
// =============================================

export type CertificateStatus = "Issued" | "Not Issued";
export type PaymentStatus = "Paid" | "Pending";

// "Hold" added to match filter options
export type StudentStatus = "Active" | "Inactive" | "Dropped" | "Hold";
export type EnrollmentType = "Direct" | "Referral";
export type PaymentType = "Complete" | "Installment";

export interface StudentDataType {
  id: string;
  enrollDate: string;
  studentId: string;
  name: string;
  gender: string;
  enrollType: EnrollmentType;
  certificateType: string;
  certificateStatus: CertificateStatus;
  paymentType: PaymentType;
  paymentStatus: PaymentStatus;
  status: StudentStatus;
}

// =============================================
// Status Configurations (for StatusPopover)
// =============================================

export const CERTIFICATE_STATUS_CONFIG: Record<CertificateStatus, { bg: string; text: string }> = {
  "Issued": { bg: "#DFFFF0", text: "#16A34A" },
  "Not Issued": { bg: "#F1F5F9", text: "#000000" },
};

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { bg: string; text: string }> = {
  "Paid": { bg: "#DFFFF0", text: "#16A34A" },
  "Pending": { bg: "#FFF7D7", text: "#F59E0B" },
};

export const STUDENT_STATUS_CONFIG: Record<StudentStatus, { bg: string; text: string }> = {
  "Active": { bg: "#D9E9FF", text: "#2563EB" },
  "Inactive": { bg: "#FFDEDE", text: "#FB2C36" },
  "Dropped": { bg: "#F1F5F9", text: "#000000" },
  "Hold": { bg: "#FFF7D7", text: "#F59E0B" }, // Assuming Pending/Warning color for Hold unless specified otherwise
};
