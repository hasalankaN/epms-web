"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { PnlSummary } from "@/hooks/api/finances/useGetPnlData";

interface ProfitLossStatCardProps {
  label: React.ReactNode;
  value: string;
  isLoading?: boolean;
  className?: string;
}

function ProfitLossStatCard({
  label,
  value,
  isLoading,
  className,
}: ProfitLossStatCardProps) {
  return (
    <div
      className={cn(
        "flex h-[120px] flex-1 flex-col items-start justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-3",
        className,
      )}
    >
      <div className="font-inter text-[14px] font-normal leading-[20px] text-[#45556C]">
        {label}
      </div>
      {isLoading ? (
        <div className="h-8 w-36 animate-pulse rounded bg-slate-200" />
      ) : (
        <div className="font-inter text-[24px] font-semibold leading-[38px] text-[#1D293D]">
          {value}
        </div>
      )}
    </div>
  );
}

function fmtLkr(val: string | null | undefined) {
  if (!val) return "LKR 0.00";

  return `LKR ${Number(val).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface ProfitLossStatsRowProps {
  summary?: PnlSummary;
  isLoading?: boolean;
}

export function ProfitLossStatsRow({
  summary,
  isLoading,
}: ProfitLossStatsRowProps) {
  const isProfited = summary?.status === "PROFIT";
  const netSign = isProfited ? "+" : "-";

  const netAbs = summary
    ? Math.abs(Number(summary.net_pnl)).toLocaleString("en-LK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

  const stats = [
    {
      label: "Total Income",
      value: fmtLkr(summary?.total_income),
    },
    {
      label: "Total Expenses",
      value: fmtLkr(summary?.total_expenses),
    },
    {
      label: (
        <StatusPopover
          value={isProfited ? "Profited" : "Loss"}
          options={[
            { value: "Profited", bg: "#DFFFF0", text: "#16A34A" },
            { value: "Loss", bg: "#FFDEDE", text: "#FB2C36" },
          ]}
          readOnly
        />
      ),
      value: `${netSign}LKR ${netAbs}`,
    },
  ];

  return (
    <div className="w-full">
      <div className="hidden items-center gap-4 lg:flex lg:flex-row lg:items-stretch">
        {stats.map((stat, idx) => (
          <ProfitLossStatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            isLoading={isLoading}
          />
        ))}
      </div>

      <div className="hidden md:flex lg:hidden flex-wrap gap-4">
        {stats.map((stat, idx) => (
          <ProfitLossStatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            isLoading={isLoading}
            className="w-[calc(33.333%-11px)]"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:hidden">
        {stats.map((stat, idx) => (
          <ProfitLossStatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            isLoading={isLoading}
            className="h-[100px]"
          />
        ))}
      </div>
    </div>
  );
}
