import React from "react";

import { Download } from "lucide-react";

import { StatusPopover } from "@/components/common/StatusPopover";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";
import type { TaskDetail } from "@/hooks/api/tasks/useGetTaskDetail";

interface TaskGeneralInfoProps {
  task: TaskDetail;
}

function formatDate(dateStr: string | Date | null): string {
  if (!dateStr) {
    return "-";
  }

  const d = new Date(dateStr);

  if (isNaN(d.getTime())) {
    return "-";
  }

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

export function TaskGeneralInfo({ task }: TaskGeneralInfoProps) {
  const typeLabel = task.type === "BATCH" ? "Batch Task" : "Staff Task";

  return (
    <div className="flex flex-col w-full">
      {/* Title */}
      <h1 className="mt-2 md:mt-4 font-inter text-[16px] md:text-[18px] font-medium leading-[24px] md:leading-[30px] text-[#1D293D] break-words">
        {task.name}
      </h1>

      {/* Status */}
      <div className="mt-3">
        <StatusPopover
          value={typeLabel}
          options={[{ value: typeLabel, bg: "#FCE7F3", text: "#E60076" }]}
          readOnly
        />
      </div>

      {/* Date Range */}
      <div className="mt-3 font-inter text-[12px] font-normal leading-[16px] text-[#FB2C36]">
        {formatDate(task.created_at)} - {formatDate(task.due_date)}
      </div>

      {/* Task Guidelines Label */}
      <div className="mt-3 font-inter text-[12px] font-normal leading-[16px] text-[#90A1B9]">
        Task Guidelines
      </div>

      {/* Description Text */}
      <div className="mt-1 font-inter text-[13px] md:text-[14px] font-normal leading-[20px] text-[#314158] whitespace-pre-wrap">
        {task.description || "No description provided."}
      </div>

      {/* Download Button */}
      {task.assigned_batches?.length > 0 && (
        <div className="mt-3 text-[12px] text-[#45556C]">
          Assigned to batches: {task.assigned_batches.map(b => b.name).join(", ")}
        </div>
      )}
      {task.assigned_staff?.length > 0 && (
        <div className="mt-3 text-[12px] text-[#45556C]">
          Assigned to staff: {task.assigned_staff.map(s => s.name).join(", ")}
        </div>
      )}

      <div className="mt-4 sm:mt-3 flex sm:block">
        <button className={cn(BUTTON_STYLES.outline.md, "w-full sm:w-auto text-[#0F172B] font-inter text-[14px] font-semibold leading-[20px]")}>
          <Download className="h-4 w-4" />
          Download Materials
        </button>
      </div>

      {/* Separator */}
      <div className="mt-6 h-[1px] w-full bg-[#E2E8F0]" />
    </div>
  );
}
