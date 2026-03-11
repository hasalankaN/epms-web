"use client";

import React from "react";

import { cn } from "@/lib/utils";

type BadgeVariant = "lessons" | "videos" | "materials";

interface CountBadgeProps {
  variant: BadgeVariant;
  count: number;

  /** Use dark mode styling (for expanded week header) */
  isDark?: boolean;
  className?: string;
}

const variantConfig: Record<BadgeVariant, { icon: React.ReactNode; label: string }> = {
  lessons: { icon: <i className="book-open-text h-3 w-3" />, label: "Lessons" },
  videos: { icon: <i className="video h-3 w-3" />, label: "Videos" },
  materials: { icon: <i className="books h-3 w-3" />, label: "Materials" },
};

export function CountBadge({ variant, count, isDark = false, className }: CountBadgeProps) {
  const { icon, label } = variantConfig[variant];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[4px] h-[20px] px-[8px] border rounded-[32px] text-[12px] font-medium leading-[16px] font-inter shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
        isDark
          ? "border-white/20 text-white bg-white/10"
          : "border-[#E2E8F0] text-[#62748E] bg-transparent",
        className
      )}
    >
      {icon}
      {count} {label}
    </span>
  );
}
