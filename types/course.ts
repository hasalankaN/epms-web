// ===== COURSE STATUS =====
export type CourseStatus = "Active" | "Inactive";

export const COURSE_STATUS_CONFIG: Record<CourseStatus, { bg: string; text: string }> = {
  Active: {
    bg: "#D9E9FF",
    text: "#2563EB",
  },
  Inactive: {
    bg: "#F1F5F9",
    text: "#000000",
  },
};

// ===== COURSE DATA TYPE =====
export interface CourseDataType {
  id: string;
  courseId: string;
  courseName: string;
  courseCategory: string;
  totalEnroll: number;
  courseLevel: string;
  courseType: string;
  language: string;
  staff: string;
  lecturer: string;
  status: CourseStatus;
  lastUpdate: string;
}
