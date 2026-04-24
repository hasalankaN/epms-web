"use client";

import React from "react";

import { cn } from "@/lib/utils";
import type { OverviewSummary } from "@/hooks/api/finances/useGetFinanceOverview";

interface FinanceStatCardProps {
  title: string;
  value: string;
  isLoading?: boolean;
  className?: string;
}

function FinanceStatCard({ title, value, isLoading, className }: FinanceStatCardProps) {
  return (
    <div className={cn(
      "flex h-[120px] flex-1 flex-col items-start justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-3",
      className
    )}>
      <span className="font-inter text-[14px] font-normal leading-[20px] text-[#45556C]">{title}</span>
      {isLoading ? (
        <div className="h-8 w-36 animate-pulse rounded bg-slate-200" />
      ) : (
        <span className="font-inter text-[24px] font-semibold leading-[38px] text-[#1D293D]">{value}</span>
      )}
    </div>
  );
}

function fmtLkr(val: string | null | undefined) {
  if (!val) return "LKR 0.00";
  
return `LKR ${Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface FinanceStatsRowProps {
  summary?: OverviewSummary;
  isLoading?: boolean;
}

export function FinanceStatsRow({ summary, isLoading }: FinanceStatsRowProps) {
  const stats = [
    { title: "Total Payments",     value: fmtLkr(summary?.total_payments) },
    { title: "Total Discounts",    value: fmtLkr(summary?.total_discounts) },
    { title: "Total Commissions",  value: fmtLkr(summary?.total_referral_commissions) },
    { title: "Total Expenses",     value: fmtLkr(summary?.total_expenses) },
    { title: "Net Profit",         value: fmtLkr(summary?.net_profit) },
  ];

  return (
    <div className="w-full">
      <div className="hidden items-center gap-4 lg:flex lg:flex-row lg:items-stretch">
        {stats.map((s) => <FinanceStatCard key={s.title} {...s} isLoading={isLoading} />)}
      </div>
      <div className="hidden md:flex lg:hidden flex-wrap gap-4">
        {stats.map((s, i) => (
          <FinanceStatCard key={s.title} {...s} isLoading={isLoading}
            className={cn(i < 3 ? "w-[calc(33.333%-11px)]" : "w-[calc(50%-8px)]")} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {stats.map((s) => <FinanceStatCard key={s.title} {...s} isLoading={isLoading} className="h-[100px]" />)}
      </div>
    </div>
  );
}
