"use client";

import React from "react";

import { useParams } from "next/navigation";

import { BackButton } from "@/components/common/BackButton";
import { TaskGeneralInfo } from "@/components/admin-panel/task-management/view/general/TaskGeneralInfo";
import { TaskStatsRow } from "@/components/admin-panel/task-management/view/general/TaskStatsRow";
import { TaskSubmissionDetails } from "@/components/admin-panel/task-management/view/students/TaskSubmissionDetails";
import { useGetTaskDetail } from "@/hooks/api/tasks/useGetTaskDetail";

export default function ViewTaskPage() {
  const params = useParams();
  const taskId = params.id as string;

  const { data: taskDetail, isLoading, isError } = useGetTaskDetail(taskId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4 pt-6 md:px-6">
          <BackButton href="/admin-panel/task-management" label="Go to Task Management" />
        </div>
        <div className="pb-10 px-4 md:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-1/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
            <div className="h-20 w-full bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !taskDetail) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4 pt-6 md:px-6">
          <BackButton href="/admin-panel/task-management" label="Go to Task Management" />
        </div>
        <div className="pb-10 px-4 md:px-6 text-red-500">
          Failed to load task details. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between px-4 pt-6 md:px-6">
        <BackButton 
            href="/admin-panel/task-management" 
            label="Go to Task Management" 
        />
      </div>

      <div className="pb-10 px-4 md:px-6">
        <TaskGeneralInfo task={taskDetail} />

        {/* Stats Row */}
        <div className="mt-6">
          <TaskStatsRow task={taskDetail} />
        </div>

        {/* Submission Details Table - 16px gap (mt-4) */}
        <div className="mt-4">
          <TaskSubmissionDetails taskId={taskId} submissions={taskDetail.submissions} />
        </div>
      </div>
    </div>
  );
}
