// ===== COURSE STATUS =====
export type CourseStatus = "Active" | "Inactive" | "Draft";

export const COURSE_STATUS_CONFIG: Record<CourseStatus, { bg: string; text: string }> = {
  Active: { bg: "#D9E9FF", text: "#2563EB" },
  Inactive: { bg: "#F1F5F9", text: "#334155" },
  Draft: { bg: "#FFF7D7", text: "#F59E0B" },
};

// ===== API RESPONSE TYPES =====
export interface ApiCourseStaffMember {
  id: string;
  name: string | null;
}

export interface ApiCourseRow {
  id: string;
  custom_id: string;
  name: string;
  short_description: string;
  cover_image_url: string;
  type: string;
  level: string;
  language: string;
  start_date: string;
  end_date: string;
  status: string;
  category_id: string;
  category_name: string;
  lecturer_id: string;
  lecturer_name: string | null;
  total_enroll_count: string;
  staff_member_ids: string[];
  staff_members: ApiCourseStaffMember[];
}

// ===== TABLE DATA TYPE =====
export interface CourseDataType {
  id: string;
  courseId: string;
  courseName: string;
  courseCategory: string;
  totalEnroll: number;
  courseLevel: string;
  courseType: string;
  language: string;
  staffMembers: ApiCourseStaffMember[];
  lecturer: string;
  status: CourseStatus;
  lastUpdate: string;
}

export interface CourseStatsData {
  total_courses: number;
  total_enrollments: number;
  direct_enrollments: number;
  referral_enrollments: number;
}

// ===== ANALYTICS TYPES =====

export interface CourseFinancialSummary {
  total_payments: string;
  total_discounts: string;
  total_referral_commissions: string;
  total_expenses: string;
  net_profit: string;
}

export interface StudentEnrollmentStats {
  total_enrollments: number;
  active: number;
  non_responsive: number;
  dropped: number;
  completed: number;
  male: number;
  female: number;
}

export interface EnrollmentByDistrict {
  district_name: string;
  enrollment_count: number;
}

export interface CourseBreakdown {
  by_language: Array<{
    language: string;
    student_count: number;
  }>;
  by_category: Array<{
    category_name: string;
    student_count: number;
  }>;
}

export interface ComprehensiveCourseAnalytics {
  course_summary: CourseFinancialSummary;
  student_summary: StudentEnrollmentStats;
  enrollment_by_district: EnrollmentByDistrict[];
  course_wise_breakdown: CourseBreakdown;
  report_generated_at: string;
  filters: {
    date_from: string;
    date_to: string;
  };
}
