"use client";

import React from "react";

import { Calendar, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HRDashboardHeaderProps {
  totalActionItems: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function HRDashboardHeader({
  totalActionItems,
  onRefresh,
  isRefreshing,
}: HRDashboardHeaderProps) {
  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            HR Operations Dashboard
          </h1>
          {totalActionItems > 0 && (
            <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold animate-pulse">
              {totalActionItems} Actions Pending
            </Badge>
          )}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
          <span>Enterprise workforce overview, approvals, attendance & compliance.</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700">
          <Calendar className="h-3.5 w-3.5 text-slate-500" />
          <span>{todayFormatted}</span>
        </div>

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8 gap-1.5 text-xs border-slate-200 dark:border-slate-800"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-slate-500 ${
                isRefreshing ? "animate-spin text-blue-600" : ""
              }`}
            />
            <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
