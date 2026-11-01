import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, paginateArray, USE_MOCK, type PaginatedResult } from "@/lib/mock/mockUtils";
import { mockTrainings } from "@/lib/mock/training.mock";
import type {
  TrainingItem,
  TrainingEvaluationDto,
  PlanTrainingDto,
} from "@/types/dto/training.dto";

let trainingStore: TrainingItem[] = [...mockTrainings];

export interface TrainingFilterQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}

export const trainingService = {
  /**
   * GET /api/v1/me/trainings
   */
  getMyTrainings: async (
    query: TrainingFilterQuery = {}
  ): Promise<PaginatedResult<TrainingItem>> => {
    if (USE_MOCK) {
      let filtered = [...trainingStore];
      if (query.status && query.status !== "ALL") {
        filtered = filtered.filter((t) => t.status === query.status);
      }
      if (query.search) {
        const s = query.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.name.toLowerCase().includes(s) ||
            t.description.toLowerCase().includes(s)
        );
      }
      return mockResponse(paginateArray(filtered, query.page || 1, query.pageSize || 10));
    }
    const res = await api.get(API_ENDPOINTS.me.TRAININGS, { params: query });
    return res.data;
  },

  /**
   * GET /api/v1/supervisor/trainings/attendance
   */
  getTeamTrainingAttendance: async (): Promise<TrainingItem[]> => {
    if (USE_MOCK) {
      return mockResponse(trainingStore);
    }
    const res = await api.get(API_ENDPOINTS.supervisor.TRAININGS_ATTENDANCE);
    return res.data;
  },

  /**
   * POST /api/v1/me/trainings/:id/evaluation
   */
  submitTrainingEvaluation: async (
    payload: TrainingEvaluationDto
  ): Promise<{ success: boolean; message: string }> => {
    if (USE_MOCK) {
      const trn = trainingStore.find((t) => t.id === payload.trainingId);
      if (trn) {
        trn.hasEvaluated = true;
      }
      return mockResponse({ success: true, message: "Evaluation submitted successfully" });
    }
    const res = await api.post(
      API_ENDPOINTS.me.TRAINING_EVALUATION(payload.trainingId),
      payload
    );
    return res.data;
  },

  /**
   * POST /api/v1/hr/trainings
   */
  planTraining: async (payload: PlanTrainingDto): Promise<TrainingItem> => {
    if (USE_MOCK) {
      const newTraining: TrainingItem = {
        id: `trn-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        date: payload.date,
        startTime: payload.startTime,
        endTime: payload.endTime,
        mode: payload.mode,
        venue: payload.venue,
        instructors: payload.instructors,
        status: "UPCOMING",
        attendanceStatus: "PENDING",
        materials: [],
        budget: payload.budget,
        budgetStatus: "PENDING",
        participantsCount: payload.participantIds.length || 10,
        hasEvaluated: false,
      };
      trainingStore = [newTraining, ...trainingStore];
      return mockResponse(newTraining);
    }
    const res = await api.post(API_ENDPOINTS.hr.TRAININGS, payload);
    return res.data;
  },
};

