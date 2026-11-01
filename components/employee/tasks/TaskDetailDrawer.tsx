"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Calendar, User, Clock, CheckCircle2 } from "lucide-react";
import { useUpdateTaskStatusMutation } from "@/hooks/api/tasks/useTasks";
import type { TaskItem, TaskStatus } from "@/types/dto/task.dto";

interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: TaskItem | null;
}

export function TaskDetailDrawer({ isOpen, onClose, task }: TaskDetailDrawerProps) {
  const updateStatusMutation = useUpdateTaskStatusMutation();

  if (!task) return null;

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "DONE";

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateStatusMutation.mutate({ id: task.id, status: newStatus });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Task Details · {task.priority} Priority
            </span>
            <StatusBadge status={task.status} />
          </div>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white pt-1">
            {task.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Status Changer */}
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Update Status:</span>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
              className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1 text-xs font-semibold focus:outline-none"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Description</p>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-white dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              {task.description}
            </p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-slate-400 text-[10px]">Assigned By</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{task.assignedByName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-slate-400 text-[10px]">Due Date</p>
                <p className={`font-semibold ${isOverdue ? "text-rose-600" : "text-slate-800 dark:text-slate-200"}`}>
                  {task.dueDate} {isOverdue && "(Overdue)"}
                </p>
              </div>
            </div>
          </div>

          {/* Status History */}
          {task.statusHistory && task.statusHistory.length > 0 && (
            <div className="space-y-2">
              <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Activity Log</p>
              <div className="space-y-1.5 pl-2 border-l-2 border-slate-200 dark:border-slate-800">
                {task.statusHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Changed to <strong className="text-slate-700 dark:text-slate-300">{h.status}</strong> by {h.changedBy}
                    </span>
                    <span>{h.changedAt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

