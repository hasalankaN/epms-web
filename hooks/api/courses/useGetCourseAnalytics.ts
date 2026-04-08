import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { 
  ComprehensiveCourseAnalytics, 
  CourseFinancialSummary, 
  StudentEnrollmentStats, 
  EnrollmentByDistrict, 
  CourseBreakdown 
} from "@/types/course";

interface AnalyticsQueryParams {
  date_from?: string;
  date_to?: string;
}

/**
 * Hook to get comprehensive course analytics (All metrics)
 */
export function useGetCourseAnalyticsAll(params?: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [queryKeys.courses, "analytics", "all", params],
    queryFn: async () => {
      const response = await api.get<{ data: ComprehensiveCourseAnalytics }>(
        API_ENDPOINTS.courses.GET_ANALYTICS_ALL,
        { params }
      );

      return response.data.data;
    },
  });
}

/**
 * Hook to get course financial summary (Payments, Profit, etc)
 */
export function useGetCourseFinancialSummary(params?: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [queryKeys.courses, "analytics", "summary", params],
    queryFn: async () => {
      const response = await api.get<{ data: CourseFinancialSummary }>(
        API_ENDPOINTS.courses.GET_ANALYTICS_SUMMARY,
        { params }
      );

      return response.data.data;
    },
  });
}

/**
 * Hook to get student enrollment statistics
 */
export function useGetCourseStudentSummary(params?: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [queryKeys.courses, "analytics", "students", params],
    queryFn: async () => {
      const response = await api.get<{ data: StudentEnrollmentStats }>(
        API_ENDPOINTS.courses.GET_ANALYTICS_STUDENTS,
        { params }
      );

      return response.data.data;
    },
  });
}

/**
 * Hook to get enrollment breakdown by district
 */
export function useGetCourseDistrictsAnalytics(params?: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [queryKeys.courses, "analytics", "districts", params],
    queryFn: async () => {
      const response = await api.get<{ data: EnrollmentByDistrict[] }>(
        API_ENDPOINTS.courses.GET_ANALYTICS_DISTRICTS,
        { params }
      );

      return response.data.data;
    },
  });
}

/**
 * Hook to get course breakdown by language and category
 */
export function useGetCourseBreakdownAnalytics(params?: AnalyticsQueryParams) {
  return useQuery({
    queryKey: [queryKeys.courses, "analytics", "breakdown", params],
    queryFn: async () => {
      const response = await api.get<{ data: CourseBreakdown }>(
        API_ENDPOINTS.courses.GET_ANALYTICS_BREAKDOWN,
        { params }
      );

      return response.data.data;
    },
  });
}
