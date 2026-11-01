import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, paginateArray, USE_MOCK, type PaginatedResult } from "@/lib/mock/mockUtils";
import { mockTasks } from "@/lib/mock/task.mock";
import {
  normalizeListResponse,
  normalizeDetailResponse,
  normalizeMutationResponse,
} from "@/lib/api/responseNormalizer";
import type {
  TaskItem,
  CreateTaskDto,
  UpdateTaskDto,
  TaskStatus,
} from "@/types/dto/task.dto";

let tasksStore: TaskItem[] = [...mockTasks];

export interface TaskFilterQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  priority?: string;
  assignedToId?: string;
}

function mapBackendTask(row: any): TaskItem {
  return {
    id: row.task_id || row.id,
    title: row.title || "Untitled Task",
    description: row.description || "",
    assignedToId: row.emp_id || row.assignedToId || "",
    assignedToName: row.assigned_to_name || row.assignedToName || "Team Member",
    assignedToCode: row.assigned_to_code || row.assignedToCode || "EMP",
    departmentName: row.department_name || row.departmentName || "Operations",
    priority: (row.priority?.toUpperCase() || "MEDIUM") as any,
    status: (row.status?.toUpperCase() || "TODO") as TaskStatus,
    dueDate: row.due_date || row.dueDate || new Date().toISOString().slice(0, 10),
    assignedBy: row.assigned_by || row.assignedBy || "Supervisor",
    assignedByName: row.assigned_by || row.assignedByName || "Supervisor",
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
  };
}

export const taskService = {
  /**
   * GET /me/tasks
   */
  getMyTasks: async (
    query: TaskFilterQuery = {}
  ): Promise<PaginatedResult<TaskItem>> => {
    if (USE_MOCK) {
      let filtered = tasksStore.filter((t) => t.assignedToId === "emp-1042");
      if (query.status && query.status !== "ALL") {
        filtered = filtered.filter((t) => t.status === query.status);
      }
      if (query.priority && query.priority !== "ALL") {
        filtered = filtered.filter((t) => t.priority === query.priority);
      }
      if (query.search) {
        const s = query.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.title.toLowerCase().includes(s) ||
            t.description.toLowerCase().includes(s)
        );
      }
      return mockResponse(paginateArray(filtered, query.page || 1, query.pageSize || 10));
    }

    const res = await api.get(API_ENDPOINTS.me.TASKS);
    const normalized = normalizeListResponse<any>(res.data);
    let items = normalized.items.map(mapBackendTask);

    if (query.status && query.status !== "ALL") {
      items = items.filter((t) => t.status === query.status);
    }
    if (query.priority && query.priority !== "ALL") {
      items = items.filter((t) => t.priority === query.priority);
    }
    if (query.search) {
      const s = query.search.toLowerCase();
      items = items.filter((t) => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s));
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
   * GET /supervisor/tasks
   */
  getTeamTasks: async (
    query: TaskFilterQuery = {}
  ): Promise<PaginatedResult<TaskItem>> => {
    if (USE_MOCK) {
      let filtered = [...tasksStore];
      if (query.status && query.status !== "ALL") {
        filtered = filtered.filter((t) => t.status === query.status);
      }
      return mockResponse(paginateArray(filtered, query.page || 1, query.pageSize || 10));
    }

    const res = await api.get(API_ENDPOINTS.supervisor.TASKS);
    const normalized = normalizeListResponse<any>(res.data);
    return {
      items: normalized.items.map(mapBackendTask),
      total: normalized.total,
      page: normalized.page,
      pageSize: normalized.pageSize,
      totalPages: normalized.totalPages,
    };
  },

  /**
   * PATCH /me/tasks/:id/status
   */
  updateTaskStatus: async (
    id: string,
    status: TaskStatus
  ): Promise<TaskItem> => {
    if (USE_MOCK) {
      const task = tasksStore.find((t) => t.id === id);
      if (task) {
        task.status = status;
      }
      return mockResponse(task || tasksStore[0]);
    }

    const res = await api.patch(API_ENDPOINTS.me.TASK_STATUS(id), { status });
    return mapBackendTask(normalizeDetailResponse(res.data));
  },

  /**
   * POST /supervisor/tasks
   */
  createTask: async (payload: CreateTaskDto): Promise<TaskItem> => {
    if (USE_MOCK) {
      const newTask: TaskItem = {
        id: `task-${Date.now()}`,
        title: payload.title,
        description: payload.description,
        assignedToId: payload.assignedToId,
        assignedToName: payload.assignedToName || "Team Member",
        assignedToCode: "EMP-ASSIGNED",
        departmentName: "Operations",
        priority: payload.priority,
        status: "TODO",
        dueDate: payload.dueDate,
        assignedBy: "Supervisor",
        assignedByName: "Supervisor",
        createdAt: new Date().toLocaleDateString(),
      };
      tasksStore = [newTask, ...tasksStore];
      return mockResponse(newTask);
    }

    const res = await api.post(API_ENDPOINTS.supervisor.TASKS, {
      emp_id: payload.assignedToId,
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      due_date: payload.dueDate,
    });
    return mapBackendTask(normalizeDetailResponse(res.data));
  },

  /**
   * PATCH /supervisor/tasks/:id
   */
  updateTask: async (
    id: string,
    payload: UpdateTaskDto
  ): Promise<TaskItem> => {
    if (USE_MOCK) {
      const t = tasksStore.find((item) => item.id === id);
      if (t) {
        Object.assign(t, payload);
      }
      return mockResponse(t || tasksStore[0]);
    }

    const res = await api.patch(API_ENDPOINTS.supervisor.TASK_DETAIL(id), {
      emp_id: payload.assignedToId,
      title: payload.title,
      description: payload.description,
      priority: payload.priority,
      due_date: payload.dueDate,
      status: payload.status,
    });
    return mapBackendTask(normalizeDetailResponse(res.data));
  },

  /**
   * DELETE /supervisor/tasks/:id
   */
  deleteTask: async (id: string): Promise<{ success: boolean; message: string }> => {
    if (USE_MOCK) {
      tasksStore = tasksStore.filter((t) => t.id !== id);
      return mockResponse({ success: true, message: "Task removed successfully" });
    }

    const res = await api.delete(API_ENDPOINTS.supervisor.TASK_DETAIL(id));
    return normalizeMutationResponse(res.data, "Task deleted successfully");
  },
};
