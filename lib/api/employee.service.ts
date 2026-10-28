import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { EmployeeRegisterFormValues } from "@/types/schemas/employeeSchema";

/* ─── Supervisor option (used in the register form dropdown) ──────────── */
export interface SupervisorOption {
  value: string; // employee UUID
  label: string; // display name
  subLabel?: string; // e.g. "Engineering · Supervisor"
}

export interface SupervisorListResponse {
  items: SupervisorOption[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SupervisorListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}

/* ─── Employee service ────────────────────────────────────────────────── */
export const employeeService = {
  /**
   * POST /employee/register
   * Registers a new employee via the Admin / HR endpoint.
   */
  registerEmployee: async (
    payload: EmployeeRegisterFormValues
  ): Promise<{ success: boolean; message?: string }> => {
    const response = await api.post(
      API_ENDPOINTS.employee.REGISTER,
      payload
    );
    return response.data;
  },

  /**
   * GET /employee/supervisors
   * Returns paginated list of employees who are supervisors.
   * Maps response to a flat { value, label, subLabel } shape for the
   * SearchableSelect component.
   */
  getSupervisors: async (
    query: SupervisorListQuery = { page: 1, pageSize: 100 }
  ): Promise<SupervisorListResponse> => {
    const params = new URLSearchParams();
    if (query.page) params.append("page", String(query.page));
    if (query.pageSize) params.append("pageSize", String(query.pageSize));
    if (query.search?.trim()) params.append("search", query.search.trim());

    const endpoint = `${API_ENDPOINTS.employee.GET_SUPERVISORS}?${params.toString()}`;
    const response = await api.get(endpoint);
    const data = response.data;

    let rawItems: any[] = [];
    let total = 0;

    if (Array.isArray(data)) {
      rawItems = data;
      total = data.length;
    } else if (Array.isArray(data?.data)) {
      rawItems = data.data;
      total = data?.meta?.total ?? data.total ?? data.data.length;
    } else if (Array.isArray(data?.items)) {
      rawItems = data.items;
      total = data?.meta?.total ?? data.total ?? data.items.length;
    }

    const items: SupervisorOption[] = rawItems.map((item: any) => {
      const firstName = item.first_name || item.firstName || "";
      const lastName = item.last_name || item.lastName || "";
      const fullName = item.full_name || item.name || `${firstName} ${lastName}`.trim() || "Unknown";
      const positionName =
        item.position_name || item.positionName || item.position?.position_name || item.position?.positionName || "";
      return {
        value:
          item.employee_id ||
          item.id ||
          item._id ||
          item.employeeId ||
          item.supervisor_id ||
          "",
        label: fullName,
        subLabel: positionName || undefined,
      };
    });

    const pageSize = data?.meta?.pageSize ?? query.pageSize ?? 100;
    const page = data?.meta?.page ?? query.page ?? 1;
    const totalPages =
      data?.meta?.totalPages ?? Math.max(1, Math.ceil(total / pageSize));

    return { items, total, page, pageSize, totalPages };
  },
};
