/**
 * Batch data structure for the referral panel
 */
export interface ReferralBatchDataType {
  id: string;
  batchId: string;
  batchName: string;
  category: string;
  branch: string;
  type: string;
  price: string;
  directCommissionRate: string;
  teamCommissionRate: string;
  status: string;
}

/**
 * Course data structure for the referral panel
 */
export interface ReferralCourseDataType {
  id: string;
  courseId: string;
  courseName: string;
  category: string;
  level: string;
  type: string;
  subject: string;
  price: string;
  directCommissionRate: string;
  teamCommissionRate: string;
  status: string;
}

export const PRODUCT_STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  "Upcoming": { bg: "#FFF7D7", text: "#F59E0B" },
  "Active": { bg: "#D9E9FF", text: "#2563EB" },
  "Inactive": { bg: "#F1F5F9", text: "#64748B" },
  "Completed": { bg: "#DCFCE7", text: "#16A34A" },
};
