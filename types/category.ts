// ===== CATEGORY STATUS =====
export type CategoryStatus = "Active" | "Inactive";

export const CATEGORY_STATUS_CONFIG: Record<CategoryStatus, { bg: string; text: string }> = {
  Active: {
    bg: "#D9E9FF",
    text: "#2563EB",
  },
  Inactive: {
    bg: "#F1F5F9",
    text: "#000000",
  },
};

// ===== CATEGORY DATA TYPE =====
export interface CategoryDataType {
  id: string;
  categoryName: string;
  ongoingCourses: number;
  status: CategoryStatus;
}
