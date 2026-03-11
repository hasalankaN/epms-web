import type { TaskRow } from "@/types/task";

export const mockTasksData: TaskRow[] = Array.from({ length: 45 }).map(
  (_, i) => {
    const isCompleted = i % 2 === 0;
    const isBatchTask = i % 3 === 0;

    return {
      id: `task-${i + 1}`,
      createdDate: "2026/01/21",
      taskName: `Lorem Ipsum ${i + 1}`,
      createdBy: "Admin Name",
      type: isBatchTask ? "Batch Task" : "Staff Task",
      dueDate: "2026/02/21",
      status: isCompleted ? "Completed" : "Pending",
      completionRate: isCompleted ? "100%" : `${(i % 5) * 20}%`,
    };
  }
);
