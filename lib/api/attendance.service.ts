import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, paginateArray, USE_MOCK, type PaginatedResult } from "@/lib/mock/mockUtils";
import {
  mockAttendanceRecords,
  mockAttendanceStats,
  initialAdjustmentRequests,
  mockOvertimeRecords,
} from "@/lib/mock/attendance.mock";
import {
  normalizeListResponse,
  normalizeDetailResponse,
  normalizeMutationResponse,
} from "@/lib/api/responseNormalizer";
import type {
  AttendanceRecord,
  AttendanceStatus,
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

function mapBackendAttendance(row: any): AttendanceRecord {
  const d = new Date(row.date);
  const dayName = isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-US", { weekday: "short" });

  let computedStatus: AttendanceStatus = "PRESENT";
  if (row.status) {
    computedStatus = row.status.toUpperCase() as AttendanceStatus;
  } else if (row.in_late) {
    computedStatus = "LATE";
  } else if (row.early_departure) {
    computedStatus = "EARLY_DEPARTURE";
  }

  return {
    id: row.attendance_id || row.id,
    employeeId: row.emp_id || row.employeeId,
    employeeName: row.employee_name || row.employeeName || "Current User",
    employeeCode: row.employee_no || row.employeeCode || "EMP",
    departmentName: row.department_name || row.departmentName || "General",
    date: row.date || new Date().toISOString().slice(0, 10),
    day: dayName,
    punchIn: row.punch_in || row.punchIn || null,
    punchOut: row.punch_out || row.punchOut || null,
    breakHours: Number(row.break_hours || row.breakHours || 0),
    workHours: Number(row.work_hours || row.workHours || 0),
    isLate: Boolean(row.in_late || row.isLate),
    isEarlyDeparture: Boolean(row.early_departure || row.isEarlyDeparture),
    isAbsent: row.status === "ABSENT" || Boolean(row.isAbsent),
    status: computedStatus,
  };
}

export const attendanceService = {
  /**
   * GET /me/attendance
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

    const params: any = {};
    if (query.status === "LATE") params.late = true;
    if (query.status === "EARLY_DEPARTURE") params.earlyDeparture = true;
    if (query.status === "ABSENT") params.absent = true;

    const res = await api.get(API_ENDPOINTS.me.ATTENDANCE, { params });
    const normalized = normalizeListResponse(res.data, query.page, query.pageSize);

    const items = normalized.items.map(mapBackendAttendance);
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const paginated = items.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paginated,
      total: items.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(items.length / pageSize)),
    };
  },

  /**
   * GET /supervisor/attendance
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
    const normalized = normalizeListResponse(res.data, query.page, query.pageSize);

    return {
      items: normalized.items.map(mapBackendAttendance),
      total: normalized.total,
      page: normalized.page,
      pageSize: normalized.pageSize,
      totalPages: normalized.totalPages,
    };
  },

  /**
   * Derive stats from /me/attendance
   */
  getAttendanceStats: async (): Promise<AttendanceStats> => {
    if (USE_MOCK) {
      return mockResponse(mockAttendanceStats);
    }

    const res = await api.get(API_ENDPOINTS.me.ATTENDANCE);
    const normalized = normalizeListResponse<any>(res.data);
    const items = normalized.items.map(mapBackendAttendance);

    const daysPresent = items.filter((i) => i.status === "PRESENT" || i.status === "LATE").length;
    const lateArrivals = items.filter((i) => i.isLate).length;
    const earlyDepartures = items.filter((i) => i.isEarlyDeparture).length;
    const absentDays = items.filter((i) => i.status === "ABSENT").length;
    const totalWorkHours = Number(items.reduce((acc, cur) => acc + (cur.workHours || 0), 0).toFixed(2));

    return {
      daysPresent,
      lateArrivals,
      earlyDepartures,
      absentDays,
      totalWorkHours,
    };
  },

  /**
   * POST /me/attendance/clock-in
   */
  clockIn: async (): Promise<{ message: string; punchIn: string }> => {
    if (USE_MOCK) {
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return mockResponse({ message: "Successfully clocked in", punchIn: timeStr });
    }

    const res = await api.post(API_ENDPOINTS.me.CLOCK_IN);
    const record = normalizeDetailResponse<any>(res.data);
    return {
      message: "Successfully clocked in",
      punchIn: record.punch_in || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  },

  /**
   * POST /me/attendance/clock-out
   */
  clockOut: async (): Promise<{ message: string; punchOut: string; workHours: number }> => {
    if (USE_MOCK) {
      const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      return mockResponse({ message: "Successfully clocked out", punchOut: timeStr, workHours: 8.0 });
    }

    const res = await api.post(API_ENDPOINTS.me.CLOCK_OUT);
    const record = normalizeDetailResponse<any>(res.data);
    return {
      message: "Successfully clocked out",
      punchOut: record.punch_out || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      workHours: Number(record.work_hours || 8.0),
    };
  },

  /**
   * GET /me/attendance (derived adjustments)
   */
  getAdjustmentRequests: async (): Promise<AttendanceAdjustmentRequest[]> => {
    if (USE_MOCK) {
      return mockResponse(adjustmentsStore);
    }
    return adjustmentsStore;
  },

  /**
   * POST /me/attendance/adjustments
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

    const res = await api.post(API_ENDPOINTS.me.ATTENDANCE_ADJUSTMENTS, {
      attendance_id: payload.attendanceId,
      new_punch_in: payload.requestedPunchIn,
      new_punch_out: payload.requestedPunchOut,
      reason: payload.reason,
    });
    const record = normalizeDetailResponse<any>(res.data);

    return {
      id: record.request_id || `adj-${Date.now()}`,
      attendanceId: payload.attendanceId,
      date: payload.date,
      currentPunchIn: null,
      currentPunchOut: null,
      requestedPunchIn: payload.requestedPunchIn,
      requestedPunchOut: payload.requestedPunchOut,
      reason: payload.reason,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * PATCH /supervisor/attendance/adjustments/:id
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
    return normalizeDetailResponse(res.data);
  },

  /**
   * PATCH /supervisor/attendance/:id
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

    const res = await api.patch(API_ENDPOINTS.supervisor.ATTENDANCE_UPDATE(id), {
      punch_in: payload.punchIn,
      punch_out: payload.punchOut,
      reason: payload.reason,
    });
    return mapBackendAttendance(normalizeDetailResponse(res.data));
  },

  /**
   * GET /hr/attendance/overtime
   */
  getOvertimeRecords: async (): Promise<OvertimeRecord[]> => {
    if (USE_MOCK) {
      return mockResponse(overtimeStore);
    }
    const res = await api.get(API_ENDPOINTS.hr.OVERTIME);
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items;
  },
};
