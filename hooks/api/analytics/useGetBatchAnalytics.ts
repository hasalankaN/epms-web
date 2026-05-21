import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export interface BatchAnalyticsParams {
  date_from?: string;
  date_to?: string;
}

export interface BatchAnalyticsSummary {
  total_batches: number;
  ongoing_batches: number;
  completed_batches: number;
  online_batches: number;
  offline_batches: number;
}

export interface BatchStudentSummary {
  total_enrollments: number;
  active: number;
  non_responsive: number;
  dropped: number;
  completed: number;
  male: number;
  female: number;
}

export interface DistrictEnrollment {
  branch_name: string;
  enrollment_count: number;
}

export interface BatchWiseBreakdown {
  by_language: { language: string; student_count: number }[];
  by_batch_type: { batch_type: string; student_count: number }[];
}

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );
}

export function useGetBatchAnalyticsSummary(params: BatchAnalyticsParams = {}) {
  return useQuery<BatchAnalyticsSummary>({
    queryKey: ["batch-analytics", "summary", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.BATCH_ANALYTICS_SUMMARY, {
        params: cleanParams(params as Record<string, unknown>),
      });

      return res.data.data as BatchAnalyticsSummary;
    },
  });
}

export function useGetBatchStudentSummary(params: BatchAnalyticsParams = {}) {
  return useQuery<BatchStudentSummary>({
    queryKey: ["batch-analytics", "student-summary", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.BATCH_ANALYTICS_STUDENT_SUMMARY, {
        params: cleanParams(params as Record<string, unknown>),
      });

      return res.data.data as BatchStudentSummary;
    },
  });
}

export function useGetBatchEnrollmentByDistrict(params: BatchAnalyticsParams = {}) {
  return useQuery<DistrictEnrollment[]>({
    queryKey: ["batch-analytics", "by-district", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.BATCH_ANALYTICS_BY_DISTRICT, {
        params: cleanParams(params as Record<string, unknown>),
      });

      return res.data.data as DistrictEnrollment[];
    },
  });
}

export function useGetBatchWiseBreakdown(params: BatchAnalyticsParams = {}) {
  return useQuery<BatchWiseBreakdown>({
    queryKey: ["batch-analytics", "breakdown", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.BATCH_ANALYTICS_BREAKDOWN, {
        params: cleanParams(params as Record<string, unknown>),
      });
      
      return res.data.data as BatchWiseBreakdown;
    },
  });
}
