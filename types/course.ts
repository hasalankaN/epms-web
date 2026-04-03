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
