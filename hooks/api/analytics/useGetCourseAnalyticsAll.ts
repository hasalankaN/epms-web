import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export interface CourseAnalyticsParams {
  date_from?: string;
  date_to?: string;
}

export interface CourseAnalyticsSummary {
  total_courses: number;
  ongoing_courses: number;
  deactivated_courses: number;
}

export interface CourseStudentSummary {
  total_enrollments: number;
  active: number;
  non_responsive: number;
  dropped: number;
  completed: number;
  male: number;
  female: number;
}

export interface DistrictEnrollment {
  district_name: string;
  enrollment_count: number;
}

export interface CourseWiseBreakdown {
  by_language: { language: string; student_count: number }[];
  by_category: { category_name: string; student_count: number }[];
}

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );
}

export function useGetCourseAnalyticsSummary(params: CourseAnalyticsParams = {}) {
  return useQuery<CourseAnalyticsSummary>({
    queryKey: ["course-analytics", "summary", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.COURSE_ANALYTICS_SUMMARY, {
        params: cleanParams(params as Record<string, unknown>),
      });

      return res.data.data as CourseAnalyticsSummary;
    },
  });
}

export function useGetCourseStudentSummary(params: CourseAnalyticsParams = {}) {
  return useQuery<CourseStudentSummary>({
    queryKey: ["course-analytics", "student-summary", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.COURSE_ANALYTICS_STUDENT_SUMMARY, {
        params: cleanParams(params as Record<string, unknown>),
      });

      return res.data.data as CourseStudentSummary;
    },
  });
}

export function useGetCourseEnrollmentByDistrict(params: CourseAnalyticsParams = {}) {
  return useQuery<DistrictEnrollment[]>({
    queryKey: ["course-analytics", "by-district", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.COURSE_ANALYTICS_BY_DISTRICT, {
        params: cleanParams(params as Record<string, unknown>),
      });

      return res.data.data as DistrictEnrollment[];
    },
  });
}

export function useGetCourseWiseBreakdownAll(params: CourseAnalyticsParams = {}) {
  return useQuery<CourseWiseBreakdown>({
    queryKey: ["course-analytics", "breakdown", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.COURSE_ANALYTICS_BREAKDOWN, {
        params: cleanParams(params as Record<string, unknown>),
      });
      
      return res.data.data as CourseWiseBreakdown;
    },
  });
}
