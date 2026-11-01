"use client";

import React, { useState } from "react";
import { LayoutGrid, List, Search, Clock, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { TaskDetailDrawer } from "./TaskDetailDrawer";
import { useMyTasksQuery, useUpdateTaskStatusMutation } from "@/hooks/api/tasks/useTasks";
import type { TaskItem, TaskStatus } from "@/types/dto/task.dto";

export function EmployeeTasksView() {
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: tasksData, isLoading, isError } = useMyTasksQuery({
    search,
    status: statusFilter,
  });

  const updateStatusMutation = useUpdateTaskStatusMutation();

  const tasksList = tasksData?.items || [];

  const handleOpenDetail = (task: TaskItem) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
  };

  const columns: Column<TaskItem>[] = [
    {
      header: "Task Title",
      cell: (item) => (
        <div
          onClick={() => handleOpenDetail(item)}
          className="cursor-pointer group"
        >
          <p className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-[#E60076] transition-colors">
            {item.title}
          </p>
          <p className="text-[11px] text-slate-400 line-clamp-1">{item.description}</p>
        </div>
      ),
    },
    {
      header: "Assigned By",
      cell: (item) => <span className="text-xs text-slate-600 dark:text-slate-300">{item.assignedByName}</span>,
    },
    {
      header: "Priority",
      cell: (item) => (
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
            item.priority === "HIGH"
              ? "bg-rose-50 text-rose-600"
              : item.priority === "MEDIUM"
              ? "bg-amber-50 text-amber-600"
              : "bg-slate-100 text-slate-600"
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
          <span className={`text-xs font-semibold ${isOverdue ? "text-rose-600 font-bold" : "text-slate-500"}`}>
            {item.dueDate}
          </span>
        );
      },
    },
    {
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Change Status",
      cell: (item) => (
        <select
          value={item.status}
          onChange={(e) =>
            updateStatusMutation.mutate({ id: item.id, status: e.target.value as TaskStatus })
          }
          className="text-xs rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      ),
    },
  ];

  const todoTasks = tasksList.filter((t) => t.status === "TODO");
  const inProgressTasks = tasksList.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasksList.filter((t) => t.status === "DONE");

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tasks by title or desc..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
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
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === "list"
                  ? "bg-white dark:bg-slate-900 text-[#E60076] shadow-sm font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
          </div>
        </div>
      </div>

      {/* Board View */}
      {viewMode === "board" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TO DO Column */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-400" /> To Do ({todoTasks.length})
              </span>
            </div>
            <div className="space-y-3">
              {todoTasks.map((task) => (
                <TaskCard key={task.id} task={task} onOpenDetail={handleOpenDetail} />
              ))}
              {todoTasks.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-8">No tasks in To Do</p>
              )}
            </div>
          </div>

          {/* IN PROGRESS Column */}
          <div className="rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-blue-100 dark:border-blue-900/40">
              <span className="font-bold text-xs uppercase tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" /> In Progress ({inProgressTasks.length})
              </span>
            </div>
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <TaskCard key={task.id} task={task} onOpenDetail={handleOpenDetail} />
              ))}
              {inProgressTasks.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-8">No tasks in progress</p>
              )}
            </div>
          </div>

          {/* DONE Column */}
          <div className="rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-900/40">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Done ({doneTasks.length})
              </span>
            </div>
            <div className="space-y-3">
              {doneTasks.map((task) => (
                <TaskCard key={task.id} task={task} onOpenDetail={handleOpenDetail} />
              ))}
              {doneTasks.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-8">No completed tasks yet</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <DataTable
            data={tasksList}
            columns={columns}
            keyExtractor={(item) => item.id}
            isLoading={isLoading}
            isError={isError}
          />
        </div>
      )}

      <TaskDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />
    </div>
  );
}

function TaskCard({
  task,
  onOpenDetail,
}: {
  task: TaskItem;
  onOpenDetail: (task: TaskItem) => void;
}) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "DONE";

  return (
    <div
      onClick={() => onOpenDetail(task)}
      className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/90 p-4 shadow-sm hover:shadow hover:border-pink-300 transition-all cursor-pointer space-y-2.5"
    >
      <div className="flex items-center justify-between">
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
            task.priority === "HIGH"
              ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40"
              : task.priority === "MEDIUM"
              ? "bg-amber-50 text-amber-600 dark:bg-amber-950/40"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800"
          }`}
        >
          {task.priority}
        </span>
        <span className="text-[10px] text-slate-400">by {task.assignedByName}</span>
      </div>

      <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
        {task.title}
      </h4>
      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
        {task.description}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
        <span
          className={`flex items-center gap-1 ${
            isOverdue
              ? "text-rose-600 font-bold"
              : "text-slate-400 font-medium"
          }`}
        >
          <Calendar className="h-3 w-3" />
          {task.dueDate} {isOverdue && "(Overdue)"}
        </span>
        <StatusBadge status={task.status} />
      </div>
    </div>
  );
}

