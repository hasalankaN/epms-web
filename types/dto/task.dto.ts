export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  assignedByName: string;
  assignedById?: string;
  assignedBy?: string;
  assignedToName: string;
  assignedToId: string;
  assignedToCode?: string;
  departmentName?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt?: string;
  statusHistory?: { status: TaskStatus; changedAt: string; changedBy: string }[];
}

export interface CreateTaskDto {
  title: string;
  description: string;
  dueDate: string;
  assignedToId: string;
  assignedToName?: string;
  assignedToCode?: string;
  priority: TaskPriority;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  assignedToId?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}

