"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface ReferralStatCardProps {
  title: string;
  value: string;
  className?: string;
}

export function ReferralStatCard({
  title,
  value,
  className,
}: ReferralStatCardProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-1 px-4", className)}>
      {/* Title */}
      <span className="text-center font-sans text-[14px] font-normal leading-[20px] text-[#314158]">
        {title}
      </span>
      {/* Value */}
      <span className="text-center font-sans text-[18px] font-semibold leading-[30px] text-[#020618]">
        {value}
      </span>
    </div>
  );
}
