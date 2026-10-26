import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type {
  PositionItem,
  CreatePositionDto,
  PositionListQuery,
  PositionListResponse,
} from "@/types/dto/position.dto";

export const positionService = {
  getPositions: async (
    query: PositionListQuery = { page: 1, pageSize: 10 }
  ): Promise<PositionListResponse> => {
    const params = new URLSearchParams();
    if (query.page) params.append("page", String(query.page));
    if (query.pageSize) params.append("pageSize", String(query.pageSize));
    if (query.search?.trim()) params.append("search", query.search.trim());

    const endpoint = `${API_ENDPOINTS.positions.GET_ALL}?${params.toString()}`;
    const response = await api.get(endpoint);
    const data = response.data;

    let rawItems: any[] = [];
    let total = 0;

    if (Array.isArray(data)) {
      rawItems = data;
      total = data.length;
    } else if (Array.isArray(data?.data)) {
      rawItems = data.data;
      total = data?.meta?.total ?? data.total ?? data.data.length;
    } else if (Array.isArray(data?.items)) {
      rawItems = data.items;
      total = data?.meta?.total ?? data.total ?? data.items.length;
    } else if (data?.positions && Array.isArray(data.positions)) {
      rawItems = data.positions;
      total = data?.meta?.total ?? data.total ?? data.positions.length;
    }

    const items: PositionItem[] = rawItems.map((item: any, idx: number) => ({
      id: item.position_id || item.id || item._id || item.positionId || `pos-${idx}`,
      positionName: item.position_name || item.positionName || item.name || item.title || "Unnamed Position",
      description: item.description || "",
      effectiveDate: item.effective_date || item.effectiveDate || item.date || "",
      departmentId: item.department_id || item.departmentId,
      departmentName: item.department_name || item.departmentName || item.department?.departmentName || item.department?.department_name,
      createdAt: item.created_at || item.createdAt,
      updatedAt: item.updated_at || item.updatedAt,
      employeeCount: item.employee_count ?? item.employeeCount,
    }));

    const pageSize = data?.meta?.pageSize || query.pageSize || 10;
    const page = data?.meta?.page || query.page || 1;
    const totalPages = data?.meta?.totalPages || Math.max(1, Math.ceil(total / pageSize));

    return {
      items,
      total,
      page,
      pageSize,
      totalPages,
    };
  },

  createPosition: async (
    payload: CreatePositionDto
  ): Promise<PositionItem> => {
    const response = await api.post(
      API_ENDPOINTS.positions.CREATE,
      payload
    );
    const resData = response.data?.data || response.data;
    return {
      id: resData?.position_id || resData?.id || resData?._id || `pos-${Date.now()}`,
      positionName: resData?.position_name || resData?.positionName || payload.positionName,
      description: resData?.description || payload.description,
      effectiveDate: resData?.effective_date || resData?.effectiveDate || payload.effectiveDate,
      createdAt: resData?.created_at || resData?.createdAt,
      updatedAt: resData?.updated_at || resData?.updatedAt,
    };
  },
};
