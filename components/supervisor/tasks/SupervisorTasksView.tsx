"use client";

import React, { useState } from "react";
import {
  ClipboardCheck,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Edit,
  Trash2,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { AssignTaskModal } from "./AssignTaskModal";
import { useTeamTasksQuery, useDeleteTaskMutation } from "@/hooks/api/tasks/useTasks";
import type { TaskItem } from "@/types/dto/task.dto";

export function SupervisorTasksView() {
  const [viewMode, setViewMode] = useState<"board" | "table">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);

  const { data: tasksData, isLoading, isError } = useTeamTasksQuery({
    search,
    status: statusFilter,
    assignedToId: assigneeFilter,
  });

  const deleteMutation = useDeleteTaskMutation();
  const tasksList = tasksData?.items || [];

  const totalCount = tasksList.length;
  const inProgressCount = tasksList.filter((t) => t.status === "IN_PROGRESS").length;
  const doneCount = tasksList.filter((t) => t.status === "DONE").length;
  const overdueCount = tasksList.filter(
    (t) => new Date(t.dueDate) < new Date() && t.status !== "DONE"
  ).length;

  const handleDelete = () => {
    if (!taskToDelete) return;
    deleteMutation.mutate(taskToDelete.id, {
      onSuccess: () => setTaskToDelete(null),
    });
  };

  const columns: Column<TaskItem>[] = [
    {
      header: "Title & Description",
      cell: (item) => (
        <div>
          <p className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</p>
          <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
        </div>
      ),
    },
    {
      header: "Assigned To",
      cell: (item) => (
        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
          {item.assignedToName}
        </span>
      ),
    },
    {
      header: "Priority",
      cell: (item) => (
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
            item.priority === "HIGH"
              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40"
              : item.priority === "MEDIUM"
              ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800"
          }`}
        >
          {item.priority}
        </span>
      ),
    },
    {
      header: "Due Date",
      cell: (item) => {
        const isOverdue = new Date(item.dueDate) < new Date() && item.status !== "DONE";
        return (
          <span className={`text-xs font-semibold ${isOverdue ? "text-rose-600" : "text-slate-600 dark:text-slate-400"}`}>
            {item.dueDate} {isOverdue && "(Overdue)"}
          </span>
        );
      },
    },
    {
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Created",
      cell: (item) => <span className="text-xs text-slate-400">{item.createdAt}</span>,
    },
    {
      header: "Actions",
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setTaskToEdit(item);
              setIsModalOpen(true);
            }}
            className="h-7 text-xs px-2"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTaskToDelete(item)}
            className="h-7 text-xs px-2 text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Tasks" value={totalCount} icon={ClipboardCheck} subText="All allocated tasks" />
        <StatCard label="In Progress" value={inProgressCount} icon={ClipboardCheck} subText="Under development" />
        <StatCard label="Completed" value={doneCount} icon={ClipboardCheck} subText="Closed deliverables" />
        <StatCard
          label="Overdue Tasks"
          value={overdueCount}
          icon={AlertTriangle}
          subText="Past target deadline"
          className={overdueCount > 0 ? "border-rose-300 dark:border-rose-900" : ""}
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-900 text-[#E60076] shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <List className="h-3.5 w-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === "board"
                  ? "bg-white dark:bg-slate-900 text-[#E60076] shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Board
            </button>
          </div>

          <Button
            onClick={() => {
              setTaskToEdit(null);
              setIsModalOpen(true);
            }}
            className="bg-[#E60076] hover:bg-[#d0006a] text-white text-xs gap-1.5 font-semibold"
          >
            <Plus className="h-4 w-4" /> Assign Task
          </Button>
        </div>
      </div>

      {/* Content View */}
      {viewMode === "table" ? (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <DataTable
            data={tasksList}
            columns={columns}
            keyExtractor={(item) => item.id}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["TODO", "IN_PROGRESS", "DONE"].map((statusKey) => {
            const list = tasksList.filter((t) => t.status === statusKey);
            return (
              <div
                key={statusKey}
                className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {statusKey.replace(/_/g, " ")} ({list.length})
                  </span>
                </div>
                <div className="space-y-3">
                  {list.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 p-4 shadow-sm space-y-2"
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="font-bold text-pink-600">{task.assignedToName}</span>
                        <span className="text-slate-400 font-mono">Due: {task.dueDate}</span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{task.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{task.description}</p>
                      <div className="flex justify-end gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setTaskToEdit(task);
                            setIsModalOpen(true);
                          }}
                          className="h-6 text-[10px] px-2"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                  {list.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-6">No tasks in this lane</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AssignTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />

      <DeleteConfirmationModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Task"
        description={`Are you sure you want to delete the task "${taskToDelete?.title}"?`}
      />
    </div>
  );
}

