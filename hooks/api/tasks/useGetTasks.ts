import { useQuery } from "@tanstack/react-query";

import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { TaskRow } from "@/types/task";

export interface GetTasksParams {
  page?: number;
  size?: number;
  search?: string;
  type?: "BATCH" | "STAFF";
  status?: "PENDING" | "COMPLETED";
  date_from?: string;
  date_to?: string;
}

export interface GetTasksResponse {
  results: TaskRow[];
  totalResults: number;
  page: number;
  size: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

function mapBackendStatus(status: string): "Completed" | "Pending" {
  return status === "COMPLETED" ? "Completed" : "Pending";
}

function mapBackendType(type: string): "Batch Task" | "Staff Task" {
  return type === "BATCH" ? "Batch Task" : "Staff Task";
}

function formatDate(dateStr: string | Date | null): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "-";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}/${mm}/${dd}`;
}

export function useGetTasks(params: GetTasksParams) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

  return useQuery<GetTasksResponse>({
    queryKey: [queryKeys.tasks, cleanParams],
    queryFn: async () => {
      const apiParams: Record<string, any> = {
        page: params.page || 1,
        size: params.size || 10,
      };

      if (params.search) apiParams.search = params.search;
      if (params.type) apiParams.type = params.type;
      if (params.status) apiParams.status = params.status;
      if (params.date_from) apiParams.date_from = params.date_from;
      if (params.date_to) apiParams.date_to = params.date_to;

      const response = await api.get(API_ENDPOINTS.tasks.GET_ALL, {
        params: apiParams,
      });

      const raw = response.data.data;
      const results: TaskRow[] = (raw.results || []).map((item: any) => ({
        id: item.id,
        createdDate: formatDate(item.created_at),
        taskName: item.name,
        createdBy: item.created_by || "Admin",
        type: mapBackendType(item.type),
        dueDate: formatDate(item.due_date),
        status: mapBackendStatus(item.status),
        completionRate: `${item.completion_rate ?? 0}%`,
      }));

      return {
        results,
        totalResults: raw.totalResults ?? raw.total ?? 0,
        page: raw.page ?? params.page ?? 1,
        size: raw.size ?? params.size ?? 10,
        totalPages: raw.totalPages ?? 1,
        isFirstPage: raw.isFirstPage ?? (raw.page ?? 1) === 1,
        isLastPage:
          raw.isLastPage ??
          (raw.page ?? 1) >= (raw.totalPages ?? 1),
      };
    },
  });
}
