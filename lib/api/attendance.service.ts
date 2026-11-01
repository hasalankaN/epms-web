import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, paginateArray, USE_MOCK, type PaginatedResult } from "@/lib/mock/mockUtils";
import {
  mockAttendanceRecords,
  mockAttendanceStats,
  initialAdjustmentRequests,
  mockOvertimeRecords,
} from "@/lib/mock/attendance.mock";
import type {
  AttendanceRecord,
  AttendanceStats,
  AttendanceAdjustmentRequest,
  CreateAdjustmentRequestDto,
  OvertimeRecord,
} from "@/types/dto/attendance.dto";

let attendanceStore: AttendanceRecord[] = [...mockAttendanceRecords];
let adjustmentsStore: AttendanceAdjustmentRequest[] = [...initialAdjustmentRequests];
let overtimeStore: OvertimeRecord[] = [...mockOvertimeRecords];

export interface AttendanceFilterQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  employeeId?: string;
}

export const attendanceService = {
  /**
   * GET /api/v1/me/attendance
   */
  getMyAttendance: async (
    query: AttendanceFilterQuery = {}
  ): Promise<PaginatedResult<AttendanceRecord>> => {
    if (USE_MOCK) {
      let filtered = attendanceStore.filter((r) => r.employeeId === "emp-1042");
      if (query.status && query.status !== "ALL") {
        filtered = filtered.filter((r) => r.status === query.status);
      }
      if (query.fromDate) {
        filtered = filtered.filter((r) => r.date >= query.fromDate!);
      }
      if (query.toDate) {
        filtered = filtered.filter((r) => r.date <= query.toDate!);
      }
      return mockResponse(paginateArray(filtered, query.page || 1, query.pageSize || 10));
    }
    const res = await api.get(API_ENDPOINTS.me.ATTENDANCE, { params: query });
    return res.data;
  },

  /**
   * GET /api/v1/supervisor/attendance
   */
  getTeamAttendance: async (
    query: AttendanceFilterQuery = {}
  ): Promise<PaginatedResult<AttendanceRecord>> => {
    if (USE_MOCK) {
      let filtered = [...attendanceStore];
      if (query.status && query.status !== "ALL") {
        filtered = filtered.filter((r) => r.status === query.status);
      }
      if (query.search) {
        const s = query.search.toLowerCase();
        filtered = filtered.filter(
          (r) =>
            r.employeeName?.toLowerCase().includes(s) ||
            r.employeeCode?.toLowerCase().includes(s)
        );
      }
      return mockResponse(paginateArray(filtered, query.page || 1, query.pageSize || 10));
    }
    const res = await api.get(API_ENDPOINTS.supervisor.ATTENDANCE, { params: query });
    return res.data;
  },

  /**
   * GET /api/v1/me/attendance/stats
   */
  getAttendanceStats: async (): Promise<AttendanceStats> => {
    if (USE_MOCK) {
      return mockResponse(mockAttendanceStats);
    }
    const res = await api.get(`${API_ENDPOINTS.me.ATTENDANCE}/stats`);
    return res.data;
  },

  /**
   * POST /api/v1/me/attendance/clock-in
   */
  clockIn: async (): Promise<{ message: string; punchIn: string }> => {
    if (USE_MOCK) {
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return mockResponse({ message: "Successfully clocked in", punchIn: timeStr });
    }
    const res = await api.post(API_ENDPOINTS.me.CLOCK_IN);
    return res.data;
  },

  /**
   * POST /api/v1/me/attendance/clock-out
   */
  clockOut: async (): Promise<{ message: string; punchOut: string; workHours: number }> => {
    if (USE_MOCK) {
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return mockResponse({ message: "Successfully clocked out", punchOut: timeStr, workHours: 8.0 });
    }
    const res = await api.post(API_ENDPOINTS.me.CLOCK_OUT);
    return res.data;
  },

  /**
   * GET /api/v1/me/attendance/adjustments
   */
  getAdjustmentRequests: async (): Promise<AttendanceAdjustmentRequest[]> => {
    if (USE_MOCK) {
      return mockResponse(adjustmentsStore);
    }
    const res = await api.get(API_ENDPOINTS.me.ATTENDANCE_ADJUSTMENTS);
    return res.data;
  },

  /**
   * POST /api/v1/me/attendance/adjustments
   */
  createAdjustmentRequest: async (
    payload: CreateAdjustmentRequestDto
  ): Promise<AttendanceAdjustmentRequest> => {
    if (USE_MOCK) {
      const record = attendanceStore.find((r) => r.id === payload.attendanceId);
      const newAdj: AttendanceAdjustmentRequest = {
        id: `adj-${Date.now()}`,
        attendanceId: payload.attendanceId,
        employeeId: "emp-1042",
        employeeName: "Nuwan Perera",
        date: payload.date,
        currentPunchIn: record ? record.punchIn : "09:00 AM",
        currentPunchOut: record ? record.punchOut : "05:00 PM",
        requestedPunchIn: payload.requestedPunchIn,
        requestedPunchOut: payload.requestedPunchOut,
        reason: payload.reason,
        status: "PENDING",
        createdAt: new Date().toLocaleString(),
      };
      adjustmentsStore = [newAdj, ...adjustmentsStore];
      return mockResponse(newAdj);
    }
    const res = await api.post(API_ENDPOINTS.me.ATTENDANCE_ADJUSTMENTS, payload);
    return res.data;
  },

  /**
   * PATCH /api/v1/supervisor/attendance/adjustments/:id
   */
  decideAdjustmentRequest: async (
    id: string,
    decision: "APPROVED" | "REJECTED",
    comment: string
  ): Promise<AttendanceAdjustmentRequest> => {
    if (USE_MOCK) {
      const adj = adjustmentsStore.find((a) => a.id === id);
      if (adj) {
        adj.status = decision;
        adj.decisionComment = comment;
      }
      return mockResponse(adj || adjustmentsStore[0]);
    }
    const res = await api.patch(API_ENDPOINTS.supervisor.ATTENDANCE_ADJUSTMENT_DECISION(id), {
      decision,
      comment,
    });
    return res.data;
  },

  /**
   * PATCH /api/v1/supervisor/attendance/:id
   */
  updateAttendanceRecord: async (
    id: string,
    payload: { punchIn: string; punchOut: string; reason: string }
  ): Promise<AttendanceRecord> => {
    if (USE_MOCK) {
      const rec = attendanceStore.find((r) => r.id === id);
      if (rec) {
        rec.punchIn = payload.punchIn;
        rec.punchOut = payload.punchOut;
        rec.isLate = false;
        rec.isEarlyDeparture = false;
        rec.status = "PRESENT";
      }
      return mockResponse(rec || attendanceStore[0]);
    }
    const res = await api.patch(API_ENDPOINTS.supervisor.ATTENDANCE_UPDATE(id), payload);
    return res.data;
  },

  /**
   * GET /api/v1/hr/attendance/overtime
   */
  getOvertimeRecords: async (): Promise<OvertimeRecord[]> => {
    if (USE_MOCK) {
      return mockResponse(overtimeStore);
    }
    const res = await api.get(API_ENDPOINTS.hr.OVERTIME);
    return res.data;
  },
};

