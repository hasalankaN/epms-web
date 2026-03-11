"use client";

import React from "react";

import { BackButton } from "@/components/common/BackButton";
import { TaskGeneralInfo } from "@/components/admin-panel/task-management/view/general/TaskGeneralInfo";
import { TaskStatsRow } from "@/components/admin-panel/task-management/view/general/TaskStatsRow";
import { TaskSubmissionDetails } from "@/components/admin-panel/task-management/view/students/TaskSubmissionDetails";

export default function ViewTaskPage() {
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
        <TaskGeneralInfo />

        {/* Stats Row */}
        <div className="mt-6">
          <TaskStatsRow />
        </div>

        {/* Submission Details Table - 16px gap (mt-4) */}
        <div className="mt-4">
          <TaskSubmissionDetails />
        </div>
      </div>
    </div>
  );
}
