export type ComplaintType = "REQUEST" | "COMPLAINT";
export type ComplaintStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface ComplaintDataType {
  id: string;
  complaint_id: string;
  type: ComplaintType;
  status: ComplaintStatus;
  submitted_date: string;
  submitted_by: string;
  assignee: string | null;
}

export const COMPLAINT_STATUS_CONFIG: Record<ComplaintStatus, { bg: string; text: string; label: string }> = {
  "COMPLETED":   { bg: "#DFFFF0", text: "#16A34A", label: "Completed" },
  "PENDING":     { bg: "#FFF7D7", text: "#F59E0B", label: "Pending" },
  "IN_PROGRESS": { bg: "#D9E9FF", text: "#2563EB", label: "In Progress" },
};
