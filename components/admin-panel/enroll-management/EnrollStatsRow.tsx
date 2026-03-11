"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface EnrollStatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

function EnrollStatCard({ title, value, className }: EnrollStatCardProps) {
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

// Stats data for Enroll Management based on user image
const statsData = [
  { title: "All Enrollments", value: "300" },
  { title: "Batch Enrollments", value: "40" },
  { title: "Course Enrollments", value: "05" },
  { title: "Pending", value: "05" },
  { title: "On Going", value: "15" },
  { title: "Completed", value: "25" },
  { title: "Hold", value: "00" },
  { title: "Dropped", value: "00" },
];

export function EnrollStatsRow() {
  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop (xl+): Flex layout - 8 columns */}
      {/* We use xl (1280px) breakpoint here because 8 columns is quite wide for standard desktop */}
      <div className="hidden items-center justify-between py-3 xl:flex overflow-x-auto">
        {statsData.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <EnrollStatCard
              title={stat.title}
              value={stat.value}
              className="flex-shrink-0 min-w-[140px]"
            />
            {/* Divider - not after last item */}
            {index < statsData.length - 1 && (
              <div className="h-[60px] w-px shrink-0 bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tablet/Small Desktop (md to xl): 4 columns grid, 2 rows */}
      <div className="hidden md:block xl:hidden">
        <div className="grid grid-cols-4">
          {statsData.map((stat, index) => (
            <div
              key={stat.title}
              className={`
                py-3
                ${index % 4 !== 0 ? "border-l border-[#E2E8F0]" : ""}
                ${index >= 4 ? "border-t border-[#E2E8F0]" : ""}
              `}
            >
              <EnrollStatCard title={stat.title} value={stat.value} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile (<md): 2 columns grid, 4 rows */}
      <div className="md:hidden">
        <div className="grid grid-cols-2">
          {statsData.map((stat, index) => (
            <div
              key={stat.title}
              className={`
                py-3
                ${index % 2 !== 0 ? "border-l border-[#E2E8F0]" : ""}
                ${index >= 2 ? "border-t border-[#E2E8F0]" : ""}
              `}
            >
              <EnrollStatCard title={stat.title} value={stat.value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
