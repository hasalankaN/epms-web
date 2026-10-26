import React from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, Briefcase, Award } from "lucide-react";

interface PositionBadgeProps {
  title: string;
}

export function PositionBadge({ title }: PositionBadgeProps) {
  const isLeadOrSenior =
    title.toLowerCase().includes("senior") ||
    title.toLowerCase().includes("lead") ||
    title.toLowerCase().includes("manager");

  return (
    <Badge
      variant="outline"
      className={`text-[11px] font-medium gap-1.5 py-0.5 px-2 rounded-full border ${
        isLeadOrSenior
          ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/50 dark:text-purple-300"
          : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
      }`}
    >
      {isLeadOrSenior ? (
        <Award className="h-3 w-3 shrink-0" />
      ) : (
        <Briefcase className="h-3 w-3 shrink-0" />
      )}
      <span>{title}</span>
    </Badge>
  );
}
