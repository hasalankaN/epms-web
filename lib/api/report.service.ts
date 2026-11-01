import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { downloadFileFromEndpoint } from "@/lib/api/downloadHelper";
import { normalizeListResponse, normalizeDetailResponse } from "@/lib/api/responseNormalizer";

export interface ReportItem {
  id: string;
  name: string;
  type: string;
  department?: string;
  period?: string;
  createdAt?: string;
  url?: string;
}

export const reportService = {
  /**
   * GET /hr/reports
   */
  getAllReports: async (params?: Record<string, any>): Promise<ReportItem[]> => {
    const res = await api.get(API_ENDPOINTS.hr.REPORTS, { params });
    const list = normalizeListResponse<any>(res.data);
    return list.items.map((r) => ({
      id: String(r.id || r._id || r.report_id),
      name: r.name || r.title || "Report",
      type: r.type || r.category || "GENERAL",
      department: r.department || "All",
      period: r.period || "",
      createdAt: r.created_at || r.createdAt || "",
      url: r.url || r.download_url,
    }));
  },

  /**
   * GET /hr/reports/attendance
   */
  getAttendanceReport: async (params?: Record<string, any>): Promise<any> => {
    const res = await api.get("/hr/reports/attendance", { params });
    return normalizeDetailResponse(res.data);
  },

  /**
   * GET /hr/reports/performance
   */
  getPerformanceReport: async (params?: Record<string, any>): Promise<any> => {
    const res = await api.get("/hr/reports/performance", { params });
    return normalizeDetailResponse(res.data);
  },

  /**
   * GET /hr/reports/employees
   */
  getEmployeesReport: async (params?: Record<string, any>): Promise<any> => {
    const res = await api.get("/hr/reports/employees", { params });
    return normalizeDetailResponse(res.data);
  },

  /**
   * GET /hr/reports/training
   */
  getTrainingReport: async (params?: Record<string, any>): Promise<any> => {
    const res = await api.get("/hr/reports/training", { params });
    return normalizeDetailResponse(res.data);
  },

  /**
   * GET /hr/reports/leave
   */
  getLeaveReport: async (params?: Record<string, any>): Promise<any> => {
    const res = await api.get("/hr/reports/leave", { params });
    return normalizeDetailResponse(res.data);
  },

  /**
   * GET /hr/reports/production
   */
  getProductionReport: async (params?: Record<string, any>): Promise<any> => {
    const res = await api.get("/hr/reports/production", { params });
    return normalizeDetailResponse(res.data);
  },

  /**
   * GET /hr/reports/salary
   */
  getSalaryReport: async (params?: Record<string, any>): Promise<any> => {
    const res = await api.get("/hr/reports/salary", { params });
    return normalizeDetailResponse(res.data);
  },

  /**
   * Download a specific report as file
   */
  downloadReport: async (reportPath: string, filename?: string): Promise<void> => {
    await downloadFileFromEndpoint(reportPath, filename || "report.pdf");
  },
};

