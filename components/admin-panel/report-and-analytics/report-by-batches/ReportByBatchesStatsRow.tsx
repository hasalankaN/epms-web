"use client";

import React from "react";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface ReportByBatchesStatItem {
  key: string;
  title: string;
  value: string | number;
  isActive?: boolean;
}

interface ReportByBatchesStatCardProps {
  title: string;
  value: string | number;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

function ReportByBatchesStatCard({ title, value, isActive, onClick, className }: ReportByBatchesStatCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex h-[72px] flex-1 flex-col items-center justify-center gap-1 rounded-lg border-2 transition-all duration-300 px-4 cursor-pointer hover:border-[#F6339A]/30 hover:bg-[#F8FAFC]",
        isActive
          ? "border-[#F6339A] shadow-sm"
          : "border-[#E2E8F0] bg-white",
        className
      )}
    >
      {/* Active Background Gradient */}
      {isActive && (
        <motion.div
          layoutId="report-batches-stat-bg"
          className="absolute inset-0 z-0 rounded-md bg-[linear-gradient(315deg,#FFCFEA_0.35%,#F8FAFC_99.65%)]"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 35,
          }}
        />
      )}

      {/* Label */}
      <span
        className={cn(
          "relative z-10 text-center font-inter text-[12px] font-normal leading-[16px] transition-colors duration-300",
          "text-[#314158]"
        )}
      >
        {title}
      </span>

      {/* Value */}
      <span
        className={cn(
          "relative z-10 text-center font-inter text-[14px] font-semibold leading-[20px] transition-colors duration-300",
          "text-[#314158]"
        )}
      >
        {value}
      </span>
    </button>
  );
}

interface ReportByBatchesStatsRowProps {
  stats: ReportByBatchesStatItem[];
  onCardClick: (key: string) => void;
}

export function ReportByBatchesStatsRow({ stats, onCardClick }: ReportByBatchesStatsRowProps) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-stretch gap-3">
        {stats.map((stat) => (
          <ReportByBatchesStatCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            isActive={stat.isActive}
            onClick={() => onCardClick(stat.key)}
            className="min-w-[140px] md:min-w-[160px]"
          />
        ))}
      </div>
    </div>
  );
}
