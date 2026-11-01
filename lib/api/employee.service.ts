import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { normalizeListResponse, normalizeDetailResponse, normalizeMutationResponse } from "@/lib/api/responseNormalizer";
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

export interface HrEmployeeRecord {
  id: string;
  name: string;
  code: string;
  nic: string;
  department: string;
  position: string;
  supervisor: string;
  joinDate: string;
  role: string;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE";
}

function mapEmployeeRecord(row: any): HrEmployeeRecord {
  const firstName = row.first_name || "";
  const lastName = row.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim() || row.name || "Employee";

  const deptName =
    row.department?.name ||
    row.department?.department_name ||
    row.department_name ||
    (typeof row.department === "string" ? row.department : "General");

  const posName =
    row.position?.name ||
    row.position?.position_name ||
    row.position_name ||
    (typeof row.position === "string" ? row.position : "Staff");

  let supervisorName = "None";
  if (row.supervisor) {
    if (typeof row.supervisor === "string") {
      supervisorName = row.supervisor;
    } else {
      supervisorName = `${row.supervisor.first_name || ""} ${row.supervisor.last_name || ""}`.trim() || "None";
    }
  } else if (row.supervisor_name) {
    supervisorName = row.supervisor_name;
  }

  return {
    id: String(row.emp_id || row.id || row.employee_id || ""),
    name: fullName,
    code: row.employee_no || row.epf_no || row.code || "EMP",
    nic: row.nic || row.dob || "—",
    department: deptName,
    position: posName,
    supervisor: supervisorName,
    joinDate: row.join_date || row.createdAt || "",
    role: (row.role?.toUpperCase() || "EMPLOYEE") as any,
    status: (row.status?.toUpperCase() || (row.is_active ? "ACTIVE" : "INACTIVE")) as any,
  };
}

/* ─── Employee service ────────────────────────────────────────────────── */
export const employeeService = {
  /**
   * POST /hr/employee-request
   * Submit a new employee account request to Admin for approval (HR)
   */
  createEmployeeRequest: async (
    payload: EmployeeRegisterFormValues
  ): Promise<{ success: boolean; message?: string }> => {
    const response = await api.post(
      API_ENDPOINTS.hr.EMPLOYEE_REQUEST,
      payload
    );
    return response.data;
  },

  /**
   * POST /employee/register
   * Registers a new employee directly via Admin / Employee controller endpoint.
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
   * GET /hr/employees
   * List all employees in HR directory (falls back to /employee if needed)
   */
  getHrEmployees: async (query: Record<string, any> = {}): Promise<HrEmployeeRecord[]> => {
    try {
      const response = await api.get(API_ENDPOINTS.hr.EMPLOYEES, { params: query });
      const normalized = normalizeListResponse<any>(response.data);
      return normalized.items.map(mapEmployeeRecord);
    } catch {
      const fallback = await api.get(API_ENDPOINTS.employee.GET_ALL, { params: query });
      const normalized = normalizeListResponse<any>(fallback.data);
      return normalized.items.map(mapEmployeeRecord);
    }
  },

  /**
   * POST /hr/employees
   */
  createEmployee: async (payload: any): Promise<any> => {
    const response = await api.post(API_ENDPOINTS.hr.EMPLOYEES, payload);
    return normalizeDetailResponse(response.data);
  },

  /**
   * GET /hr/employees/:id
   */
  getHrEmployeeById: async (id: string): Promise<any> => {
    const response = await api.get(API_ENDPOINTS.hr.EMPLOYEE_DETAIL(id));
    return normalizeDetailResponse(response.data);
  },

  /**
   * PATCH /hr/employees/:id
   */
  updateHrEmployee: async (id: string, payload: any): Promise<any> => {
    const response = await api.patch(API_ENDPOINTS.hr.EMPLOYEE_DETAIL(id), payload);
    return normalizeDetailResponse(response.data);
  },

  /**
   * DELETE /hr/employees/:id
   */
  deleteHrEmployee: async (id: string): Promise<any> => {
    const response = await api.delete(API_ENDPOINTS.hr.EMPLOYEE_DETAIL(id));
    return normalizeMutationResponse(response.data, "Employee deleted successfully");
  },

  /**
   * PATCH /hr/employees/:id/supervisor
   */
  assignSupervisor: async (id: string, supervisorId: string): Promise<any> => {
    const response = await api.patch(
      `${API_ENDPOINTS.hr.EMPLOYEES}/${id}/supervisor`,
      { supervisor_id: supervisorId }
    );
    return normalizeDetailResponse(response.data);
  },

  /**
   * GET /hr/employees/:id/roles
   */
  getEmployeeRoles: async (id: string): Promise<any> => {
    const response = await api.get(`${API_ENDPOINTS.hr.EMPLOYEES}/${id}/roles`);
    return normalizeDetailResponse(response.data);
  },

  /**
   * PATCH /hr/employees/:id/roles
   */
  changeHrEmployeeRole: async (id: string, role: string): Promise<any> => {
    const response = await api.patch(
      `${API_ENDPOINTS.hr.EMPLOYEES}/${id}/roles`,
      { role }
    );
    return normalizeDetailResponse(response.data);
  },

  /**
   * GET /supervisor/team
   */
  getSupervisorTeam: async (): Promise<any[]> => {
    const response = await api.get(API_ENDPOINTS.supervisor.TEAM);
    const normalized = normalizeListResponse<any>(response.data);
    return normalized.items;
  },

  /**
   * GET /supervisor/team/:empId
   */
  getSupervisorTeamMember: async (empId: string): Promise<any> => {
    const response = await api.get(API_ENDPOINTS.supervisor.TEAM_MEMBER(empId));
    return normalizeDetailResponse(response.data);
  },

  /**
   * PATCH /supervisor/team/:empId
   */
  updateSupervisorTeamMember: async (empId: string, payload: any): Promise<any> => {
    const response = await api.patch(API_ENDPOINTS.supervisor.TEAM_MEMBER(empId), payload);
    return normalizeDetailResponse(response.data);
  },

  /**
   * DELETE /supervisor/team/:empId
   */
  deleteSupervisorTeamMember: async (empId: string): Promise<any> => {
    const response = await api.delete(API_ENDPOINTS.supervisor.TEAM_MEMBER(empId));
    return normalizeMutationResponse(response.data, "Team member removed");
  },

  /**
   * PATCH /admin/employees/:id
   */
  updateEmployee: async (id: string, payload: any): Promise<any> => {
    const response = await api.patch(API_ENDPOINTS.adminEpms.EMPLOYEE_DETAIL(id), payload);
    return normalizeDetailResponse(response.data);
  },

  /**
   * POST /admin/employees/:id/delete
   */
  deleteEmployee: async (id: string): Promise<any> => {
    const response = await api.post(API_ENDPOINTS.adminEpms.EMPLOYEE_DELETE(id));
    return normalizeMutationResponse(response.data, "Employee deleted");
  },

  /**
   * PATCH /admin/employees/:id/role
   */
  changeEmployeeRole: async (id: string, role: string): Promise<any> => {
    const response = await api.patch(API_ENDPOINTS.adminEpms.EMPLOYEE_ROLE(id), { role });
    return normalizeDetailResponse(response.data);
  },

  /**
   * GET /employee/supervisors
   * Returns paginated list of employees who are supervisors.
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

  /**
   * GET /employee
   * View all employees with complete position/department/supervisor data.
   */
  getEmployees: async (query: Record<string, any> = {}): Promise<any> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        params.append(k, String(v));
      }
    });
    const endpoint = `${API_ENDPOINTS.employees.GET_ALL}?${params.toString()}`;
    const response = await api.get(endpoint);
    return response.data;
  },

  /**
   * GET /employee/:id
   * Get single employee by ID.
   */
  getEmployeeById: async (id: string): Promise<any> => {
    const response = await api.get(API_ENDPOINTS.employees.GET_BY_ID(id));
    return response.data?.data || response.data;
  },
};
