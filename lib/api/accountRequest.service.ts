import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import {
  normalizeListResponse,
  normalizeDetailResponse,
  normalizeMutationResponse,
} from "@/lib/api/responseNormalizer";
import type {
  AccountRequestItem,
  CreateAccountRequestDto,
} from "@/types/dto/accountRequest.dto";

export function mapBackendAccountRequest(row: any): AccountRequestItem {
  if (!row) {
    return {
      id: "",
      type: "CREATE_ACCOUNT",
      employeeId: "",
      employeeName: "Unknown",
      employeeCode: "EMP-REQ",
      employeeEmail: "",
      departmentName: "General",
      requestedBy: "HR Department",
      requestedAt: new Date().toISOString(),
      status: "PENDING",
      reason: "",
    };
  }

  const requestType = row.request_type || row.type;
  const type =
    requestType === "ACCOUNT_CREATE" || requestType === "CREATE_ACCOUNT"
      ? "CREATE_ACCOUNT"
      : requestType === "CHANGE_ROLE" || requestType === "ROLE_CHANGE"
        ? "CHANGE_ROLE"
        : requestType === "DEACTIVATE_ACCOUNT" || requestType === "ACCOUNT_DEACTIVATE"
          ? "DEACTIVATE_ACCOUNT"
          : row.employee_no || row.epf_no || row.first_name
            ? "CREATE_ACCOUNT"
            : "DEACTIVATE_ACCOUNT";

  const firstName = row.first_name || "";
  const lastName = row.last_name || "";
  const fullName =
    `${firstName} ${lastName}`.trim() ||
    row.name ||
    row.employee_name ||
    (row.requestedBy ? `${row.requestedBy.first_name} ${row.requestedBy.last_name}`.trim() : "Employee");

  const deptName =
    row.department?.department_name ||
    row.department?.name ||
    row.departmentName ||
    "Engineering";

  const posName =
    row.position?.position_name ||
    row.position?.name ||
    row.positionName ||
    row.role ||
    "Staff";

  let requestedByStr = "HR Department";
  if (row.requestedBy) {
    requestedByStr = `${row.requestedBy.first_name || ""} ${row.requestedBy.last_name || ""}`.trim() || row.requestedBy.email || "HR";
  } else if (row.requested_by_name) {
    requestedByStr = row.requested_by_name;
  }

  return {
    id: String(row.id || row.request_id || ""),
    type,
    employeeId: row.id || row.target_emp_id || row.employee_id || "",
    employeeName: fullName,
    employeeCode: row.employee_no || row.epf_no || "EMP-REQ",
    employeeEmail: row.work_email || row.personal_email || row.email || "",
    departmentName: deptName,
    positionName: posName,
    requestedBy: requestedByStr,
    requestedAt: row.created_at || row.requested_date || new Date().toISOString(),
    status: (row.status?.toUpperCase() || "PENDING") as "PENDING" | "APPROVED" | "REJECTED",
    proposedRole: (row.role?.toUpperCase() || "EMPLOYEE"),
    reason: row.reason || `Employee account request for ${fullName}`,
    adminComment: row.rejection_reason || row.decision_comment || row.admin_comment,
    decisionComment: row.rejection_reason || row.decision_comment || row.admin_comment,
    decisionAt: row.reviewed_at || row.decision_date,
    mobileNo: row.mobile_no,
    personalEmail: row.personal_email,
    dob: row.dob,
    joinDate: row.join_date,
    street: row.street,
    city: row.city,
    province: row.province,
    country: row.country,
    emergencyContacts: row.emergency_contacts || [],
    qualifications: row.qualifications || [],
    dependents: row.dependents || [],
    rejectionReason: row.rejection_reason,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
  };
}

export const accountRequestService = {
  /**
   * GET /admin/employee-requests  — Admin view of all employee account requests
   */
  getAdminEmployeeRequests: async (params: Record<string, any> = {}): Promise<AccountRequestItem[]> => {
    const res = await api.get(API_ENDPOINTS.adminEpms.EMPLOYEE_REQUESTS, { params });
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map(mapBackendAccountRequest);
  },

  /**
   * GET /admin/employee-requests/:id  — Admin view single employee account request
   */
  getAdminEmployeeRequestById: async (id: string): Promise<AccountRequestItem> => {
    const res = await api.get(API_ENDPOINTS.adminEpms.EMPLOYEE_REQUEST_DETAIL(id));
    return mapBackendAccountRequest(normalizeDetailResponse(res.data));
  },

  /**
   * PATCH /admin/employee-requests/:id/accept  — Admin accept request & create user
   */
  acceptEmployeeRequest: async (id: string): Promise<any> => {
    const res = await api.patch(API_ENDPOINTS.adminEpms.EMPLOYEE_REQUEST_ACCEPT(id));
    return normalizeMutationResponse(res.data, "Employee account request accepted and account created");
  },

  /**
   * PATCH /admin/employee-requests/:id/reject  — Admin reject request with reason
   */
  rejectEmployeeRequest: async (id: string, reason: string): Promise<any> => {
    const res = await api.patch(API_ENDPOINTS.adminEpms.EMPLOYEE_REQUEST_REJECT(id), { reason });
    return normalizeMutationResponse(res.data, "Employee account request rejected");
  },

  /**
   * GET /hr/employee-requests  — HR view of submitted employee account requests
   */
  getHrEmployeeRequests: async (params: Record<string, any> = {}): Promise<AccountRequestItem[]> => {
    const res = await api.get(API_ENDPOINTS.hr.EMPLOYEE_REQUESTS, { params });
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map(mapBackendAccountRequest);
  },

  /**
   * GET /hr/employee-requests/:id  — HR view single request details
   */
  getHrEmployeeRequestById: async (id: string): Promise<AccountRequestItem> => {
    const res = await api.get(API_ENDPOINTS.hr.EMPLOYEE_REQUEST_DETAIL(id));
    return mapBackendAccountRequest(normalizeDetailResponse(res.data));
  },

  /**
   * Unified loader for both Admin and HR panels
   */
  getAccountRequests: async (status?: string): Promise<AccountRequestItem[]> => {
    const params: Record<string, any> = { page: 1, pageSize: 50 };
    if (status && status !== "ALL") params.status = status;

    // Try Admin endpoint first
    try {
      const res = await api.get(API_ENDPOINTS.adminEpms.EMPLOYEE_REQUESTS, { params });
      const normalized = normalizeListResponse<any>(res.data);
      return normalized.items.map(mapBackendAccountRequest);
    } catch {
      // Fallback to HR endpoint
      try {
        const resHr = await api.get(API_ENDPOINTS.hr.EMPLOYEE_REQUESTS, { params });
        const normalized = normalizeListResponse<any>(resHr.data);
        return normalized.items.map(mapBackendAccountRequest);
      } catch {
        // Fallback to general admin requests
        try {
          const resGen = await api.get(API_ENDPOINTS.adminEpms.REQUESTS, { params });
          const normalized = normalizeListResponse<any>(resGen.data);
          return normalized.items.map(mapBackendAccountRequest);
        } catch {
          return [];
        }
      }
    }
  },

  /**
   * POST /hr/requests/account for account deactivation, and role changes.
   */
  createAccountRequest: async (
    payload: CreateAccountRequestDto
  ): Promise<AccountRequestItem> => {
    const requestType =
      payload.type === "CREATE_ACCOUNT"
        ? "ACCOUNT_CREATE"
        : payload.type === "DEACTIVATE_ACCOUNT"
          ? "ACCOUNT_DEACTIVATE"
          : "ROLE_CHANGE";

    const isUuid = Boolean(payload.employeeId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.employeeId));

    const res = await api.post(API_ENDPOINTS.hr.ACCOUNT_REQUESTS, {
      request_type: requestType,
      ...(isUuid ? { target_emp_id: payload.employeeId } : {}),
      reason: payload.reason,
      request_data: {
        role: payload.proposedRole,
        employee_id: payload.employeeId,
      },
    });

    if (res.data?.success === false || res.data?.data?.success === false) {
      throw new Error(
        res.data.message ||
          res.data.data?.message ||
          "Failed to submit account request"
      );
    }
    return mapBackendAccountRequest(normalizeDetailResponse(res.data));
  },

  /**
   * Admin decision dispatch
   */
  decideAccountRequest: async (
    id: string,
    decision: "APPROVED" | "REJECTED",
    comment: string
  ): Promise<AccountRequestItem> => {
    try {
      if (decision === "APPROVED") {
        await accountRequestService.acceptEmployeeRequest(id);
      } else {
        await accountRequestService.rejectEmployeeRequest(id, comment || "Request rejected by administrator");
      }
      return accountRequestService.getAdminEmployeeRequestById(id);
    } catch {
      // Fallback for general requests (/admin/requests/:id/decision)
      const res = await api.patch(API_ENDPOINTS.adminEpms.REQUEST_DECISION(id), {
        decision,
        comment,
      });
      return mapBackendAccountRequest(normalizeDetailResponse(res.data));
    }
  },

  getAdminEmployeeRequest: async (id: string): Promise<AccountRequestItem> => {
    return accountRequestService.getAdminEmployeeRequestById(id);
  },

  getHrEmployeeRequest: async (id: string): Promise<AccountRequestItem> => {
    return accountRequestService.getHrEmployeeRequestById(id);
  },

  acceptEmployeeRequestAlias: async (id: string) => {
    return accountRequestService.acceptEmployeeRequest(id);
  },

  rejectEmployeeRequestAlias: async (id: string, reason: string) => {
    return accountRequestService.rejectEmployeeRequest(id, reason);
  },

  getAdminRequests: async (params?: any) => {
    return accountRequestService.getAdminEmployeeRequests(params);
  },
};
