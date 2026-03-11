"use client";

import React from "react";

import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";

interface CertificateStats {
  completed: number;
  issued: number;
  downloaded: number;
  pending: number;
}

interface CertificatesProgressProps {
  stats?: CertificateStats;
  className?: string;
}

const defaultStats: CertificateStats = {
  completed: 8935,
  issued: 136,
  downloaded: 8882,
  pending: 21226,
};

export function CertificatesProgress({
  stats = defaultStats,
  className,
}: CertificatesProgressProps) {
  const total = stats.completed + stats.issued + stats.downloaded + stats.pending;
  
  const percentages = {
    completed: (stats.completed / total) * 100,
    issued: (stats.issued / total) * 100,
    downloaded: (stats.downloaded / total) * 100,
    pending: (stats.pending / total) * 100,
  };

  return (
    <div
      className={cn(
        "flex w-full flex-col items-end gap-4 rounded-[8px] border border-[#E2E8F0] bg-transparent px-4 py-4 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] md:gap-6 md:py-6",
        className
      )}
    >
      {/* Title and Legend Row */}
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-0">
        <h3 className="font-sans text-[14px] font-semibold leading-[20px] text-[#0F172B] md:text-[16px] md:leading-[24px]">
          Certificates
        </h3>
        
        {/* Legend - Wraps on mobile, row on desktop */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 md:flex md:flex-wrap md:items-center md:gap-x-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 shrink-0 rounded bg-[#F59E0B]" />
            <span className="font-sans text-[11px] font-medium leading-[14px] text-[#62748E] md:text-[12px] md:leading-[16px]">
              Completed ({stats.completed.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 shrink-0 rounded bg-[#2563EB]" />
            <span className="font-sans text-[11px] font-medium leading-[14px] text-[#62748E] md:text-[12px] md:leading-[16px]">
              Issued ({stats.issued.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 shrink-0 rounded bg-[#16A34A]" />
            <span className="font-sans text-[11px] font-medium leading-[14px] text-[#62748E] md:text-[12px] md:leading-[16px]">
              Downloaded ({stats.downloaded.toLocaleString()})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 shrink-0 rounded bg-[#FB2C36]" />
            <span className="font-sans text-[11px] font-medium leading-[14px] text-[#62748E] md:text-[12px] md:leading-[16px]">
              Pending ({stats.pending.toLocaleString()})
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex h-2 w-full overflow-hidden rounded-full">
        <div
          className="bg-[#F59E0B] transition-all duration-300"
          style={{ width: `${percentages.completed}%` }}
        />
        <div
          className="bg-[#2563EB] transition-all duration-300"
          style={{ width: `${percentages.issued}%` }}
        />
        <div
          className="bg-[#16A34A] transition-all duration-300"
          style={{ width: `${percentages.downloaded}%` }}
        />
        <div
          className="bg-[#FB2C36] transition-all duration-300"
          style={{ width: `${percentages.pending}%` }}
        />
      </div>

      {/* Button */}
      <button className={cn(BUTTON_STYLES.outline.md, "w-full font-sans text-[13px] font-semibold leading-[18px] text-[#0F172B] md:w-auto md:text-[14px] md:leading-[20px]")}>
        Go to Certificate Section
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
