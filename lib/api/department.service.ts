import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type {
  DepartmentItem,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentListQuery,
  DepartmentListResponse,
} from "@/types/dto/department.dto";

export const departmentService = {
  getDepartments: async (
    query: DepartmentListQuery = { page: 1, pageSize: 10 }
  ): Promise<DepartmentListResponse> => {
    const params = new URLSearchParams();
    if (query.page) params.append("page", String(query.page));
    if (query.pageSize) params.append("pageSize", String(query.pageSize));
    if (query.search?.trim()) params.append("search", query.search.trim());

    const endpoint = `${API_ENDPOINTS.departments.GET_ALL}?${params.toString()}`;
    const response = await api.get(endpoint);
    const data = response.data;

    // Handle various backend response formats (array, { data: [...] }, or paginated { items, total })
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
    } else if (data?.departments && Array.isArray(data.departments)) {
      rawItems = data.departments;
      total = data?.meta?.total ?? data.total ?? data.departments.length;
    }

    const items: DepartmentItem[] = rawItems.map((item: any, idx: number) => ({
      id: item.department_id || item.id || item._id || item.departmentId || `dept-${idx}`,
      departmentName: item.department_name || item.departmentName || item.name || "Unnamed Department",
      location: item.location || "Main Office",
      deptPhone: item.dept_phone || item.deptPhone || item.phone || "-",
      createdAt: item.created_at || item.createdAt,
      updatedAt: item.updated_at || item.updatedAt,
      employeeCount: item.employee_count ?? item.employeeCount ?? item.usersCount,
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

  createDepartment: async (
    payload: CreateDepartmentDto
  ): Promise<DepartmentItem> => {
    const response = await api.post(
      API_ENDPOINTS.departments.CREATE,
      payload
    );
    const resData = response.data?.data || response.data;
    return {
      id: resData?.department_id || resData?.id || resData?._id || `dept-${Date.now()}`,
      departmentName: resData?.department_name || resData?.departmentName || payload.departmentName,
      location: resData?.location || payload.location,
      deptPhone: resData?.dept_phone || resData?.deptPhone || payload.deptPhone,
      createdAt: resData?.created_at || resData?.createdAt,
      updatedAt: resData?.updated_at || resData?.updatedAt,
    };
  },

  updateDepartment: async (
    id: string,
    payload: UpdateDepartmentDto
  ): Promise<DepartmentItem> => {
    const response = await api.patch(
      API_ENDPOINTS.departments.UPDATE(id),
      {
        ...payload,
        id,
      }
    );
    const resData = response.data?.data || response.data;
    return {
      id,
      departmentName: resData?.department_name || resData?.departmentName || payload.departmentName || "",
      location: resData?.location || payload.location || "",
      deptPhone: resData?.dept_phone || resData?.deptPhone || payload.deptPhone || "",
      createdAt: resData?.created_at || resData?.createdAt,
      updatedAt: resData?.updated_at || resData?.updatedAt,
    };
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await api.delete(API_ENDPOINTS.departments.DELETE(id));
  },
};
