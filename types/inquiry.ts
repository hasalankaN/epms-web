/**
 * Inquiry status options
 */
export type InquiryStatus = "Pending" | "In Progress" | "Completed" | "No Response";

/**
 * Inquiry data structure for the table
 */
export interface InquiryDataType {
  id: string;
  date: string;
  idNo: string;
  name: string;
  phone: string;
  whatsApp: string;
  source: string;
  assignee: string;
  district: string;
  interest: string;
  branch: string;
  status: InquiryStatus;
  followUp: string;
}

/**
 * Status badge configuration
 */
export const INQUIRY_STATUS_CONFIG: Record<InquiryStatus, { bg: string; text: string; icon?: string }> = {
  "Pending": { bg: "#FFF7D7", text: "#F59E0B" },
  "In Progress": { bg: "#D9E9FF", text: "#2563EB" },
  "Completed": { bg: "#DFFFF0", text: "#16A34A" },
  "No Response": { bg: "#F1F5F9", text: "#000000" },
};
