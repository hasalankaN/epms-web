import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, paginateArray, USE_MOCK, type PaginatedResult } from "@/lib/mock/mockUtils";
import { mockTrainings } from "@/lib/mock/training.mock";
import {
  normalizeListResponse,
  normalizeDetailResponse,
  normalizeMutationResponse,
} from "@/lib/api/responseNormalizer";
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

function mapBackendTraining(row: any): TrainingItem {
  return {
    id: row.training_id || row.id,
    name: row.title || row.name || "Training Program",
    description: row.description || "",
    date: row.start_date || row.date || new Date().toISOString().slice(0, 10),
    startTime: row.start_time || row.startTime || "09:00 AM",
    endTime: row.end_time || row.endTime || "04:00 PM",
    mode: (row.mode?.toUpperCase() || "PHYSICAL") as any,
    venue: row.venue || "Training Center",
    instructors: row.trainer_name ? [row.trainer_name] : ["Lead Trainer"],
    status: (row.status?.toUpperCase() || "UPCOMING") as any,
    attendanceStatus: (row.attendance_status || "ATTENDED") as any,
    materials: (row.materials || []).map((m: any) => ({
      id: m.material_id || m.id,
      name: m.file_name || m.name || "Training Material",
      type: m.file_type || "pdf",
      size: m.file_size || "1.2 MB",
      downloadUrl: m.file_url || `/me/trainings/${row.training_id || row.id}/materials`,
    })),
    budget: Number(row.budget || 0),
    budgetStatus: row.budget_status || "APPROVED",
    participantsCount: Number(row.participants_count || 15),
    hasEvaluated: Boolean(row.has_evaluated),
  };
}

export const trainingService = {
  /**
   * GET /me/trainings
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

    const res = await api.get(API_ENDPOINTS.me.TRAININGS);
    const normalized = normalizeListResponse<any>(res.data);
    let items = normalized.items.map(mapBackendTraining);

    if (query.status && query.status !== "ALL") {
      items = items.filter((t) => t.status === query.status);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((t) => t.name.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
    }

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
   * GET /supervisor/trainings/attendance
   */
  getTeamTrainingAttendance: async (): Promise<TrainingItem[]> => {
    if (USE_MOCK) {
      return mockResponse(trainingStore);
    }
    const res = await api.get(API_ENDPOINTS.supervisor.TRAININGS_ATTENDANCE);
    const normalized = normalizeListResponse<any>(res.data);
    return normalized.items.map(mapBackendTraining);
  },

  /**
   * POST /me/trainings/:id/evaluation
   */
  submitTrainingEvaluation: async (
    idOrPayload: string | TrainingEvaluationDto,
    maybePayload?: TrainingEvaluationDto
  ): Promise<{ success: boolean; message: string }> => {
    const id = typeof idOrPayload === "string" ? idOrPayload : idOrPayload.trainingId;
    const payload = typeof idOrPayload === "string" ? maybePayload! : idOrPayload;

    if (USE_MOCK) {
      const t = trainingStore.find((item) => item.id === id);
      if (t) {
        t.hasEvaluated = true;
      }
      return mockResponse({ success: true, message: "Evaluation submitted successfully" });
    }

    const res = await api.post(API_ENDPOINTS.me.TRAINING_EVALUATION(id), {
      rating: payload.rating,
      what_went_well: payload.whatWentWell,
      what_can_improve: payload.whatCanImprove,
      would_recommend: payload.wouldRecommend,
    });
    return normalizeMutationResponse(res.data, "Evaluation submitted successfully");
  },

  /**
   * GET /hr/trainings
   */
  getHrTrainings: async (
    query: TrainingFilterQuery = {}
  ): Promise<PaginatedResult<TrainingItem>> => {
    if (USE_MOCK) {
      return mockResponse(paginateArray(trainingStore, query.page || 1, query.pageSize || 10));
    }

    const res = await api.get(API_ENDPOINTS.hr.TRAININGS, { params: query });
    const normalized = normalizeListResponse<any>(res.data, query.page, query.pageSize);

    return {
      items: normalized.items.map(mapBackendTraining),
      total: normalized.total,
      page: normalized.page,
      pageSize: normalized.pageSize,
      totalPages: normalized.totalPages,
    };
  },

  /**
   * POST /hr/trainings
   */
  planTraining: async (payload: PlanTrainingDto): Promise<TrainingItem> => {
    if (USE_MOCK) {
      const newTraining: TrainingItem = {
        id: `tr-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        date: payload.startDate || payload.date || new Date().toISOString(),
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
        participantsCount: (payload.participantEmployeeIds || payload.participantIds || []).length,
      };
      trainingStore = [newTraining, ...trainingStore];
      return mockResponse(newTraining);
    }

    const res = await api.post(API_ENDPOINTS.hr.TRAININGS, {
      title: payload.name,
      description: payload.description,
      start_date: payload.startDate || payload.date,
      end_date: payload.endDate || payload.date,
      start_time: payload.startTime,
      end_time: payload.endTime,
      mode: payload.mode,
      venue: payload.venue,
      trainer_name: payload.instructors?.[0] || "Trainer",
      budget: payload.budget,
      participants: payload.participantEmployeeIds || payload.participantIds || [],
    });
    if (res.data?.success === false || res.data?.data?.success === false) {
      throw new Error(
        res.data.message ||
          res.data.data?.message ||
          "Failed to plan training session"
      );
    }
    const result = normalizeDetailResponse<any>(res.data);
    if (result?.success === false) {
      throw new Error(result.message || "Failed to plan training session");
    }
    return mapBackendTraining(result?.data ?? result);
  },

  /**
   * PATCH /hr/trainings/:id/budget
   */
  decideTrainingBudget: async (
    id: string,
    decision: "APPROVED" | "REJECTED"
  ): Promise<TrainingItem> => {
    if (USE_MOCK) {
      const t = trainingStore.find((item) => item.id === id);
      if (t) {
        t.budgetStatus = decision;
      }
      return mockResponse(t || trainingStore[0]);
    }

    const res = await api.patch(`/hr/trainings/${id}/budget`, { decision });
    return mapBackendTraining(normalizeDetailResponse(res.data));
  },
};
