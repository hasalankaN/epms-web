import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, paginateArray, USE_MOCK, type PaginatedResult } from "@/lib/mock/mockUtils";
import {
  mockProductionRecords,
  mockProductionStats,
} from "@/lib/mock/production.mock";
import type {
  ProductionRecord,
  ProductionStats,
  ReviewProductionDto,
} from "@/types/dto/production.dto";

let productionStore: ProductionRecord[] = [...mockProductionRecords];

export interface ProductionFilterQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  approvalStatus?: string;
  projectName?: string;
  fromDate?: string;
  toDate?: string;
}

export const productionService = {
  /**
   * GET /api/v1/me/production
   */
  getMyProduction: async (
    query: ProductionFilterQuery = {}
  ): Promise<PaginatedResult<ProductionRecord>> => {
    if (USE_MOCK) {
      let filtered = productionStore.filter((p) => p.employeeId === "emp-1042");
      if (query.approvalStatus && query.approvalStatus !== "ALL") {
        filtered = filtered.filter((p) => p.approvalStatus === query.approvalStatus);
      }
      if (query.projectName && query.projectName !== "ALL") {
        filtered = filtered.filter((p) => p.projectName === query.projectName);
      }
      return mockResponse(paginateArray(filtered, query.page || 1, query.pageSize || 10));
    }
    const res = await api.get(API_ENDPOINTS.me.PRODUCTION, { params: query });
    return res.data;
  },

  /**
   * GET /api/v1/supervisor/production
   */
  getSupervisorProduction: async (
    query: ProductionFilterQuery = {}
  ): Promise<PaginatedResult<ProductionRecord>> => {
    if (USE_MOCK) {
      let filtered = [...productionStore];
      if (query.approvalStatus && query.approvalStatus !== "ALL") {
        filtered = filtered.filter((p) => p.approvalStatus === query.approvalStatus);
      }
      if (query.search) {
        const s = query.search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.employeeName.toLowerCase().includes(s) ||
            p.projectName.toLowerCase().includes(s)
        );
      }
      return mockResponse(paginateArray(filtered, query.page || 1, query.pageSize || 10));
    }
    const res = await api.get(API_ENDPOINTS.supervisor.PRODUCTION, { params: query });
    return res.data;
  },

  /**
   * GET /api/v1/me/production/stats
   */
  getProductionStats: async (): Promise<ProductionStats> => {
    if (USE_MOCK) {
      return mockResponse(mockProductionStats);
    }
    const res = await api.get(`${API_ENDPOINTS.me.PRODUCTION}/stats`);
    return res.data;
  },

  /**
   * PATCH /api/v1/supervisor/production/:id/approval
   */
  reviewProduction: async (payload: ReviewProductionDto): Promise<ProductionRecord> => {
    if (USE_MOCK) {
      const rec = productionStore.find((p) => p.id === payload.recordId);
      if (rec) {
        rec.rating = payload.rating;
        rec.supervisorComment = payload.supervisorComment;
        rec.approvalStatus = payload.approvalStatus;
      }
      return mockResponse(rec || productionStore[0]);
    }
    const res = await api.patch(
      API_ENDPOINTS.supervisor.PRODUCTION_APPROVAL(payload.recordId),
      payload
    );
    return res.data;
  },
};

