import React from "react";
import { UserRole } from "@/types/roles";
import { cn } from "@/lib/utils";

interface UserRoleBadgeProps {
  role: UserRole;
  className?: string;
}

const ROLE_STYLES: Record<UserRole, { label: string; className: string }> = {
  ADMIN: {
    label: "Admin",
    className:
      "bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
  },
  HR: {
    label: "HR Manager",
    className:
      "bg-pink-100 text-pink-700 border border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
  },
  SUPERVISOR: {
    label: "Supervisor",
    className:
      "bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
  EMPLOYEE: {
    label: "Employee",
    className:
      "bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  },
};

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  const style = ROLE_STYLES[role];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        style.className,
        className
      )}
    >
      {style.label}
    </span>
  );
}
