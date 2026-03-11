export type ComplaintType = "Request" | "Complaint";
export type ComplaintStatus = "Completed" | "Pending" | "In Progress";

export interface ComplaintDataType {
  id: string;
  submittedDate: string;
  idNo: string;
  submittedBy: string;
  complainType: ComplaintType;
  complainStatus: ComplaintStatus;
  assignee: string;
}

export const COMPLAINT_STATUS_CONFIG: Record<ComplaintStatus, { bg: string; text: string }> = {
  "Completed":   { bg: "#DFFFF0", text: "#16A34A" },
  "Pending":     { bg: "#FFF7D7", text: "#F59E0B" },
  "In Progress": { bg: "#D9E9FF", text: "#2563EB" },
};
