import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const norm = status?.toUpperCase() || "";

  let colorClasses = "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300";

  if (norm.includes("PENDING")) {
    colorClasses = "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-400";
  } else if (
    norm.includes("APPROVED") ||
    norm.includes("ACTIVE") ||
    norm.includes("DONE") ||
    norm.includes("PRESENT") ||
    norm.includes("COMPLETED") ||
    norm.includes("SELECTED")
  ) {
    colorClasses = "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400";
  } else if (
    norm.includes("REJECTED") ||
    norm.includes("CANCELLED") ||
    norm.includes("ABSENT") ||
    norm.includes("OVERDUE")
  ) {
    colorClasses = "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400";
  } else if (
    norm.includes("ESCALATED") ||
    norm.includes("IN_PROGRESS") ||
    norm.includes("LATE") ||
    norm.includes("INTERVIEW") ||
    norm.includes("SHORTLISTED")
  ) {
    colorClasses = "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400";
  } else if (
    norm.includes("DRAFT") ||
    norm.includes("INACTIVE") ||
    norm.includes("CLOSED") ||
    norm.includes("EARLY_DEPARTURE")
  ) {
    colorClasses = "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400";
  }

  const displayText = norm.replace(/_/g, " ");

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full border transition-colors",
        colorClasses,
        className
      )}
    >
      {displayText}
    </Badge>
  );
}

