import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";

export type CourseReportMetric = "PAYMENTS" | "DISCOUNTS" | "COMMISSIONS" | "EXPENSES" | "NET_PROFIT";

export interface CourseWiseParams {
  course_id?: string;
  category_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface CourseWiseSummary {
  total_payments: string;
  total_discounts: string;
  total_referral_commissions: string;
  total_expenses: string;
  net_profit: string;
}

// Each endpoint returns { data: [...], pagination: { page, size, total, total_pages } }
export interface CourseWisePagination {
  page: number;
  size: number;
  total: number;
  total_pages: number;
}

export interface CourseWiseTableResponse<T> {
  data: T[];
  pagination: CourseWisePagination;
}

export interface CoursePaymentRow {
  course_id: string;
  course_name: string;
  category: string;
  total_amount_to_collect: string;
  total_pending: string;
  status: string;
}

export interface CourseDiscountRow {
  course_id?: string;
  course_name: string;
  category: string;
  student_name: string;
  referral_name: string;
  actual_value: string;
  offer_value: string;
  discount_percentage: string;
  offered_on: string;
}

export interface CourseCommissionRow {
  course_id?: string;
  course_name: string;
  category: string;
  student_name: string;
  payment_amount: string;
  referral_commission: string;
  referral_name: string;
  date: string;
  offered_by: string;
}

export interface CourseExpenseRow {
  date: string;
  description: string;
  course_name: string;
  category: string;
  amount: string;
  transaction_via: string;
}

export interface CourseNetProfitRow {
  course_name: string;
  category: string;
  total_income: string;
  total_expenses: string;
  profit_loss_value: string;
  profit_loss_status: string;
}

export interface ChartPoint {
  date: string;
  value: string | number;
}

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ""),
  );
}

export function useGetCourseWiseSummary(params: CourseWiseParams) {
  return useQuery<CourseWiseSummary>({
    queryKey: ["course-wise", "summary", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.COURSE_WISE_SUMMARY, {
        params: cleanParams(params as Record<string, unknown>),
      });

      return res.data.data as CourseWiseSummary;
    },
  });
}

function useGetCourseTable<T>(url: string, params: CourseWiseParams, key: string) {
  return useQuery<CourseWiseTableResponse<T>>({
    queryKey: ["course-wise", key, params],
    queryFn: async () => {
      const res = await api.get(url, { params: cleanParams(params as Record<string, unknown>) });

      return res.data.data as CourseWiseTableResponse<T>;
    },
  });
}

export function useGetCourseWisePayments(params: CourseWiseParams) {
  return useGetCourseTable<CoursePaymentRow>(API_ENDPOINTS.finances.COURSE_WISE_PAYMENTS, params, "payments");
}

export function useGetCourseWiseDiscounts(params: CourseWiseParams) {
  return useGetCourseTable<CourseDiscountRow>(API_ENDPOINTS.finances.COURSE_WISE_DISCOUNTS, params, "discounts");
}

export function useGetCourseWiseCommissions(params: CourseWiseParams) {
  return useGetCourseTable<CourseCommissionRow>(API_ENDPOINTS.finances.COURSE_WISE_COMMISSIONS, params, "commissions");
}

export function useGetCourseWiseExpenses(params: CourseWiseParams) {
  return useGetCourseTable<CourseExpenseRow>(API_ENDPOINTS.finances.COURSE_WISE_EXPENSES, params, "expenses");
}

export function useGetCourseWiseNetProfit(params: CourseWiseParams) {
  return useGetCourseTable<CourseNetProfitRow>(API_ENDPOINTS.finances.COURSE_WISE_NET_PROFIT, params, "net-profit");
}

export function useGetCourseWiseChart(params: { metric: CourseReportMetric; date_from?: string; date_to?: string; course_id?: string }) {
  return useQuery<ChartPoint[]>({
    queryKey: ["course-wise", "chart", params],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.finances.COURSE_WISE_CHART, {
        params: cleanParams(params as Record<string, unknown>),
      });
      
      return res.data.data as ChartPoint[];
    },
  });
}
