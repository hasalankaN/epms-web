import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskService, type TaskFilterQuery } from "@/lib/api/task.service";
import { queryKeys } from "@/lib/constants/queryKeys";
import type { CreateTaskDto, UpdateTaskDto, TaskStatus } from "@/types/dto/task.dto";

export const useMyTasksQuery = (query: TaskFilterQuery = {}) => {
  return useQuery({
    queryKey: [queryKeys.employeeTasks, query],
    queryFn: () => taskService.getMyTasks(query),
  });
};

export const useTeamTasksQuery = (query: TaskFilterQuery = {}) => {
  return useQuery({
    queryKey: [queryKeys.teamTasks, query],
    queryFn: () => taskService.getTeamTasks(query),
  });
};

export const useUpdateTaskStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      taskService.updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.employeeTasks] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.teamTasks] });
      toast.success("Task status updated!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update task status.");
    },
  });
};

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskDto) => taskService.createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.teamTasks] });
      toast.success("Task assigned successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create task.");
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskDto }) =>
      taskService.updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.teamTasks] });
      toast.success("Task updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update task.");
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.teamTasks] });
      toast.success("Task deleted successfully!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete task.");
    },
  });
};

