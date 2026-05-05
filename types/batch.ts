/**
 * Batch status options
 */
export type BatchStatus = "Active" | "Upcoming" | "Completed" | "Inactive";

/**
 * API response format for a single batch row
 */
export interface ApiBatchRow {
  custom_id: string;
  id: string;
  name: string;
  category: string;
  type: string;
  status: string; // Keep as string here since it might be uppercase from API
  branch_id: string;
  branch_name: string;
  start_date: string;
  end_date: string;
  is_draft: boolean;
  tier_count: number;
  language: string;
  lesson_duration: string;
  created_at: string;
  lecturer_id: string;
  lecturer_email: string;
  lecturer_name: string | null;
  student_count: number;
  is_paid: boolean;
}

/**
 * Batch data structure for the table
 */
export interface BatchDataType {
  id: string;
  batchName: string;
  batchId: string;
  type: string;
  status: BatchStatus;
  category: string;
  payment: string;
  branch: string;
  lecturer: string;
  startDate: string;
  endDate: string;
  studentsCount: number;
}

/**
 * Status badge configuration
 */
export const BATCH_STATUS_CONFIG: Record<BatchStatus, { bg: string; text: string }> = {
  Active: { bg: "#D9E9FF", text: "#2563EB" }, // Blue
  Upcoming: { bg: "#FFF7D7", text: "#F59E0B" }, // Yellow
  Completed: { bg: "#DFFFF0", text: "#16A34A" }, // Green
  Inactive: { bg: "#F1F5F9", text: "#334155" }, // Gray
};
