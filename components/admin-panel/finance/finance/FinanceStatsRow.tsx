"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface FinanceStatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

function FinanceStatCard({ title, value, className }: FinanceStatCardProps) {
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

const statsData = [
  { title: "Total Payments", value: "LKR XXX,XXX.00" },
  { title: "Total Discounts", value: "LKR X,XXX.00" },
  { title: "Total Commissions", value: "LKR XX,XXX.00" },
  { title: "Total Expenses", value: "LKR XX,XXX.00" },
  { title: "Net Profit", value: "LKR XX,XXX.00" },
];

export function FinanceStatsRow() {
  return (
    <div className="w-full">
      {/* Desktop (lg+): 5 columns flex row */}
      <div className="hidden items-center gap-4 lg:flex lg:flex-row lg:items-stretch">
        {statsData.map((stat) => (
          <FinanceStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
          />
        ))}
      </div>

      {/* Tablet (md to lg): Grid for 5 items. We can use 3 columns for top row, 2 for bottom row */}
      <div className="hidden md:flex lg:hidden flex-wrap gap-4">
        {statsData.map((stat, index) => (
          <FinanceStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            className={cn(index < 3 ? "w-[calc(33.333%-11px)]" : "w-[calc(50%-8px)]")}
          />
        ))}
      </div>

      {/* Mobile (<md): 1 column (5 rows) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {statsData.map((stat) => (
          <FinanceStatCard 
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
