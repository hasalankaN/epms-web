import React from "react";

import { cn } from "@/lib/utils";

interface TaskStatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

function TaskStatCard({ title, value, className }: TaskStatCardProps) {
  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-[4px] self-stretch px-4", className)}>
      {/* Title */}
      <span className="text-center font-inter text-[14px] font-normal leading-[20px] text-[#314158]">
        {title}
      </span>
      {/* Value */}
      <span className="text-center font-inter text-[18px] font-semibold leading-[30px] text-[#020618]">
        {value}
      </span>
    </div>
  );
}

// Stats data for Task Management
const statsData = [
  { title: "Time Remaining", value: "30d : 28m : 45s" },
  { title: "Total Submitted", value: "55" },
  { title: "Total Pending", value: "10" },
];

export function TaskStatsRow() {
  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop & Tablet: Flex layout - 3 columns */}
      <div className="hidden items-center justify-between py-3 h-[126px] md:flex">
        {statsData.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <TaskStatCard
              title={stat.title}
              value={stat.value}
              className="flex-1"
            />
            {/* Divider - not after last item */}
            {index < statsData.length - 1 && (
              <div className="h-[78px] w-px bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: 1 column stack to avoid squishing */}
      <div className="md:hidden">
        <div className="flex flex-col">
          {statsData.map((stat, index) => (
            <div
              key={stat.title}
              className={`
                py-4
                ${index > 0 ? "border-t border-[#E2E8F0]" : ""}
              `}
            >
              <TaskStatCard title={stat.title} value={stat.value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
