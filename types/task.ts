export type TaskStatus = "Completed" | "Pending";
export type TaskType = "Staff Task" | "Batch Task";

export interface TaskRow {
  id: string;
  createdDate: string;
  taskName: string;
  createdBy: string;
  type: TaskType;
  dueDate: string;
  status: TaskStatus;
  completionRate: string;
}
