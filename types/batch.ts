/**
 * Batch status options
 */
export type BatchStatus = "Active" | "Upcoming" | "Completed" | "Inactive" | "Ongoing";

/**
 * Batch data structure for the table
 */
export interface BatchDataType {
  id: string;
  batchName: string;
  batchId: string;
  type: string;
  level: string;
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
  "Active": { bg: "#D9E9FF", text: "#2563EB" }, // Blue
  "Ongoing": { bg: "#D9E9FF", text: "#2563EB" }, // Blue
  "Upcoming": { bg: "#FFF7D7", text: "#F59E0B" }, // Yellow
  "Completed": { bg: "#DFFFF0", text: "#16A34A" }, // Green
  "Inactive": { bg: "#F1F5F9", text: "#334155" }, // Gray
};
