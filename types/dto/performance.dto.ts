export interface CriterionRating {
  criterion: string;
  score: number; // 1-5
  comment: string;
}

export type SelfEvaluationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "SUPERVISOR_REVIEWED"
  | "FINALIZED";

export interface SelfEvaluation {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode?: string;
  departmentName?: string;
  period: string;
  deadline: string;
  status: SelfEvaluationStatus;
  criteria: CriterionRating[];
  overallRating: number;
  achievements: string;
  goals: string;
  supervisorRating?: number;
  supervisorFeedback?: string;
  supervisorComments?: string;
  strengths?: string;
  areasToImprove?: string;
  recommendation?: "NONE" | "REWARD" | "TRAINING" | "PROMOTION";
  submittedAt?: string;
}

export interface PerformanceReviewItem {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode?: string;
  departmentName?: string;
  quarter: string;
  date: string;
  reviewerName: string;
  rating: number; // 1-5
  comments: string;
  feedback: string;
  compensation?: string;
}

export interface EvaluationMeeting {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  dateTime: string;
  location: string;
  notes?: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

export interface DepartmentPerformance {
  departmentId: string;
  departmentName: string;
  avgRating: number;
  attendancePct: number;
  productionPct: number;
  headcount: number;
  rankings: {
    employeeId: string;
    employeeName: string;
    employeeCode: string;
    rating: number;
    rank: number;
  }[];
}

export interface RewardRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  departmentName: string;
  type: "BONUS" | "INCENTIVE" | "RECOGNITION";
  amount?: number;
  reason: string;
  date: string;
}

