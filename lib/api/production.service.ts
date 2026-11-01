import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, paginateArray, USE_MOCK, type PaginatedResult } from "@/lib/mock/mockUtils";
import {
  mockProductionRecords,
  mockProductionStats,
} from "@/lib/mock/production.mock";
import {
  normalizeListResponse,
  normalizeDetailResponse,
  normalizeMutationResponse,
} from "@/lib/api/responseNormalizer";
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

function mapBackendProduction(row: any): ProductionRecord {
  const target = Number(row.target_qty || row.targetUnits || 100);
  const actual = Number(row.achieved_qty || row.actualUnits || 0);
  const efficiency = Number(row.efficiency_rate || (target > 0 ? (actual / target) * 100 : 0));

  return {
    id: row.production_id || row.id,
    employeeId: row.emp_id || row.employeeId || "",
    employeeName: row.employee_name || row.employeeName || "Operator",
    employeeCode: row.employee_no || row.employeeCode || "OPR",
    date: row.date || new Date().toISOString().slice(0, 10),
    projectName: row.operation_name || row.projectName || "General Assembly",
    clientName: row.client_name || row.clientName || "Main Plant",
    expectedUnits: target,
    targetUnits: target,
    actualUnits: actual,
    achievementPercentage: Number(efficiency.toFixed(1)),
    efficiencyRate: Number(efficiency.toFixed(1)),
    rating: Number(row.supervisor_rating || row.rating || 0),
    supervisorComment: row.supervisor_comment || row.supervisorComments || "",
    supervisorComments: row.supervisor_comment || row.supervisorComments || "",
    approvalStatus: (row.approval_status || row.approvalStatus || "PENDING") as any,
  };
}

export const productionService = {
  /**
   * GET /me/production
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
    const normalized = normalizeListResponse<any>(res.data);
    const mapped = normalized.items.map(mapBackendProduction);

    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const paginated = mapped.slice((page - 1) * pageSize, page * pageSize);

    return {
      items: paginated,
      total: mapped.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(mapped.length / pageSize)),
    };
  },

  /**
   * GET /supervisor/production
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
            (p.employeeCode ? p.employeeCode.toLowerCase().includes(s) : false)
        );
      }
      return mockResponse(paginateArray(filtered, query.page || 1, query.pageSize || 10));
    }

    const res = await api.get(API_ENDPOINTS.supervisor.PRODUCTION, { params: query });
    const normalized = normalizeListResponse<any>(res.data, query.page, query.pageSize);

    return {
      items: normalized.items.map(mapBackendProduction),
      total: normalized.total,
      page: normalized.page,
      pageSize: normalized.pageSize,
      totalPages: normalized.totalPages,
    };
  },

  /**
   * PATCH /supervisor/production/:id/approval
   */
  reviewProductionRecord: async (
    id: string,
    payload: ReviewProductionDto
  ): Promise<ProductionRecord> => {
    if (USE_MOCK) {
      const rec = productionStore.find((p) => p.id === id);
      if (rec) {
        rec.approvalStatus = payload.approvalStatus || payload.decision || "APPROVED";
        rec.rating = payload.rating || 5;
        rec.supervisorComments = payload.supervisorComment || payload.comments || "";
      }
      return mockResponse(rec || productionStore[0]);
    }

    const res = await api.patch(API_ENDPOINTS.supervisor.PRODUCTION_APPROVAL(id), {
      status: payload.approvalStatus || payload.decision || "APPROVED",
      rating: payload.rating || 5,
      comment: payload.supervisorComment || payload.comments || "",
    });
    return mapBackendProduction(normalizeDetailResponse(res.data));
  },

  /**
   * Stats derivation
   */
  getProductionStats: async (): Promise<ProductionStats> => {
    if (USE_MOCK) {
      return mockResponse(mockProductionStats);
    }

    const res = await api.get(API_ENDPOINTS.me.PRODUCTION);
    const normalized = normalizeListResponse<any>(res.data);
    const items = normalized.items.map(mapBackendProduction);

    const totalTarget = items.reduce((acc, cur) => acc + (cur.targetUnits || cur.expectedUnits || 0), 0);
    const totalActual = items.reduce((acc, cur) => acc + (cur.actualUnits || 0), 0);
    const avgEff = items.length > 0 ? items.reduce((acc, cur) => acc + (cur.efficiencyRate || cur.achievementPercentage || 0), 0) / items.length : 0;
    const avgRating = items.length > 0 ? items.reduce((acc, cur) => acc + (cur.rating || 0), 0) / items.length : 0;

    return {
      avgRating: Number(avgRating.toFixed(1)),
      targetAchievementPct: Number(avgEff.toFixed(1)),
      recordsThisMonth: items.length,
      approvedPct: 100,
      monthlyTarget: totalTarget,
      achievedUnits: totalActual,
      averageEfficiency: Number(avgEff.toFixed(1)),
      averageSupervisorRating: Number(avgRating.toFixed(1)),
    };
  },

  /**
   * GET /hr/production
   */
  getHrProduction: async (
    query: ProductionFilterQuery = {}
  ): Promise<PaginatedResult<ProductionRecord>> => {
    if (USE_MOCK) {
      return mockResponse(paginateArray(productionStore, query.page || 1, query.pageSize || 10));
    }

    const res = await api.get(API_ENDPOINTS.hr.PRODUCTION, { params: query });
    const normalized = normalizeListResponse<any>(res.data, query.page, query.pageSize);

    return {
      items: normalized.items.map(mapBackendProduction),
      total: normalized.total,
      page: normalized.page,
      pageSize: normalized.pageSize,
      totalPages: normalized.totalPages,
    };
  },

  /**
   * GET /hr/production/report
   */
  getHrProductionReport: async (params: any = {}): Promise<any> => {
    if (USE_MOCK) {
      return mockResponse({ summary: "Production report generated", total: productionStore.length });
    }
    const res = await api.get(API_ENDPOINTS.hr.PRODUCTION_REPORT, { params });
    return res.data;
  },

  reviewProduction: async (payload: ReviewProductionDto): Promise<ProductionRecord> => {
    const id = (payload as any).id || (payload as any).recordId || "";
    return productionService.reviewProductionRecord(id, payload);
  },
};
