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
  priority: "HOT" | "COLD" | null;
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

export interface ApiEnquiryRow {
  id: string;
  enquiry_code: string;
  name: string;
  phone: string;
  whatsapp_number: string;
  nic: string;
  district: string;
  source: string;
  status: string;
  next_follow_up_at: string | null;
  created_at: string;
  is_overdue: boolean;
  assignee_id: string | null;
  assignee_name: string | null;
  batch_name: string | null;
  course_name: string | null;
  added_by_id: string | null;
  added_by_name: string | null;
  branch_name: string | null;
  priority_status: "HOT" | "COLD" | null;
}

export interface EnquiryFollowUp {
  id: string;
  note: string;
  next_follow_up_at: string;
  status_at_time: string;
  created_at: string;
  created_by: string;
}

export interface EnquiryDetail extends ApiEnquiryRow {
  email: string | null;
  notes: string | null;
  batch_id: string | null;
  course_id: string | null;
  branch_id: string | null;
  assignee_user_id: string | null;
  updated_at: string;
  followups: EnquiryFollowUp[];
}

export interface AddFollowUpDto {
  note: string;
  next_follow_up_at?: string;
  status_override?: "COMPLETED" | "NO_RESPONSE";
}

export interface AssignStaffDto {
  assignee_user_id: string;
  next_follow_up_at?: string;
}

export interface EnquiryDashboardData {
  total: number;
  today: number;
  today_follow_ups: number;
  pending: number;
  in_progress: number;
  completed: number;
  no_response: number;
}

