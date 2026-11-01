import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { mockResponse, paginateArray, USE_MOCK, type PaginatedResult } from "@/lib/mock/mockUtils";
import { mockTasks } from "@/lib/mock/task.mock";
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

export const taskService = {
  /**
   * GET /api/v1/me/tasks
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
    const res = await api.get(API_ENDPOINTS.me.TASKS, { params: query });
    return res.data;
  },

  /**
   * GET /api/v1/supervisor/tasks
   */
  getTeamTasks: async (
    query: TaskFilterQuery = {}
  ): Promise<PaginatedResult<TaskItem>> => {
    if (USE_MOCK) {
      let filtered = [...tasksStore];
      if (query.status && query.status !== "ALL") {
        filtered = filtered.filter((t) => t.status === query.status);
      }
      if (query.priority && query.priority !== "ALL") {
        filtered = filtered.filter((t) => t.priority === query.priority);
      }
      if (query.assignedToId && query.assignedToId !== "ALL") {
        filtered = filtered.filter((t) => t.assignedToId === query.assignedToId);
      }
      if (query.search) {
        const s = query.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.title.toLowerCase().includes(s) ||
            t.assignedToName.toLowerCase().includes(s)
        );
      }
      return mockResponse(paginateArray(filtered, query.page || 1, query.pageSize || 10));
    }
    const res = await api.get(API_ENDPOINTS.supervisor.TASKS, { params: query });
    return res.data;
  },

  /**
   * PATCH /api/v1/me/tasks/:id/status
   */
  updateTaskStatus: async (
    id: string,
    status: TaskStatus
  ): Promise<TaskItem> => {
    if (USE_MOCK) {
      const task = tasksStore.find((t) => t.id === id);
      if (task) {
        task.status = status;
        if (!task.statusHistory) task.statusHistory = [];
        task.statusHistory.push({
          status,
          changedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          changedBy: "Nuwan Perera",
        });
      }
      return mockResponse(task || tasksStore[0]);
    }
    const res = await api.patch(API_ENDPOINTS.me.TASK_STATUS(id), { status });
    return res.data;
  },

  /**
   * POST /api/v1/supervisor/tasks
   */
  createTask: async (payload: CreateTaskDto): Promise<TaskItem> => {
    if (USE_MOCK) {
      const newTask: TaskItem = {
        id: `tsk-${Date.now()}`,
        title: payload.title,
        description: payload.description,
        dueDate: payload.dueDate,
        assignedByName: "Kanishka Bandara",
        assignedById: "emp-1002",
        assignedToName: payload.assignedToId === "emp-1015" ? "Dilani Wickramasinghe" : "Nuwan Perera",
        assignedToId: payload.assignedToId,
        status: "TODO",
        priority: payload.priority,
        createdAt: new Date().toISOString().split("T")[0],
      };
      tasksStore = [newTask, ...tasksStore];
      return mockResponse(newTask);
    }
    const res = await api.post(API_ENDPOINTS.supervisor.TASKS, payload);
    return res.data;
  },

  /**
   * PATCH /api/v1/supervisor/tasks/:id
   */
  updateTask: async (id: string, payload: UpdateTaskDto): Promise<TaskItem> => {
    if (USE_MOCK) {
      const task = tasksStore.find((t) => t.id === id);
      if (task) {
        Object.assign(task, payload);
      }
      return mockResponse(task || tasksStore[0]);
    }
    const res = await api.patch(API_ENDPOINTS.supervisor.TASK_DETAIL(id), payload);
    return res.data;
  },

  /**
   * DELETE /api/v1/supervisor/tasks/:id
   */
  deleteTask: async (id: string): Promise<{ success: boolean }> => {
    if (USE_MOCK) {
      tasksStore = tasksStore.filter((t) => t.id !== id);
      return mockResponse({ success: true });
    }
    const res = await api.delete(API_ENDPOINTS.supervisor.TASK_DETAIL(id));
    return res.data;
  },
};

