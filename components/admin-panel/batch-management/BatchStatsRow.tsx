"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface BatchStatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

function BatchStatCard({ title, value, className }: BatchStatCardProps) {
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

// Stats data for Batch Management
const statsData = [
  { title: "Total Number of Batches", value: "30" },
  { title: "Active Number of Batches", value: "05" },
  { title: "Completed Number of Batches", value: "25" },
  { title: "Upcoming Number of Batches", value: "00" },
];

export function BatchStatsRow() {
  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop & Tablet: Flex layout - 4 columns (since there are only 4 items, simpler than grid) */}
      <div className="hidden items-center justify-between py-3 md:flex">
        {statsData.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <BatchStatCard
              title={stat.title}
              value={stat.value}
              className="flex-1"
            />
            {/* Divider - not after last item */}
            {index < statsData.length - 1 && (
              <div className="h-[60px] w-px bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: 2 columns grid */}
      <div className="md:hidden">
        {/* Rows with 2 items each */}
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
              <BatchStatCard title={stat.title} value={stat.value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
