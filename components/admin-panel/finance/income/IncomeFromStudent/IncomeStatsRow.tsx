"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useGetIncomeSummary } from "@/hooks/api/finances/useGetIncomeSummary";

interface IncomeStatCardProps {
  title: string;
  value: string;
  isLoading?: boolean;
  className?: string;
}

function IncomeStatCard({ title, value, isLoading, className }: IncomeStatCardProps) {
  return (
    <div className={cn(
      "flex h-[120px] flex-1 flex-col items-start justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-3",
      className
    )}>
      <span className="font-inter text-[14px] font-normal leading-[20px] text-[#45556C]">
        {title}
      </span>
      {isLoading ? (
        <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />
      ) : (
        <span className="font-inter text-[24px] font-semibold leading-[38px] text-[#1D293D]">
          {value}
        </span>
      )}
    </div>
  );
}

function fmtLkr(val: string | null | undefined) {
  if (!val) return "LKR 0.00";
  const num = Number(val);
  return `LKR ${num.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function IncomeStatsRow() {
  const { data: summary, isLoading } = useGetIncomeSummary();

  const stats = [
    { title: "Total Payments",            value: fmtLkr(summary?.total_all) },
    { title: "Total Payments - Batches",  value: fmtLkr(summary?.total_batches) },
    { title: "Total Payments - Courses",  value: fmtLkr(summary?.total_courses) },
    { title: "Total Payments - Products", value: fmtLkr(summary?.total_products) },
  ];

  return (
    <div className="w-full">
      <div className="hidden items-center gap-4 lg:flex lg:flex-row lg:items-stretch">
        {stats.map((s) => <IncomeStatCard key={s.title} {...s} isLoading={isLoading} />)}
      </div>
      <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
        {stats.map((s) => <IncomeStatCard key={s.title} {...s} isLoading={isLoading} />)}
      </div>
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {stats.map((s) => <IncomeStatCard key={s.title} {...s} isLoading={isLoading} className="h-[100px]" />)}
      </div>
    </div>
  );
}
