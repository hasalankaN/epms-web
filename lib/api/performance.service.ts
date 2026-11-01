import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, USE_MOCK } from "@/lib/mock/mockUtils";
import {
  mockSelfEvaluations,
  mockPerformanceReviews,
  mockEvaluationMeetings,
  mockDepartmentPerformance,
  mockRewards,
} from "@/lib/mock/performance.mock";
import {
  normalizeListResponse,
  normalizeDetailResponse,
  normalizeMutationResponse,
} from "@/lib/api/responseNormalizer";
import type {
  SelfEvaluation,
  PerformanceReviewItem,
  EvaluationMeeting,
  DepartmentPerformance,
  RewardRecord,
} from "@/types/dto/performance.dto";

let evaluationsStore: SelfEvaluation[] = [...mockSelfEvaluations];
let reviewsStore: PerformanceReviewItem[] = [...mockPerformanceReviews];
let meetingsStore: EvaluationMeeting[] = [...mockEvaluationMeetings];
let deptPerfStore: DepartmentPerformance[] = [...mockDepartmentPerformance];
let rewardsStore: RewardRecord[] = [...mockRewards];

function mapBackendSelfEval(row: any): SelfEvaluation {
  if (!row) return mockSelfEvaluations[0];
  return {
    id: row.evaluation_id || row.id,
    employeeId: row.emp_id || row.employeeId || "emp-me",
    employeeName: row.employee_name || row.employeeName || "Current User",
    deadline: row.deadline || "2026-12-31",
    period: row.period || "Q4 2026",
    status: (row.status || "DRAFT") as any,
    submittedAt: row.submitted_at || row.submittedAt,
    overallRating: Number(row.overall_rating || row.overallRating || 4),
    achievements: row.achievements || "",
    challenges: row.challenges || "",
    goals: row.goals || "",
    criteria: row.criteria || mockSelfEvaluations[0].criteria,
  };
}

function mapBackendReview(row: any): PerformanceReviewItem {
  return {
    id: row.review_id || row.id,
    employeeId: row.emp_id || row.employeeId,
    employeeName: row.employee_name || row.employeeName || "Employee",
    employeeCode: row.employee_no || row.employeeCode || "EMP",
    departmentName: row.department_name || row.departmentName || "Operations",
    positionName: row.position_name || row.positionName || "Staff",
    quarter: row.quarter || row.period || "Q4 2026",
    period: row.period || "Annual 2026",
    date: row.date || row.reviewed_at || row.created_at || new Date().toISOString().split("T")[0],
    reviewerName: row.reviewer_name || row.reviewerName || "Supervisor",
    rating: Number(row.rating || 4.2),
    comments: row.comments || row.feedback || "",
    strengths: row.strengths || "Strong technical and team skills",
    areasOfImprovement: row.areas_of_improvement || row.areasOfImprovement || "Continuous skills enhancement",
    feedback: row.feedback || "Consistently delivers quality results on schedule.",
    status: (row.status || "FINALIZED") as any,
    reviewedAt: row.reviewed_at || row.created_at || new Date().toISOString().split("T")[0],
  };
}

export const performanceService = {
  /**
   * GET /me/self-evaluations/current
   */
  getCurrentSelfEvaluation: async (): Promise<SelfEvaluation> => {
    if (USE_MOCK) {
      return mockResponse(evaluationsStore[0]);
    }
    const res = await api.get(API_ENDPOINTS.me.SELF_EVALUATION_CURRENT);
    return mapBackendSelfEval(normalizeDetailResponse(res.data));
  },

  /**
   * POST /me/self-evaluations
   */
  saveSelfEvaluation: async (
    payload: Partial<SelfEvaluation>,
    isSubmit: boolean = false
  ): Promise<SelfEvaluation> => {
    if (USE_MOCK) {
      const current = evaluationsStore[0];
      if (payload.criteria) current.criteria = payload.criteria;
      if (payload.achievements !== undefined) current.achievements = payload.achievements;
      if (payload.goals !== undefined) current.goals = payload.goals;
      if (payload.overallRating !== undefined) current.overallRating = payload.overallRating;
      if (isSubmit) {
        current.status = "SUBMITTED";
        current.submittedAt = new Date().toISOString();
      }
      return mockResponse(current);
    }

    const res = await api.post(API_ENDPOINTS.me.SELF_EVALUATIONS, {
      period: payload.period || "Q4 2026",
      overall_rating: payload.overallRating,
      achievements: payload.achievements,
      challenges: payload.challenges,
      goals: payload.goals,
      criteria: payload.criteria,
      status: isSubmit ? "SUBMITTED" : "DRAFT",
    });
    return mapBackendSelfEval(normalizeDetailResponse(res.data));
  },

  /**
   * GET /me/performance-reviews
   */
  getMyPerformanceReviews: async (): Promise<PerformanceReviewItem[]> => {
    if (USE_MOCK) {
      return mockResponse(reviewsStore);
    }
    const res = await api.get(API_ENDPOINTS.me.PERFORMANCE_REVIEWS);
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map(mapBackendReview);
  },

  /**
   * GET /supervisor/team/:empId/self-evaluation
   */
  getMemberSelfEvaluation: async (empId: string): Promise<SelfEvaluation | null> => {
    if (USE_MOCK) {
      return mockResponse(evaluationsStore[0]);
    }
    try {
      const res = await api.get(`/supervisor/team/${empId}/self-evaluation`);
      return mapBackendSelfEval(normalizeDetailResponse(res.data));
    } catch {
      return null;
    }
  },

  /**
   * POST /supervisor/performance-evaluations
   */
  evaluateMember: async (payload: { employeeId: string; rating: number; feedback: string; period: string }): Promise<PerformanceReviewItem> => {
    if (USE_MOCK) {
      const rev: PerformanceReviewItem = {
        id: `rev-${Date.now()}`,
        employeeId: payload.employeeId,
        employeeName: "Team Member",
        employeeCode: "EMP-EVAL",
        departmentName: "Operations",
        positionName: "Operator",
        quarter: payload.period || "Q4 2026",
        period: payload.period,
        date: new Date().toISOString().split("T")[0],
        reviewerName: "Current Supervisor",
        rating: payload.rating,
        comments: payload.feedback || "Performance evaluated",
        strengths: "Dependable and skilled",
        areasOfImprovement: "Process optimization",
        feedback: payload.feedback,
        status: "FINALIZED",
        reviewedAt: new Date().toISOString().split("T")[0],
      };
      reviewsStore = [rev, ...reviewsStore];
      return mockResponse(rev);
    }

    const res = await api.post(API_ENDPOINTS.supervisor.PERFORMANCE_EVALUATIONS, {
      emp_id: payload.employeeId,
      rating: payload.rating,
      feedback: payload.feedback,
      period: payload.period,
    });
    return mapBackendReview(normalizeDetailResponse(res.data));
  },

  /**
   * POST /supervisor/evaluation-meetings
   */
  scheduleMeeting: async (payload: { employeeId: string; date: string; time: string; location: string; agenda: string }): Promise<EvaluationMeeting> => {
    if (USE_MOCK) {
      const m: EvaluationMeeting = {
        id: `mtg-${Date.now()}`,
        employeeId: payload.employeeId,
        employeeName: "Team Member",
        employeeCode: "EMP",
        dateTime: `${payload.date} ${payload.time}`,
        date: payload.date,
        time: payload.time,
        location: payload.location,
        agenda: payload.agenda,
        status: "SCHEDULED",
      };
      meetingsStore = [m, ...meetingsStore];
      return mockResponse(m);
    }

    const res = await api.post(API_ENDPOINTS.supervisor.EVALUATION_MEETINGS, {
      emp_id: payload.employeeId,
      date: payload.date,
      time: payload.time,
      location: payload.location,
      agenda: payload.agenda,
    });
    return normalizeDetailResponse(res.data);
  },

  /**
   * GET evaluation meetings list
   */
  getEvaluationMeetings: async (): Promise<EvaluationMeeting[]> => {
    if (USE_MOCK) {
      return mockResponse(meetingsStore);
    }
    return meetingsStore;
  },

  /**
   * GET /hr/performance-reviews
   */
  getHrPerformanceReviews: async (): Promise<PerformanceReviewItem[]> => {
    if (USE_MOCK) {
      return mockResponse(reviewsStore);
    }
    const res = await api.get(API_ENDPOINTS.hr.PERFORMANCE_REVIEWS);
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map(mapBackendReview);
  },

  /**
   * POST /hr/compensation
   */
  assignReward: async (payload: { employeeId: string; rewardType?: string; type?: any; amount?: number; reason: string }): Promise<RewardRecord> => {
    const rwType = payload.rewardType || payload.type || "BONUS";
    const amt = payload.amount || 0;
    if (USE_MOCK) {
      const rw: RewardRecord = {
        id: `rw-${Date.now()}`,
        employeeId: payload.employeeId,
        employeeName: "Selected Employee",
        employeeCode: "EMP",
        type: rwType as any,
        rewardType: rwType,
        amount: amt,
        effectiveMonth: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        status: "APPROVED",
        reason: payload.reason,
      };
      rewardsStore = [rw, ...rewardsStore];
      return mockResponse(rw);
    }

    const res = await api.post(API_ENDPOINTS.hr.COMPENSATION, {
      emp_id: payload.employeeId,
      reward_type: rwType,
      amount: amt,
      reason: payload.reason,
    });
    return normalizeDetailResponse(res.data);
  },

  /**
   * GET /hr/departments/:id/performance
   */
  getDepartmentPerformance: async (id: string = "default"): Promise<DepartmentPerformance> => {
    if (USE_MOCK) {
      return mockResponse(deptPerfStore[0]);
    }
    const res = await api.get(API_ENDPOINTS.hr.DEPARTMENT_PERFORMANCE(id));
    return normalizeDetailResponse(res.data);
  },

  getMyReviews: async (): Promise<PerformanceReviewItem[]> => {
    return performanceService.getMyPerformanceReviews();
  },

  getTeamSelfEvaluations: async (): Promise<SelfEvaluation[]> => {
    if (USE_MOCK) {
      return mockResponse(mockSelfEvaluations);
    }
    return mockSelfEvaluations;
  },

  getMeetings: async (): Promise<EvaluationMeeting[]> => {
    return performanceService.getEvaluationMeetings();
  },

  getRewards: async (): Promise<RewardRecord[]> => {
    if (USE_MOCK) {
      return mockResponse(rewardsStore);
    }
    return rewardsStore;
  },

  /**
   * PATCH /supervisor/team/:evalId/self-evaluation  — finalize supervisor appraisal
   */
  submitSupervisorEvaluation: async (
    evalId: string,
    payload: {
      supervisorRating: number;
      supervisorFeedback: string;
      supervisorComments: string;
      strengths: string;
      areasToImprove: string;
      recommendation: "NONE" | "REWARD" | "TRAINING" | "PROMOTION";
    }
  ): Promise<SelfEvaluation> => {
    if (USE_MOCK) {
      const ev = evaluationsStore.find((e) => e.id === evalId) || evaluationsStore[0];
      return mockResponse({ ...ev, status: "REVIEWED" as any });
    }
    const res = await api.patch(
      `/supervisor/team/${evalId}/self-evaluation`,
      {
        supervisor_rating: payload.supervisorRating,
        supervisor_feedback: payload.supervisorFeedback,
        supervisor_comments: payload.supervisorComments,
        strengths: payload.strengths,
        areas_to_improve: payload.areasToImprove,
        recommendation: payload.recommendation,
      }
    );
    return mapBackendSelfEval(normalizeDetailResponse(res.data));
  },

  /**
   * POST /supervisor/evaluation-meetings  — schedule via unified payload
   */
  scheduleEvaluationMeeting: async (payload: {
    employeeId: string;
    dateTime: string;
    location: string;
    notes?: string;
  }): Promise<EvaluationMeeting> => {
    const [date, time] = payload.dateTime.split("T");
    return performanceService.scheduleMeeting({
      employeeId: payload.employeeId,
      date: date || payload.dateTime,
      time: time?.substring(0, 5) || "10:00",
      location: payload.location,
      agenda: payload.notes || "",
    });
  },
};
