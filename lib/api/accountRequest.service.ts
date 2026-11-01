import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, USE_MOCK } from "@/lib/mock/mockUtils";
import { mockAccountRequests } from "@/lib/mock/accountRequest.mock";
import type {
  AccountRequestItem,
  CreateAccountRequestDto,
} from "@/types/dto/accountRequest.dto";

let accountRequestsStore: AccountRequestItem[] = [...mockAccountRequests];

export const accountRequestService = {
  /**
   * GET /api/v1/hr/requests/account or /api/v1/admin/requests
   */
  getAccountRequests: async (status?: string): Promise<AccountRequestItem[]> => {
    if (USE_MOCK) {
      if (status && status !== "ALL") {
        return mockResponse(accountRequestsStore.filter((r) => r.status === status));
      }
      return mockResponse(accountRequestsStore);
    }
    const res = await api.get(API_ENDPOINTS.hr.ACCOUNT_REQUESTS, { params: { status } });
    return res.data;
  },

  /**
   * POST /api/v1/hr/requests/account
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
    const res = await api.post(API_ENDPOINTS.hr.ACCOUNT_REQUESTS, payload);
    return res.data;
  },

  /**
   * PATCH /api/v1/admin/requests/:id/decision
   */
  decideAccountRequest: async (
    id: string,
    decision: "APPROVED" | "REJECTED",
    adminComment?: string
  ): Promise<AccountRequestItem> => {
    if (USE_MOCK) {
      const req = accountRequestsStore.find((r) => r.id === id);
      if (req) {
        req.status = decision;
        req.adminComment = adminComment;
      }
      return mockResponse(req || accountRequestsStore[0]);
    }
    const res = await api.patch(API_ENDPOINTS.adminEpms.REQUEST_DECISION(id), {
      decision,
      adminComment,
    });
    return res.data;
  },
};

