"use client";

import React from "react";

import {
  CheckCircle2,
  Clock,
  UserX,
  LogOut,
  ArrowUpRight,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import type { TodayAttendanceSummary } from "@/types/hrDashboard";

interface TodayAttendanceWidgetProps {
  attendance: TodayAttendanceSummary;
  onViewDetails?: () => void;
}

export function TodayAttendanceWidget({
  attendance,
  onViewDetails,
}: TodayAttendanceWidgetProps) {
  const presentPct = Math.round(
    (attendance.present / attendance.totalEmployees) * 100
  );

  const latePct = Math.round(
    (attendance.late / attendance.totalEmployees) * 100
  );

  const absentPct = Math.round(
    (attendance.absent / attendance.totalEmployees) * 100
  );

  const earlyPct = Math.round(
    (attendance.earlyDeparture / attendance.totalEmployees) * 100
  );

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                Today’s Attendance Overview
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold">
                #33
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Real-time punch-ins for {attendance.totalEmployees} workforce members
            </p>
          </div>
        </div>

        {onViewDetails && (
          <button
            type="button"
            onClick={onViewDetails}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1"
          >
            <span>Full Logs</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {/* Present */}
        <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
              Present
            </span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
              {attendance.present}
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
              ({presentPct}%)
            </span>
          </div>
        </div>

        {/* Late Punch-ins */}
        <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-amber-800 dark:text-amber-300">
              Late Punch-ins
            </span>
            <Clock className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-amber-900 dark:text-amber-100">
              {attendance.late}
            </span>
            <span className="text-[11px] text-amber-700 dark:text-amber-400">
              ({latePct}%)
            </span>
          </div>
        </div>

        {/* Absent */}
        <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-red-800 dark:text-red-300">
              Absent
            </span>
            <UserX className="h-3.5 w-3.5 text-red-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-red-900 dark:text-red-100">
              {attendance.absent}
            </span>
            <span className="text-[11px] text-red-700 dark:text-red-400">
              ({absentPct}%)
            </span>
          </div>
        </div>

        {/* Early Departure */}
        <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-purple-800 dark:text-purple-300">
              Early Departure
            </span>
            <LogOut className="h-3.5 w-3.5 text-purple-600" />
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-purple-900 dark:text-purple-100">
              {attendance.earlyDeparture}
            </span>
            <span className="text-[11px] text-purple-700 dark:text-purple-400">
              ({earlyPct}%)
            </span>
          </div>
        </div>
      </div>

      {/* On-Time Rate Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Overall Punctuality Compliance Rate
          </span>
          <span className="font-bold text-slate-900 dark:text-white">
            {attendance.onTimeRate}%
          </span>
        </div>
        <Progress value={attendance.onTimeRate} className="h-2" />
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
          <span>Target: 95.0%</span>
          <span>Variance: -7.1% vs Monthly Average</span>
        </div>
      </div>
    </div>
  );
}
