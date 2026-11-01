import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, paginateArray, USE_MOCK, type PaginatedResult } from "@/lib/mock/mockUtils";
import {
  mockLeaveBalances,
  mockLeaveApplications,
  mockLeavePolicies,
} from "@/lib/mock/leave.mock";
import type {
  LeaveBalance,
  LeaveApplication,
  LeavePolicy,
  CreateLeaveDto,
  AdjustLeaveBalanceDto,
} from "@/types/dto/leave.dto";

let leaveBalancesStore: LeaveBalance[] = [...mockLeaveBalances];
let leaveApplicationsStore: LeaveApplication[] = [...mockLeaveApplications];
let leavePoliciesStore: LeavePolicy[] = [...mockLeavePolicies];

export interface LeaveFilterQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  leaveType?: string;
  employeeId?: string;
  year?: string;
}

export const leaveService = {
  /**
   * GET /api/v1/me/leave-balances
   */
  getMyLeaveBalances: async (): Promise<LeaveBalance[]> => {
    if (USE_MOCK) {
      return mockResponse(leaveBalancesStore);
    }
    const res = await api.get(API_ENDPOINTS.me.LEAVE_BALANCES);
    return res.data;
  },

  /**
   * GET /api/v1/me/leaves
   */
  getMyLeaves: async (
    query: LeaveFilterQuery = {}
  ): Promise<PaginatedResult<LeaveApplication>> => {
    if (USE_MOCK) {
      let filtered = leaveApplicationsStore.filter((l) => l.employeeId === "emp-1042");
      if (query.status && query.status !== "ALL") {
        filtered = filtered.filter((l) => l.status === query.status);
      }
      if (query.leaveType && query.leaveType !== "ALL") {
        filtered = filtered.filter((l) => l.type === query.leaveType);
      }
      return mockResponse(paginateArray(filtered, query.page || 1, query.pageSize || 10));
    }
    const res = await api.get(API_ENDPOINTS.me.LEAVES, { params: query });
    return res.data;
  },

  /**
   * GET /api/v1/supervisor/leaves
   */
  getSupervisorLeaves: async (
    query: LeaveFilterQuery = {}
  ): Promise<PaginatedResult<LeaveApplication>> => {
    if (USE_MOCK) {
      let filtered = [...leaveApplicationsStore];
      if (query.status && query.status !== "ALL") {
        filtered = filtered.filter((l) => l.status === query.status);
      }
      if (query.search) {
        const s = query.search.toLowerCase();
        filtered = filtered.filter((l) => l.employeeName.toLowerCase().includes(s));
      }
      return mockResponse(paginateArray(filtered, query.page || 1, query.pageSize || 10));
    }
    const res = await api.get(API_ENDPOINTS.supervisor.LEAVES, { params: query });
    return res.data;
  },

  /**
   * POST /api/v1/me/leaves
   */
  applyLeave: async (payload: CreateLeaveDto): Promise<LeaveApplication> => {
    if (USE_MOCK) {
      const start = new Date(payload.fromDate);
      const end = new Date(payload.toDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const daysCount = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

      const bal = leaveBalancesStore.find((b) => b.type === payload.type);
      const remainingAfter = (bal?.remaining ?? 5) - daysCount;

      const newLeave: LeaveApplication = {
        id: `lv-${Date.now()}`,
        employeeId: "emp-1042",
        employeeName: "Nuwan Perera",
        employeeCode: "EMP-1042",
        departmentName: "Technology",
        appliedOn: new Date().toISOString().split("T")[0],
        type: payload.type,
        fromDate: payload.fromDate,
        toDate: payload.toDate,
        days: daysCount,
        reason: payload.reason,
        note: payload.note,
        status: "PENDING",
        balanceAfterApproval: remainingAfter,
      };

      leaveApplicationsStore = [newLeave, ...leaveApplicationsStore];

      // Update pending count in balance
      if (bal) {
        bal.pending += daysCount;
      }

      return mockResponse(newLeave);
    }
    const res = await api.post(API_ENDPOINTS.me.LEAVES, payload);
    return res.data;
  },

  /**
   * PATCH /api/v1/me/leaves/:id/cancel
   */
  cancelLeave: async (id: string): Promise<LeaveApplication> => {
    if (USE_MOCK) {
      const leave = leaveApplicationsStore.find((l) => l.id === id);
      if (leave) {
        leave.status = "CANCELLED";
      }
      return mockResponse(leave || leaveApplicationsStore[0]);
    }
    const res = await api.patch(`${API_ENDPOINTS.me.LEAVES}/${id}/cancel`);
    return res.data;
  },

  /**
   * PATCH /api/v1/supervisor/leaves/:id/decision
   */
  decideLeave: async (
    id: string,
    decision: "APPROVED" | "REJECTED" | "ESCALATED",
    comment: string
  ): Promise<LeaveApplication> => {
    if (USE_MOCK) {
      const leave = leaveApplicationsStore.find((l) => l.id === id);
      if (leave) {
        leave.status = decision;
        leave.decisionComment = comment;
        if (decision === "ESCALATED") {
          leave.escalatedTo = "HR Department";
        }
      }
      return mockResponse(leave || leaveApplicationsStore[0]);
    }
    const res = await api.patch(API_ENDPOINTS.supervisor.LEAVE_DECISION(id), {
      decision,
      comment,
    });
    return res.data;
  },

  /**
   * GET /api/v1/hr/leave-policies
   */
  getLeavePolicies: async (): Promise<LeavePolicy[]> => {
    if (USE_MOCK) {
      return mockResponse(leavePoliciesStore);
    }
    const res = await api.get(API_ENDPOINTS.hr.LEAVE_POLICIES);
    return res.data;
  },

  /**
   * PATCH /api/v1/hr/leave-policies/:id
   */
  updateLeavePolicy: async (
    id: string,
    payload: Partial<LeavePolicy>
  ): Promise<LeavePolicy> => {
    if (USE_MOCK) {
      const pol = leavePoliciesStore.find((p) => p.id === id);
      if (pol) {
        Object.assign(pol, payload);
      }
      return mockResponse(pol || leavePoliciesStore[0]);
    }
    const res = await api.patch(`${API_ENDPOINTS.hr.LEAVE_POLICIES}/${id}`, payload);
    return res.data;
  },

  /**
   * PATCH /api/v1/hr/leave-balances/adjust
   */
  adjustLeaveBalance: async (
    payload: AdjustLeaveBalanceDto
  ): Promise<LeaveBalance> => {
    if (USE_MOCK) {
      const bal = leaveBalancesStore.find((b) => b.type === payload.leaveType);
      if (bal) {
        bal.remaining = payload.newBalance;
        bal.total = bal.used + bal.pending + payload.newBalance;
      }
      return mockResponse(bal || leaveBalancesStore[0]);
    }
    const res = await api.patch(`${API_ENDPOINTS.hr.LEAVE_BALANCES}/adjust`, payload);
    return res.data;
  },
};

