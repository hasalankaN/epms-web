"use client";

import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";

export interface FilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export function FilterChip({ label, selected, onClick, className }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-[26px] items-center justify-center gap-1 rounded-md px-2 py-[2px] text-sm font-medium leading-5 transition-colors",
        selected
          ? "border border-[#020618] bg-[#020618] text-white hover:bg-[#0F172B]"
          : "border border-[#E2E8F0] bg-white text-[#314158] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]",
        className
      )}
    >
      {selected ? (
        <XCircle className="h-3.5 w-3.5" />
      ) : (
        <CheckCircle2 className="h-3.5 w-3.5 text-[#314158]" />
      )}
      {label}
    </button>
  );
}
