/**
 * Enroll status options based on user feedback
 */
export type EnrollStatus = "On Going" | "Pending" | "Completed" | "Hold" | "Dropped";

/**
 * Enroll data structure for the table
 */
export interface EnrollDataType {
  id: string;
  date: string;
  enrollId: string;
  type: string;
  studentId: string;
  studentUserId: string;
  studentName: string;
  phone: string;
  whatsapp: string;
  scope: string; // "Course" or "Batch" name
  targetType: "BATCH" | "COURSE";
  status: EnrollStatus;
}

/**
 * Status badge configuration based on precise user CSS values
 */
export const ENROLL_STATUS_CONFIG: Record<EnrollStatus, { bg: string; text: string }> = {
  "On Going": { bg: "#D9E9FF", text: "#2563EB" },
  "Pending": { bg: "#FFF7D7", text: "#F59E0B" },
  "Completed": { bg: "#DFFFF0", text: "#16A34A" },
  "Hold": { bg: "#FFDEDE", text: "#FB2C36" },
  "Dropped": { bg: "#F1F5F9", text: "#000000" },
};

/**
 * Mock data representing the user's provided design constraints
 */
// ===== API TYPES =====

export interface ApiEnrollmentRow {
  enrollment_id: string;
  enroll_public_id?: string;
  created_at: string;
  student_user_id: string;
  student_public_id: string;
  student_nic: string;
  student_name: string;
  gender: string;
  mobile_number: string;
  whatsapp_number: string;
  batch_id: string | null;
  batch_name: string | null;
  course_id: string | null;
  course_name: string | null;
  enrollment_target: "BATCH" | "COURSE";
  lifecycle_status: EnrollStatus | string;
  enrollment_type: "DIRECT" | "REFERRAL";
  payment_type: string;
  payment_status: string;
}

export interface GetEnrollmentsParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  district?: string;
  gender?: string;
  batch_or_course_id?: string;
  enrollment_type?: "DIRECT" | "REFERRAL";
  lifecycle_status?: string;
  date_from?: string;
  date_to?: string;
  enrollment_target?: "BATCH" | "COURSE";
}

export interface GetEnrollmentsResponse {
  results: ApiEnrollmentRow[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

export interface EnrollmentSummary {
  all: number;
  batches: number;
  courses: number;
  pending: number;
  ongoing: number;
  completed: number;
  hold: number;
  dropped: number;
}
