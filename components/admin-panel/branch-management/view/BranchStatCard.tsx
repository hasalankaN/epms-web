import React from "react";

interface BranchStatCardProps {
  label: string;
  value: string | number;
}

export function BranchStatCard({ label, value }: BranchStatCardProps) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border border-[#E2E8F0] p-3 flex-1 flex-shrink-0 self-stretch">
      <span className="text-sm font-normal leading-5 text-[#45556C] font-inter">
        {label}
      </span>
      <span className="text-2xl font-semibold leading-[38px] text-[#1D293D] font-inter">
        {value}
      </span>
    </div>
  );
}
