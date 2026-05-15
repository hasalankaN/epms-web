import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";

export interface DashboardTodayStats {
  inquiries: number;
  enrollments: number;
  orders: number;
  sales: number;
  income: number;
  inquiriesDod: number;
  enrollmentsDod: number;
  ordersDod: number;
  salesDod: number;
  incomeDod: number;
}

export interface DashboardFinancialSummary {
  totalIncome: number;
  incomeSeries: number[];
  totalSales: number;
  salesSeries: number[];
  totalExpenses: number;
  expensesSeries: number[];
  totalDiscounts: number;
  discountsSeries: number[];
  totalDue: number;
  dueSeries: number[];
  netAmount: number;
}

export interface DashboardStudentCourseStats {
  totalInquiries: number;
  totalEnrollments: number;
  totalStudents: number;
  totalLecturers: number;
  totalStaff: number;
  totalProducts: number;
  totalBatches: number;
  totalCourses: number;
}

export interface EnrollmentStatusItem {
  status: string;
  count: number;
}

export interface TrendDataPoint {
  month: string;
  Leads: number;
  Enrollments: number;
  Orders: number;
  Income: number;
}

export interface DashboardCertificates {
  completed: number;
  issued: number;
  downloaded: number;
  pending: number;
}

export interface UpcomingClass {
  id: string;
  name: string;
  scheduledAt: string;
}

export interface SubmissionOverviewItem {
  type: string;
  total: number;
  pending: number;
  completed: number;
}

export interface DashboardOverviewData {
  todayStats: DashboardTodayStats;
  financialSummary: DashboardFinancialSummary;
  studentCourseStats: DashboardStudentCourseStats;
  enrollmentByStatus: EnrollmentStatusItem[];
  trendData: TrendDataPoint[];
  certificates: DashboardCertificates;
  upcomingClasses: UpcomingClass[];
  submissionOverview: SubmissionOverviewItem[];
}

export function useGetDashboardOverview(days = 180) {
  return useQuery<DashboardOverviewData>({
    queryKey: [queryKeys.dashboardOverview, days],
    queryFn: async () => {
      const res = await api.get<{ data: DashboardOverviewData }>(
        `${API_ENDPOINTS.dashboard.OVERVIEW}?trendDays=${days}`,
      );

      return res.data.data;
    },
    staleTime: 60_000,
  });
}
