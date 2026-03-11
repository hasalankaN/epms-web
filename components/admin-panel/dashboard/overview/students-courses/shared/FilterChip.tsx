"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FilterChip({
  label,
  selected = false,
  onClick,
  className,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-[102px] flex-col items-center justify-center gap-[10px] rounded-[42px] px-[10px] py-2 font-sans text-[12px] font-medium leading-[16px] transition-all",
        selected
          ? "border-[0.5px] border-[#F6339A] bg-gradient-to-bl from-[#F8FAFC] to-[#FFCFEA] text-[#F6339A] shadow-[4px_4px_10px_0_rgba(2,17,36,0.05)]"
          : "border-[0.5px] border-[#E2E8F0] bg-transparent text-[#45556C]",
        className
      )}
    >
      {label}
    </button>
  );
}
