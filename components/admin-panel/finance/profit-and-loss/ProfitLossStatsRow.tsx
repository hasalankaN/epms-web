"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { StatusPopover } from "@/components/common/StatusPopover";

interface ProfitLossStatCardProps {
  label: React.ReactNode;
  value: string;
  className?: string;
}

function ProfitLossStatCard({ label, value, className }: ProfitLossStatCardProps) {
  return (
    <div
      className={cn(
        "flex h-[120px] flex-1 flex-col items-start justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white p-3",
        className
      )}
    >
      <div className="font-inter text-[14px] font-normal leading-[20px] text-[#45556C]">
        {label}
      </div>
      <div className="font-inter text-[24px] font-semibold leading-[38px] text-[#1D293D]">
        {value}
      </div>
    </div>
  );
}

export function ProfitLossStatsRow() {
  const stats = [
    {
      label: "Total Income",
      value: "LKR XXX,XXX.00",
    },
    {
      label: "Total Expenses",
      value: "LKR X,XXX.00",
    },
    {
      label: (
        <StatusPopover
          value="Profited"
          options={[{ value: "Profited", bg: "#DFFFF0", text: "#16A34A" }]}
          readOnly
        />
      ),
      value: "+LKR X,XXX.00",
    },
  ];

  return (
    <div className="w-full">
      {/* Desktop (lg+): 3 columns flex row */}
      <div className="hidden items-center gap-4 lg:flex lg:flex-row lg:items-stretch">
        {stats.map((stat, idx) => (
          <ProfitLossStatCard key={idx} label={stat.label} value={stat.value} />
        ))}
      </div>

      {/* Tablet (md to lg): 3 columns flex-wrap */}
      <div className="hidden md:flex lg:hidden flex-wrap gap-4">
        {stats.map((stat, idx) => (
          <ProfitLossStatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            className="w-[calc(33.333%-11px)]"
          />
        ))}
      </div>

      {/* Mobile (<md): 1 column (3 rows) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {stats.map((stat, idx) => (
          <ProfitLossStatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            className="h-[100px]"
          />
        ))}
      </div>
    </div>
  );
}
