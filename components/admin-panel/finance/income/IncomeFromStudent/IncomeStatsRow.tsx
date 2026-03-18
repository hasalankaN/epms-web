"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface IncomeStatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

function IncomeStatCard({ title, value, className }: IncomeStatCardProps) {
  return (
    <div className={cn(
      "flex h-[120px] flex-1 flex-col items-start justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-3",
      className
    )}>
      {/* Title/Label */}
      <span className="font-inter text-[14px] font-normal leading-[20px] text-[#45556C]">
        {title}
      </span>
      {/* Value */}
      <span className="font-inter text-[24px] font-semibold leading-[38px] text-[#1D293D]">
        {value}
      </span>
    </div>
  );
}

// Stats data for Income From Student
const statsData = [
  { title: "Total Payments", value: "LKR XXX,XXX.00" },
  { title: "Total Payments - Batches", value: "LKR XXX,XXX.00" },
  { title: "Total Payments - Courses", value: "LKR XXX,XXX.00" },
  { title: "Total Payments - Products", value: "LKR XXX,XXX.00" },
];

export function IncomeStatsRow() {
  return (
    <div className="w-full">
      {/* Desktop (lg+): 4 columns flex row */}
      <div className="hidden items-center gap-4 lg:flex lg:flex-row lg:items-stretch">
        {statsData.map((stat) => (
          <IncomeStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      {/* Tablet (md to lg): 2x2 grid */}
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
        {statsData.map((stat) => (
          <IncomeStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      {/* Mobile (<md): 1 column (4 rows) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {statsData.map((stat) => (
          <IncomeStatCard 
            key={stat.title} 
            title={stat.title} 
            value={stat.value}
            className="h-[100px]"
          />
        ))}
      </div>
    </div>
  );
}
