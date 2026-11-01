"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTaskMutation, useUpdateTaskMutation } from "@/hooks/api/tasks/useTasks";
import type { TaskItem, TaskPriority } from "@/types/dto/task.dto";

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: TaskItem | null;
}

export function AssignTaskModal({
  isOpen,
  onClose,
  taskToEdit,
}: AssignTaskModalProps) {
  const isEditing = !!taskToEdit;
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [dueDate, setDueDate] = useState(taskToEdit?.dueDate || "");
  const [priority, setPriority] = useState<TaskPriority>(taskToEdit?.priority || "MEDIUM");
  const [assignedToId, setAssignedToId] = useState(taskToEdit?.assignedToId || "emp-1042");

  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    if (isEditing && taskToEdit) {
      updateMutation.mutate(
        {
          id: taskToEdit.id,
          payload: { title, description, dueDate, priority, assignedToId },
        },
        { onSuccess: () => onClose() }
      );
    } else {
      createMutation.mutate(
        { title, description, dueDate, priority, assignedToId },
        { onSuccess: () => onClose() }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
            {isEditing ? "Edit Task Deliverable" : "Assign New Team Task"}
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Allocate sprint work, deadlines, and priorities to your direct reports.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Assignee <span className="text-rose-500">*</span>
            </label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500"
            >
              <option value="emp-1042">Nuwan Perera (Senior Software Engineer)</option>
              <option value="emp-1015">Dilani Wickramasinghe (Software Engineer)</option>
              <option value="emp-1022">Kasun Jayasuriya (QA Engineer)</option>
              <option value="emp-1033">Saman Kumara (DevOps Engineer)</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <Input
              placeholder="e.g. Implement payment webhook callback"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Description & Acceptance Criteria
            </label>
            <Textarea
              placeholder="Detail deliverables, reference issue ticket numbers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Due Date <span className="text-rose-500">*</span>
              </label>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-pink-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#E60076] hover:bg-[#d0006a] text-white"
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                !title.trim() ||
                !dueDate
              }
            >
              {isEditing ? "Update Task" : "Assign Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

