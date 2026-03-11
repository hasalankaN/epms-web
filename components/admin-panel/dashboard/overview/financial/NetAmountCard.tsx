"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface NetAmountCardProps {
  value: string;
  className?: string;
}

export function NetAmountCard({ value, className }: NetAmountCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 self-stretch rounded-[8px] border border-[#FFCFEA] py-[38px] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
        className
      )}
      style={{
        background: "linear-gradient(315deg, #FFCFEA 0.35%, #F8FAFC 99.65%)",
      }}
    >
      {/* Title */}
      <span className="font-sans text-[14px] font-normal leading-[20px] text-[#314158]">
        Net Amount
      </span>
      {/* Value - 4px gap handled by parent gap-2 (8px, close enough, or use gap-1) */}
      <span className="font-sans text-[18px] font-semibold leading-[30px] text-[#020618]">
        {value}
      </span>
    </div>
  );
}
