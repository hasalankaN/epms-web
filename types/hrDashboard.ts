export interface ProfileUpdateRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  avatar?: string;
  requestDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  changes: {
    field: string;
    oldValue: string;
    newValue: string;
  }[];
}

export interface EscalatedLeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  avatar?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  escalatedBy: string;
  escalationReason: string;
  escalatedAt: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  priority: "HIGH" | "URGENT" | "NORMAL";
  hasAttachment?: boolean;
}

export interface TrainingBudgetRequest {
  id: string;
  programTitle: string;
  department: string;
  requestedBy: string;
  requestedDate: string;
  estimatedBudget: number;
  currency: string;
  participantsCount: number;
  trainer: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  description: string;
}

export interface TodayAttendanceSummary {
  date: string;
  totalEmployees: number;
  present: number;
  late: number;
  absent: number;
  earlyDeparture: number;
  onTimeRate: number;
}

export interface AttendanceIssueEmployee {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  avatar?: string;
  lateCount: number;
  absentCount: number;
  lastOccurrence: string;
  severity: "CRITICAL" | "WARNING" | "ATTENTION";
  note: string;
}

export interface UpcomingTrainingSession {
  id: string;
  title: string;
  department: string;
  date: string;
  time: string;
  trainer: string;
  venueOrPlatform: string;
  registeredCount: number;
  maxCapacity: number;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";
}

export interface OpenVacancy {
  id: string;
  title: string;
  department: string;
  type: string;
  openings: number;
  applicationsCount: number;
  upcomingInterviews: number;
  deadline: string;
  status: "OPEN" | "CLOSING_SOON" | "INTERVIEWING";
}

export interface RecruitmentOverview {
  totalOpenVacancies: number;
  newApplicationsThisWeek: number;
  interviewsScheduledThisWeek: number;
  vacancies: OpenVacancy[];
}

export interface DepartmentHeadcount {
  department: string;
  count: number;
  color: string;
}

export interface EmployeeSummaryData {
  totalEmployees: number;
  activeEmployees: number;
  onProbation: number;
  contractEmployees: number;
  departments: DepartmentHeadcount[];
  newJoinersThisMonth: {
    id: string;
    name: string;
    role: string;
    department: string;
    joinDate: string;
    avatar?: string;
  }[];
}

export interface LeaveOverviewData {
  onLeaveToday: {
    id: string;
    employeeName: string;
    department: string;
    leaveType: string;
    returnDate: string;
    avatar?: string;
  }[];
  lowBalanceEmployees: {
    id: string;
    employeeName: string;
    department: string;
    annualRemaining: number;
    casualRemaining: number;
    medicalRemaining: number;
    alertReason: string;
    avatar?: string;
  }[];
}

export interface RecentNotificationItem {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  channel: "PORTAL" | "EMAIL" | "ALL";
  sentAt: string;
  sentBy: string;
  recipientCount: number;
  readRate: number;
}
