"use client";

import React, { useState } from "react";

import { CalendarOff, ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { LeaveOverviewData } from "@/types/hrDashboard";

interface LeaveOverviewWidgetProps {
  data: LeaveOverviewData;
  onTrackBalances?: () => void;
}

export function LeaveOverviewWidget({
  data,
  onTrackBalances,
}: LeaveOverviewWidgetProps) {
  const [activeTab, setActiveTab] = useState<"TODAY" | "LOW_BALANCE">("TODAY");

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400">
              <CalendarOff className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Leave Overview & Balances
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Out-of-office roster & low quota balance alerts
              </p>
            </div>
          </div>

          {onTrackBalances && (
            <button
              type="button"
              onClick={onTrackBalances}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium inline-flex items-center gap-1"
            >
              <span>Balance Log</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg mt-3 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("TODAY")}
            className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all ${
              activeTab === "TODAY"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            On Leave Today ({data.onLeaveToday.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("LOW_BALANCE")}
            className={`flex-1 py-1.5 px-2 rounded-md font-medium transition-all ${
              activeTab === "LOW_BALANCE"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Low Balances ({data.lowBalanceEmployees.length})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="mt-3">
          {activeTab === "TODAY" ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.onLeaveToday.map((emp) => (
                <div
                  key={emp.id}
                  className="py-2.5 flex items-center justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
                >
                  <div>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {emp.employeeName}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {emp.department} • Returns: {emp.returnDate}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-normal border-orange-200 text-orange-700 dark:border-orange-900 dark:text-orange-300 bg-orange-50/50 dark:bg-orange-950/20"
                  >
                    {emp.leaveType}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.lowBalanceEmployees.map((emp) => (
                <div
                  key={emp.id}
                  className="py-2.5 space-y-1 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {emp.employeeName}
                    </span>
                    <Badge variant="destructive" className="text-[10px] py-0 px-1.5 font-normal">
                      Low Quota
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-400">
                    <span>{emp.department}</span>
                    <span>•</span>
                    <span>Annual: <strong>{emp.annualRemaining}</strong>d</span>
                    <span>•</span>
                    <span>Casual: <strong>{emp.casualRemaining}</strong>d</span>
                    <span>•</span>
                    <span>Med: <strong>{emp.medicalRemaining}</strong>d</span>
                  </div>
                  <p className="text-[10px] text-red-500 dark:text-red-400 italic">
                    {emp.alertReason}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mt-2">
        <span>Leave Quotas & Deductions</span>
        <span className="font-mono text-[10px] text-slate-500">Calendar Synced</span>
      </div>
    </div>
  );
}
