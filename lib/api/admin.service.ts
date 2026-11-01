import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import {
  normalizeListResponse,
  normalizeDetailResponse,
  normalizeMutationResponse,
} from "@/lib/api/responseNormalizer";

export interface AdminAccount {
  id: string;
  name?: string;
  username?: string;
  email: string;
  role: string;
  status?: string;
  isActive?: boolean;
  department?: string;
  createdAt?: string;
}

export interface AdminDashboardData {
  stats?: any;
  widgets?: Array<{ id: string; label: string; visible: boolean }>;
  totalEmployees?: number;
  activeAccounts?: number;
  pendingRequests?: number;
  systemHealth?: string;
}

export const adminService = {
  /**
   * GET /admin/dashboard
   */
  getDashboardStats: async (): Promise<AdminDashboardData> => {
    const res = await api.get(API_ENDPOINTS.adminEpms.DASHBOARD);
    return normalizeDetailResponse(res.data);
  },

  /**
   * PATCH /admin/dashboard
   */
  updateDashboard: async (payload: any): Promise<any> => {
    const res = await api.patch(API_ENDPOINTS.adminEpms.DASHBOARD, payload);
    return normalizeMutationResponse(res.data, "Dashboard configuration updated");
  },

  /**
   * GET /admin/accounts
   */
  getAccounts: async (): Promise<AdminAccount[]> => {
    const res = await api.get(API_ENDPOINTS.adminEpms.ACCOUNTS);
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map((row) => ({
      id: String(row.account_id || row.id || row.user_id),
      name: row.name || row.username || row.email?.split("@")[0] || "User",
      username: row.username || row.email,
      email: row.email,
      role: row.role || "EMPLOYEE",
      status: row.status || (row.is_active ? "ACTIVE" : "INACTIVE"),
      isActive: Boolean(row.is_active ?? true),
      department: row.department?.name || row.department_name || row.department || "General",
      createdAt: row.created_at || row.createdAt || "",
    }));
  },

  /**
   * POST /admin/accounts
   */
  createAccount: async (payload: {
    username: string;
    email: string;
    role: string;
    password?: string;
    employeeId?: string;
  }): Promise<AdminAccount> => {
    const res = await api.post(API_ENDPOINTS.adminEpms.ACCOUNTS, payload);
    return normalizeDetailResponse(res.data);
  },

  /**
   * PATCH /admin/accounts/:id
   */
  updateAccount: async (id: string, payload: Partial<AdminAccount>): Promise<AdminAccount> => {
    const res = await api.patch(API_ENDPOINTS.adminEpms.ACCOUNT_DETAIL(id), payload);
    return normalizeDetailResponse(res.data);
  },

  /**
   * POST /admin/accounts/:id/delete
   */
  deleteAccount: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.post(API_ENDPOINTS.adminEpms.ACCOUNT_DELETE(id));
    return normalizeMutationResponse(res.data, "Account deleted successfully");
  },
};

