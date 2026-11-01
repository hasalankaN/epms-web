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

export const performanceService = {
  /**
   * GET /api/v1/me/self-evaluations/current
   */
  getCurrentSelfEvaluation: async (): Promise<SelfEvaluation> => {
    if (USE_MOCK) {
      return mockResponse(evaluationsStore[0]);
    }
    const res = await api.get(API_ENDPOINTS.me.SELF_EVALUATION_CURRENT);
    return res.data;
  },

  /**
   * POST /api/v1/me/self-evaluations
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
    const res = await api.post(API_ENDPOINTS.me.SELF_EVALUATIONS, { ...payload, isSubmit });
    return res.data;
  },

  /**
   * GET /api/v1/me/performance-reviews
   */
  getMyReviews: async (): Promise<PerformanceReviewItem[]> => {
    if (USE_MOCK) {
      return mockResponse(reviewsStore);
    }
    const res = await api.get(API_ENDPOINTS.me.PERFORMANCE_REVIEWS);
    return res.data;
  },

  /**
   * GET /api/v1/supervisor/team/:empId/self-evaluation
   */
  getTeamSelfEvaluations: async (): Promise<SelfEvaluation[]> => {
    if (USE_MOCK) {
      return mockResponse(evaluationsStore);
    }
    const res = await api.get(`${API_ENDPOINTS.supervisor.TEAM}/self-evaluations`);
    return res.data;
  },

  /**
   * POST /api/v1/supervisor/performance-evaluations
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
      const item = evaluationsStore.find((e) => e.id === evalId);
      if (item) {
        Object.assign(item, payload);
        item.status = "FINALIZED";
      }
      return mockResponse(item || evaluationsStore[0]);
    }
    const res = await api.post(API_ENDPOINTS.supervisor.PERFORMANCE_EVALUATIONS, { evalId, ...payload });
    return res.data;
  },

  /**
   * GET /api/v1/supervisor/evaluation-meetings
   */
  getEvaluationMeetings: async (): Promise<EvaluationMeeting[]> => {
    if (USE_MOCK) {
      return mockResponse(meetingsStore);
    }
    const res = await api.get(API_ENDPOINTS.supervisor.EVALUATION_MEETINGS);
    return res.data;
  },

  /**
   * POST /api/v1/supervisor/evaluation-meetings
   */
  scheduleEvaluationMeeting: async (payload: {
    employeeId: string;
    dateTime: string;
    location: string;
    notes?: string;
  }): Promise<EvaluationMeeting> => {
    if (USE_MOCK) {
      const newMeeting: EvaluationMeeting = {
        id: `meet-${Date.now()}`,
        employeeId: payload.employeeId,
        employeeName: payload.employeeId === "emp-1042" ? "Nuwan Perera" : "Dilani Wickramasinghe",
        employeeCode: payload.employeeId === "emp-1042" ? "EMP-1042" : "EMP-1015",
        dateTime: payload.dateTime,
        location: payload.location,
        notes: payload.notes,
        status: "SCHEDULED",
      };
      meetingsStore = [newMeeting, ...meetingsStore];
      return mockResponse(newMeeting);
    }
    const res = await api.post(API_ENDPOINTS.supervisor.EVALUATION_MEETINGS, payload);
    return res.data;
  },

  /**
   * GET /api/v1/hr/departments/performance
   */
  getDepartmentPerformance: async (): Promise<DepartmentPerformance[]> => {
    if (USE_MOCK) {
      return mockResponse(deptPerfStore);
    }
    const res = await api.get(`${API_ENDPOINTS.hr.DEPARTMENT_PERFORMANCE("all")}`);
    return res.data;
  },

  /**
   * GET /api/v1/hr/compensation
   */
  getRewards: async (): Promise<RewardRecord[]> => {
    if (USE_MOCK) {
      return mockResponse(rewardsStore);
    }
    const res = await api.get(API_ENDPOINTS.hr.COMPENSATION);
    return res.data;
  },

  /**
   * POST /api/v1/hr/compensation
   */
  assignReward: async (payload: {
    employeeId: string;
    type: "BONUS" | "INCENTIVE" | "RECOGNITION";
    amount?: number;
    reason: string;
  }): Promise<RewardRecord> => {
    if (USE_MOCK) {
      const newReward: RewardRecord = {
        id: `rew-${Date.now()}`,
        employeeId: payload.employeeId,
        employeeName: payload.employeeId === "emp-1042" ? "Nuwan Perera" : "Dilani Wickramasinghe",
        employeeCode: payload.employeeId === "emp-1042" ? "EMP-1042" : "EMP-1015",
        departmentName: "Technology",
        type: payload.type,
        amount: payload.amount,
        reason: payload.reason,
        date: new Date().toISOString().split("T")[0],
      };
      rewardsStore = [newReward, ...rewardsStore];
      return mockResponse(newReward);
    }
    const res = await api.post(API_ENDPOINTS.hr.COMPENSATION, payload);
    return res.data;
  },
};

