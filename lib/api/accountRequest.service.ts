import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, USE_MOCK } from "@/lib/mock/mockUtils";
import { mockAccountRequests } from "@/lib/mock/accountRequest.mock";
import {
  normalizeListResponse,
  normalizeDetailResponse,
  normalizeMutationResponse,
} from "@/lib/api/responseNormalizer";
import type {
  AccountRequestItem,
  CreateAccountRequestDto,
} from "@/types/dto/accountRequest.dto";

let accountRequestsStore: AccountRequestItem[] = [...mockAccountRequests];

function mapBackendAccountRequest(row: any): AccountRequestItem {
  return {
    id: row.id || row.request_id,
    type: (row.type || (row.employee_no ? "CREATE_ACCOUNT" : "DEACTIVATE_ACCOUNT")) as any,
    employeeId: row.employee_id || row.target_emp_id || row.id,
    employeeName: `${row.first_name || ""} ${row.last_name || ""}`.trim() || row.requestedBy?.first_name || "Employee",
    employeeCode: row.employee_no || row.epf_no || "EMP-REQ",
    employeeEmail: row.work_email || row.email || "staff@epms.lk",
    departmentName: row.department?.department_name || row.departmentName || "General",
    requestedBy: row.requestedBy ? `${row.requestedBy.first_name} ${row.requestedBy.last_name}` : "HR Department",
    requestedAt: row.created_at || row.requested_date || new Date().toISOString(),
    status: (row.status || "PENDING") as "PENDING" | "APPROVED" | "REJECTED",
    proposedRole: row.role || "EMPLOYEE",
    reason: row.reason || "Account action requested",
    decisionComment: row.decision_comment || row.admin_comment,
    decisionAt: row.decision_date || row.reviewed_at,
  };
}

export const accountRequestService = {
  /**
   * GET /hr/employee-requests or /admin/employee-requests (with fallback to /admin/requests)
   */
  getAccountRequests: async (status?: string): Promise<AccountRequestItem[]> => {
    if (USE_MOCK) {
      if (status && status !== "ALL") {
        return mockResponse(accountRequestsStore.filter((r) => r.status === status));
      }
      return mockResponse(accountRequestsStore);
    }

    const params: any = {};
    if (status && status !== "ALL") params.status = status;

    try {
      // Primary HR/Admin Employee Account Requests endpoint
      const res = await api.get(API_ENDPOINTS.hr.EMPLOYEE_REQUESTS, { params });
      const normalized = normalizeListResponse<any>(res.data);
      return normalized.items.map(mapBackendAccountRequest);
    } catch {
      // Fallback to admin requests
      try {
        const resAdmin = await api.get(API_ENDPOINTS.adminEpms.REQUESTS, { params });
        const normalized = normalizeListResponse<any>(resAdmin.data);
        return normalized.items.map(mapBackendAccountRequest);
      } catch {
        return accountRequestsStore;
      }
    }
  },

  /**
   * POST /hr/employee-request (for CREATE_ACCOUNT) OR POST /hr/requests/account (for DEACTIVATE / ROLE_CHANGE)
   */
  createAccountRequest: async (
    payload: CreateAccountRequestDto
  ): Promise<AccountRequestItem> => {
    if (USE_MOCK) {
      const newReq: AccountRequestItem = {
        id: `ar-${Date.now()}`,
        type: payload.type,
        employeeId: payload.employeeId,
        employeeName: payload.employeeId === "emp-1042" ? "Nuwan Perera" : "Selected Employee",
        employeeCode: payload.employeeId === "emp-1042" ? "EMP-1042" : "EMP-NEW",
        employeeEmail: "employee@epms.lk",
        departmentName: "Technology",
        requestedBy: "Chamari Atapattu (HR)",
        requestedAt: new Date().toLocaleString(),
        status: "PENDING",
        proposedRole: payload.proposedRole || "EMPLOYEE",
        reason: payload.reason,
      };
      accountRequestsStore = [newReq, ...accountRequestsStore];
      return mockResponse(newReq);
    }

    if (payload.type === "CREATE_ACCOUNT") {
      // Uses /hr/employee-request
      const res = await api.post(API_ENDPOINTS.hr.EMPLOYEE_REQUEST, {
        first_name: payload.firstName || "New",
        last_name: payload.lastName || "Employee",
        work_email: payload.workEmail || "staff@epms.lk",
        epf_no: payload.epfNo || "EPF-AUTO",
        dob: payload.dob || "1995-01-01",
        join_date: payload.joinDate || new Date().toISOString().slice(0, 10),
        department_id: payload.departmentId,
        position_id: payload.positionId,
      });
      return mapBackendAccountRequest(normalizeDetailResponse(res.data));
    } else {
      // Uses /hr/requests/account (DEACTIVATE_ACCOUNT / ROLE_CHANGE)
      const res = await api.post(API_ENDPOINTS.hr.ACCOUNT_REQUESTS, {
        request_type: payload.type === "DEACTIVATE_ACCOUNT" ? "ACCOUNT_DEACTIVATE" : "ROLE_CHANGE",
        target_emp_id: payload.employeeId,
        reason: payload.reason,
        request_data: {
          role: payload.proposedRole,
        },
      });
      return mapBackendAccountRequest(normalizeDetailResponse(res.data));
    }
  },

  /**
   * PATCH /admin/employee-requests/:id/accept or reject, OR /admin/requests/:id/decision
   */
  decideAccountRequest: async (
    id: string,
    decision: "APPROVED" | "REJECTED",
    comment: string
  ): Promise<AccountRequestItem> => {
    if (USE_MOCK) {
      const req = accountRequestsStore.find((r) => r.id === id);
      if (req) {
        req.status = decision;
        req.decisionComment = comment;
        req.decisionAt = new Date().toLocaleString();
      }
      return mockResponse(req || accountRequestsStore[0]);
    }

    try {
      if (decision === "APPROVED") {
        const res = await api.patch(API_ENDPOINTS.adminEpms.EMPLOYEE_REQUEST_ACCEPT(id));
        return mapBackendAccountRequest(normalizeDetailResponse(res.data));
      } else {
        const res = await api.patch(API_ENDPOINTS.adminEpms.EMPLOYEE_REQUEST_REJECT(id), { reason: comment });
        return mapBackendAccountRequest(normalizeDetailResponse(res.data));
      }
    } catch {
      // Fallback to /admin/requests/:id/decision
      const res = await api.patch(API_ENDPOINTS.adminEpms.REQUEST_DECISION(id), {
        decision,
        comment,
      });
      return mapBackendAccountRequest(normalizeDetailResponse(res.data));
    }
  },
};
