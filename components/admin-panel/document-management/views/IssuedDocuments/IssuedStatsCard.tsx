import React from "react";

import { cn } from "@/lib/utils";

interface IssuedStatsCardProps {
  totalIssued: number;
}

export function IssuedStatsCard({ totalIssued }: IssuedStatsCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-2 px-[48.5px] py-[38px] rounded-lg border border-[#E2E8F0] bg-white shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] w-fit"
      )}
    >
      <p className="text-[#475467] text-center font-inter text-[14px] font-normal leading-[20px] m-0">
        Total Number of Issued Documents
      </p>
      <p className="text-[#101828] text-center font-inter text-[24px] font-bold leading-[32px] m-0">
        {totalIssued === 0 || isNaN(totalIssued) ? "####" : totalIssued.toLocaleString()}
      </p>
    </div>
  );
}
