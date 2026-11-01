export type LeaveType = "ANNUAL" | "CASUAL" | "MEDICAL" | "NO_PAY" | "SPECIAL";
export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "ESCALATED" | "CANCELLED";

export interface LeaveBalance {
  type: LeaveType;
  label: string;
  total: number;
  used: number;
  pending: number;
  remaining: number;
}

export interface LeaveApplication {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName?: string;
  appliedOn: string;
  type: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  note?: string;
  status: LeaveStatus;
  decisionComment?: string;
  escalatedTo?: string;
  balanceAfterApproval?: number;
}

export interface CreateLeaveDto {
  type: LeaveType;
  fromDate: string;
  toDate: string;
  reason: string;
  note?: string;
}

export interface LeavePolicy {
  id: string;
  leaveType: LeaveType;
  label: string;
  daysPerYear: number;
  carryForward: boolean;
  maxCarryForwardDays: number;
  rulesDescription: string;
}

export interface AdjustLeaveBalanceDto {
  employeeId: string;
  leaveType: LeaveType;
  newBalance: number;
  reason: string;
}

