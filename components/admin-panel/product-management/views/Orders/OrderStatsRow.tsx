"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface OrderStatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

function OrderStatCard({ title, value, className }: OrderStatCardProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-1 px-4", className)}>
      {/* Title */}
      <span className="text-center font-sans text-[14px] font-normal leading-[20px] text-[#314158]">
        {title}
      </span>
      {/* Value */}
      <span className="text-center font-sans text-[18px] font-semibold leading-[30px] text-[#020618]">
        {value}
      </span>
    </div>
  );
}

// 8 stats matching image 3
const statsData = [
  { title: "All Orders", value: "300" },
  { title: "Pending", value: "40" },
  { title: "Processing", value: "05" },
  { title: "Completed", value: "50" },
  { title: "Dispatched", value: "15" },
  { title: "Refunded", value: "25" },
  { title: "Direct Orders", value: "10" },
  { title: "Referral Orders", value: "00" },
];

export function OrderStatsRow() {
  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop (xl+): Flex layout - 8 columns */}
      <div className="hidden items-center justify-between py-3 xl:flex overflow-x-auto">
        {statsData.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <OrderStatCard
              title={stat.title}
              value={stat.value}
              className="flex-1 flex-shrink-0 min-w-[120px]"
            />
            {/* Divider - not after last item */}
            {index < statsData.length - 1 && (
              <div className="h-[60px] w-px shrink-0 bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tablet (md to xl): 4 columns grid, 2 rows */}
      <div className="hidden md:block xl:hidden">
        {/* Row 1: First 4 items */}
        <div className="grid grid-cols-4">
          {statsData.slice(0, 4).map((stat, index) => (
            <div
              key={stat.title}
              className={`py-3 ${index !== 0 ? "border-l border-[#E2E8F0]" : ""}`}
            >
              <OrderStatCard title={stat.title} value={stat.value} />
            </div>
          ))}
        </div>
        {/* Row 2: Last 4 items */}
        <div className="grid grid-cols-4 border-t border-[#E2E8F0]">
          {statsData.slice(4).map((stat, index) => (
            <div
              key={stat.title}
              className={`py-3 ${index !== 0 ? "border-l border-[#E2E8F0]" : ""}`}
            >
              <OrderStatCard title={stat.title} value={stat.value} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile (<md): 2 columns grid */}
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
              <OrderStatCard title={stat.title} value={stat.value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
