import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { ApiCourseRow, CourseDataType } from "@/types/course";

export interface GetCoursesParams {
  page?: number;
  size?: number;
  orderBy?: string;
  order?: "asc" | "desc";
  search?: string;
  status?: string;
  category_id?: string;
  lecturer_id?: string;
  staff_id?: string;
  level?: string;
  language?: string;
  type?: string;
  price_filter?: string;
  sort_by?: string;
}

export interface GetCoursesResponse {
  results: ApiCourseRow[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

function mapCourseStatus(status: string): CourseDataType["status"] {
  const upper = status?.toUpperCase();

  if (upper === "ACTIVE") return "Active";
  if (upper === "DRAFT") return "Draft";

  return "Inactive";
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";

  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function mapApiCourseToCourseDataType(course: ApiCourseRow): CourseDataType {
  return {
    id: course.id,
    courseId: course.custom_id,
    courseName: course.name,
    courseCategory: course.category_name,
    totalEnroll: parseInt(course.total_enroll_count, 10) || 0,
    courseLevel: course.level ?? "—",
    courseType: course.type ?? "—",
    language: course.language ?? "—",
    staffMembers: course.staff_members ?? [],
    lecturer: course.lecturer_name ?? "—",
    status: mapCourseStatus(course.status),
    lastUpdate: formatDate(course.end_date),
  };
}

export function useGetCourses(params: GetCoursesParams) {
  // Clean params - only include defined, non-empty values
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );

  return useQuery<GetCoursesResponse>({
    queryKey: [queryKeys.courses, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 10,
        orderBy: params.orderBy || "createdAt",
        order: params.order || "desc",
      };

      // Add optional params
      if (params.search) apiParams.search = params.search;
      if (params.status) apiParams.status = params.status;
      if (params.category_id) apiParams.category_id = params.category_id;
      if (params.lecturer_id) apiParams.lecturer_id = params.lecturer_id;
      if (params.staff_id) apiParams.staff_id = params.staff_id;
      if (params.level) apiParams.level = params.level;
      if (params.language) apiParams.language = params.language;
      if (params.type) apiParams.type = params.type;
      if (params.price_filter) apiParams.price_filter = params.price_filter;
      if (params.sort_by) apiParams.sort_by = params.sort_by;

      const response = await api.get(API_ENDPOINTS.courses.GET_ALL, {
        params: apiParams,
      });

      return response.data.data;
    },
  });
}
