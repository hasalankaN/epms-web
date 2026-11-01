import React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subText?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  subText,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4 shadow-sm hover:shadow transition-shadow",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {value}
        </h3>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trend.isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-rose-600 dark:text-rose-400"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>
      {subText && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {subText}
        </p>
      )}
    </div>
  );
}

