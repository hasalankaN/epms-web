import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, paginateArray, USE_MOCK, type PaginatedResult } from "@/lib/mock/mockUtils";
import {
  mockLeaveBalances,
  mockLeaveApplications,
  mockLeavePolicies,
} from "@/lib/mock/leave.mock";
import {
  normalizeListResponse,
  normalizeDetailResponse,
  normalizeMutationResponse,
} from "@/lib/api/responseNormalizer";
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

function mapBackendLeave(row: any): LeaveApplication {
  const from = row.start_date || row.startDate || row.fromDate || new Date().toISOString().slice(0, 10);
  const to = row.end_date || row.endDate || row.toDate || new Date().toISOString().slice(0, 10);
  return {
    id: row.leave_id || row.id,
    employeeId: row.emp_id || row.employeeId,
    employeeName: row.employee_name || row.employeeName || "Current User",
    employeeCode: row.employee_no || row.employeeCode || "EMP",
    departmentName: row.department_name || row.departmentName || "General",
    type: row.leave_type || row.type,
    fromDate: from,
    toDate: to,
    startDate: from,
    endDate: to,
    days: Number(row.days || 1),
    reason: row.reason || "",
    status: row.status || "PENDING",
    decisionComment: row.decision_comment || row.decisionComment,
    decisionBy: row.approved_by || row.decisionBy,
    appliedOn: row.created_at || row.appliedAt || row.appliedOn || new Date().toISOString(),
    appliedAt: row.created_at || row.appliedAt || row.appliedOn || new Date().toISOString(),
  };
}

function mapBackendLeaveBalance(row: any): LeaveBalance {
  const t = (row.leave_type || row.leaveType || row.type || "ANNUAL") as any;
  const alloc = Number(row.allocated_days || row.allocated || row.total || 0);
  const used = Number(row.used_days || row.used || 0);
  const remaining = Number(row.remaining_days || row.remaining || Math.max(0, alloc - used));
  return {
    type: t,
    leaveType: t,
    label: row.label || `${t} Leave`,
    total: alloc,
    allocated: alloc,
    used,
    pending: Number(row.pending || 0),
    remaining,
  };
}

export const leaveService = {
  /**
   * GET /me/leave-balances
   */
  getMyLeaveBalances: async (): Promise<LeaveBalance[]> => {
    if (USE_MOCK) {
      return mockResponse(leaveBalancesStore);
    }
    const res = await api.get(API_ENDPOINTS.me.LEAVE_BALANCES);
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map(mapBackendLeaveBalance);
  },

  /**
   * GET /me/leaves
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
    const normalized = normalizeListResponse<any>(res.data, query.page, query.pageSize);
    const mapped = normalized.items.map(mapBackendLeave);

    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const paginated = mapped.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paginated,
      total: mapped.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(mapped.length / pageSize)),
    };
  },

  /**
   * POST /me/leaves
   */
  applyLeave: async (payload: CreateLeaveDto): Promise<LeaveApplication> => {
    if (USE_MOCK) {
      const newLeave: LeaveApplication = {
        id: `leave-${Date.now()}`,
        employeeId: "emp-1042",
        employeeName: "Nuwan Perera",
        employeeCode: "EMP-1042",
        departmentName: "Technology",
        type: payload.type,
        fromDate: payload.fromDate || payload.startDate || new Date().toISOString().slice(0, 10),
        toDate: payload.toDate || payload.endDate || new Date().toISOString().slice(0, 10),
        startDate: payload.startDate || payload.fromDate,
        endDate: payload.endDate || payload.toDate,
        days: payload.days || 1,
        reason: payload.reason,
        status: "PENDING",
        appliedOn: new Date().toISOString(),
        appliedAt: new Date().toISOString(),
      };
      leaveApplicationsStore = [newLeave, ...leaveApplicationsStore];
      return mockResponse(newLeave);
    }

    const res = await api.post(API_ENDPOINTS.me.LEAVES, {
      leave_type: payload.type,
      start_date: payload.startDate || payload.fromDate,
      end_date: payload.endDate || payload.toDate,
      days: payload.days || 1,
      reason: payload.reason,
    });
    return mapBackendLeave(normalizeDetailResponse(res.data));
  },

  /**
   * GET /supervisor/leaves
   */
  getTeamLeaves: async (
    query: LeaveFilterQuery = {}
  ): Promise<PaginatedResult<LeaveApplication>> => {
    if (USE_MOCK) {
      let filtered = [...leaveApplicationsStore];
      if (query.status && query.status !== "ALL") {
        filtered = filtered.filter((l) => l.status === query.status);
      }
      return mockResponse(paginateArray(filtered, query.page || 1, query.pageSize || 10));
    }

    const res = await api.get(API_ENDPOINTS.supervisor.LEAVES, { params: query });
    const normalized = normalizeListResponse<any>(res.data, query.page, query.pageSize);

    return {
      items: normalized.items.map(mapBackendLeave),
      total: normalized.total,
      page: normalized.page,
      pageSize: normalized.pageSize,
      totalPages: normalized.totalPages,
    };
  },

  /**
   * PATCH /supervisor/leaves/:id/decision
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
      }
      return mockResponse(leave || leaveApplicationsStore[0]);
    }

    const res = await api.patch(API_ENDPOINTS.supervisor.LEAVE_DECISION(id), {
      decision,
      comment,
    });
    return mapBackendLeave(normalizeDetailResponse(res.data));
  },

  /**
   * GET /hr/leaves
   */
  getHrLeaves: async (
    query: LeaveFilterQuery = {}
  ): Promise<PaginatedResult<LeaveApplication>> => {
    if (USE_MOCK) {
      let filtered = [...leaveApplicationsStore];
      if (query.status && query.status !== "ALL") {
        filtered = filtered.filter((l) => l.status === query.status);
      }
      return mockResponse(paginateArray(filtered, query.page || 1, query.pageSize || 10));
    }

    const res = await api.get(API_ENDPOINTS.hr.LEAVES, { params: query });
    const normalized = normalizeListResponse<any>(res.data, query.page, query.pageSize);

    return {
      items: normalized.items.map(mapBackendLeave),
      total: normalized.total,
      page: normalized.page,
      pageSize: normalized.pageSize,
      totalPages: normalized.totalPages,
    };
  },

  /**
   * PATCH /hr/leaves/:id/decision
   */
  decideHrLeave: async (
    id: string,
    decision: "APPROVED" | "REJECTED",
    comment: string
  ): Promise<LeaveApplication> => {
    if (USE_MOCK) {
      const leave = leaveApplicationsStore.find((l) => l.id === id);
      if (leave) {
        leave.status = decision;
        leave.decisionComment = comment;
      }
      return mockResponse(leave || leaveApplicationsStore[0]);
    }

    const res = await api.patch(API_ENDPOINTS.hr.LEAVE_DECISION(id), {
      decision,
      comment,
    });
    return mapBackendLeave(normalizeDetailResponse(res.data));
  },

  /**
   * POST /hr/leaves/special
   */
  grantSpecialLeave: async (
    payload: { employeeId: string; leaveType: string; days: number; reason: string }
  ): Promise<{ success: boolean; message: string }> => {
    if (USE_MOCK) {
      return mockResponse({ success: true, message: "Special leave quota granted successfully" });
    }

    const res = await api.post(API_ENDPOINTS.hr.LEAVE_SPECIAL, {
      emp_id: payload.employeeId,
      leave_type: payload.leaveType,
      days: payload.days,
      reason: payload.reason,
    });
    return normalizeMutationResponse(res.data, "Special leave granted");
  },

  /**
   * GET /hr/leave-balances/:empId
   */
  getEmployeeLeaveBalances: async (empId: string): Promise<LeaveBalance[]> => {
    if (USE_MOCK) {
      return mockResponse(leaveBalancesStore);
    }
    const res = await api.get(API_ENDPOINTS.hr.LEAVE_BALANCES(empId));
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map(mapBackendLeaveBalance);
  },

  /**
   * PATCH /hr/leave-balances/:empId
   */
  adjustEmployeeLeaveBalance: async (
    empId: string,
    payload: AdjustLeaveBalanceDto
  ): Promise<LeaveBalance> => {
    if (USE_MOCK) {
      const b = leaveBalancesStore.find((item) => (item.leaveType || item.type) === payload.leaveType);
      const adj = payload.adjustedDays || (payload.newBalance ? (payload.newBalance - (b?.remaining || 0)) : 0);
      if (b) {
        b.remaining += adj;
        if (b.allocated !== undefined) b.allocated += adj;
        b.total += adj;
      }
      return mockResponse(b || leaveBalancesStore[0]);
    }

    const res = await api.patch(API_ENDPOINTS.hr.LEAVE_BALANCES(empId), {
      leave_type: payload.leaveType,
      adjustment_days: payload.adjustedDays || (payload.newBalance ? (payload.newBalance - 0) : 0),
      reason: payload.reason,
    });
    return mapBackendLeaveBalance(normalizeDetailResponse(res.data));
  },

  /**
   * GET /hr/leave-policies
   */
  getLeavePolicies: async (): Promise<LeavePolicy[]> => {
    if (USE_MOCK) {
      return mockResponse(leavePoliciesStore);
    }
    const res = await api.get(API_ENDPOINTS.hr.LEAVE_POLICIES);
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map((row) => ({
      id: row.policy_id || row.id,
      leaveType: row.leave_type || row.leaveType,
      annualQuota: Number(row.annual_quota || row.annualQuota || 0),
      carryForwardLimit: Number(row.carry_forward_limit || row.carryForwardLimit || 0),
      requiresDocumentProof: Boolean(row.requires_document_proof || row.requiresDocumentProof),
      applicableGender: row.applicable_gender || row.applicableGender || "ALL",
      updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
    }));
  },

  /**
   * PATCH /hr/leave-policies/:leaveType
   */
  updateLeavePolicy: async (
    leaveType: string,
    payload: Partial<LeavePolicy>
  ): Promise<LeavePolicy> => {
    if (USE_MOCK) {
      const p = leavePoliciesStore.find((item) => item.leaveType === leaveType);
      if (p) {
        Object.assign(p, payload);
        p.updatedAt = new Date().toLocaleDateString();
      }
      return mockResponse(p || leavePoliciesStore[0]);
    }

    const res = await api.patch(API_ENDPOINTS.hr.LEAVE_POLICY_DETAIL(leaveType), {
      annual_quota: payload.annualQuota,
      carry_forward_limit: payload.carryForwardLimit,
      requires_document_proof: payload.requiresDocumentProof,
      applicable_gender: payload.applicableGender,
    });
    return normalizeDetailResponse(res.data);
  },

  getSupervisorLeaves: async (query: any = {}) => {
    return leaveService.getTeamLeaves(query);
  },

  cancelLeave: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      leaveApplicationsStore = leaveApplicationsStore.filter((l) => l.id !== id);
      return;
    }
    await api.delete(`${API_ENDPOINTS.me.LEAVES}/${id}`);
  },

  adjustLeaveBalance: async (payload: AdjustLeaveBalanceDto): Promise<LeaveBalance> => {
    return leaveService.adjustEmployeeLeaveBalance(payload.employeeId, payload);
  },
};
