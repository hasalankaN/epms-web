"use client";

import { cn } from "@/lib/utils";

interface EarningStat {
  label: string;
  value: string;
  color?: string;
}

interface EarningsSummaryCardProps {
  stats: EarningStat[];
  className?: string;
}

export function EarningsSummaryCard({ stats, className }: EarningsSummaryCardProps) {
  return (
    <div className={cn(
      "flex flex-1 flex-col gap-4 rounded-[12px] border border-[#E2E8F0] bg-white p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
      className
    )}>
      <h3 className="font-sans text-[18px] font-semibold leading-7 text-[#1D293D]">
        Earnings & Financial Summary
      </h3>

      <div className="mt-4 flex flex-1 items-center divide-x divide-[#E2E8F0]">
        {stats.map((stat, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2 px-4 text-center">
            <span className="text-[14px] font-medium leading-5 text-[#62748E]">
              {stat.label}
            </span>
            <span 
              className="text-[20px] font-bold leading-8" 
              style={{ color: stat.color || "#0F172B" }}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
