"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface StatItem {
  key: string;
  title: string;
  value: string | number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

function StatCard({ title, value, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 px-4 py-3 md:px-4 lg:px-[68.5px] md:py-[24px] self-stretch",
        className
      )}
    >
      <span className="text-center font-inter text-[14px] font-normal leading-[20px] text-[#314158]">
        {title}
      </span>
      <span className="text-center font-inter text-[18px] font-semibold leading-[30px] text-[#020618]">
        {value}
      </span>
    </div>
  );
}

interface AnalyticsStatsRowProps {
  stats: StatItem[];
}

export function AnalyticsStatsRow({ stats }: AnalyticsStatsRowProps) {
  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      <div className="hidden items-center justify-between md:flex">
        {stats.map((stat, index) => (
          <React.Fragment key={stat.key}>
            <StatCard title={stat.title} value={stat.value} className="flex-1" />
            {index < stats.length - 1 && (
              <div className="h-[78px] w-px bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="md:hidden">
        <div className="grid grid-cols-2">
          {stats.map((stat, index) => {
            const isLast = index === stats.length - 1;
            const isOddLast = isLast && stats.length % 2 !== 0;
            
            return (
              <div
                key={stat.key}
                className={cn(
                  "py-2",
                  !isOddLast && index % 2 !== 0 ? "border-l border-[#E2E8F0]" : "",
                  index >= 2 ? "border-t border-[#E2E8F0]" : "",
                  isOddLast && "col-span-2"
                )}
              >
                <StatCard title={stat.title} value={stat.value} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
