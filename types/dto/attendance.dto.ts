export type AttendanceStatus = "PRESENT" | "LATE" | "EARLY_DEPARTURE" | "ABSENT";

export interface AttendanceRecord {
  id: string;
  employeeId?: string;
  employeeName?: string;
  employeeCode?: string;
  departmentName?: string;
  date: string;
  day: string;
  punchIn: string | null;
  punchOut: string | null;
  breakHours: number;
  workHours: number;
  isLate: boolean;
  isEarlyDeparture: boolean;
  isAbsent: boolean;
  status: AttendanceStatus;
}

export interface AttendanceStats {
  daysPresent: number;
  lateArrivals: number;
  earlyDepartures: number;
  absentDays: number;
  totalWorkHours: number;
}

export interface AttendanceAdjustmentRequest {
  id: string;
  attendanceId: string;
  employeeId?: string;
  employeeName?: string;
  date: string;
  currentPunchIn: string | null;
  currentPunchOut: string | null;
  requestedPunchIn: string;
  requestedPunchOut: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  decisionComment?: string;
  createdAt: string;
}

export interface CreateAdjustmentRequestDto {
  attendanceId: string;
  date: string;
  requestedPunchIn: string;
  requestedPunchOut: string;
  reason: string;
}

export interface AttendanceSummary {
  employeeId: string;
  employeeName: string;
  departmentName: string;
  month: string;
  presentDays: number;
  absentDays: number;
  lateCount: number;
  totalLateMinutes: number;
  totalWorkHours: number;
  heatMap: { date: string; status: AttendanceStatus; hours: number }[];
}

export interface OvertimeRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  period: string;
  regularHours: number;
  overtimeHours: number;
  overtimeAmount: number;
}

