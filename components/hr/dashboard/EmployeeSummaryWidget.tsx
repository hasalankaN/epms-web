"use client";

import React from "react";

import { Users, UserPlus, ArrowUpRight } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import type { EmployeeSummaryData } from "@/types/hrDashboard";

interface EmployeeSummaryWidgetProps {
  data: EmployeeSummaryData;
  onViewDirectory?: () => void;
}

export function EmployeeSummaryWidget({
  data,
  onViewDirectory,
}: EmployeeSummaryWidgetProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Workforce & Department Summary
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Staff distribution, operational departments & new onboarding
              </p>
            </div>
          </div>

          {onViewDirectory && (
            <button
              type="button"
              onClick={onViewDirectory}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1"
            >
              <span>Directory</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Top metrics */}
        <div className="grid grid-cols-4 gap-2 mt-3.5">
          <div className="p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-center">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">
              Total Staff
            </span>
            <span className="text-xl font-bold text-indigo-950 dark:text-indigo-200 font-mono">
              {data.totalEmployees}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">
              Permanent
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
              {data.activeEmployees}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">
              Probation
            </span>
            <span className="text-xl font-bold text-amber-600 font-mono">
              {data.onProbation}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 block uppercase font-semibold">
              Contract
            </span>
            <span className="text-xl font-bold text-slate-700 dark:text-slate-300 font-mono">
              {data.contractEmployees}
            </span>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="mt-4 space-y-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Department Headcount Distribution
          </span>
          <div className="space-y-2">
            {data.departments.length === 0 ? (
              <p className="text-xs text-slate-400 py-1">No department staff records yet.</p>
            ) : (
              data.departments.map((dept, idx) => {
                const pct = data.totalEmployees > 0 ? Math.round((dept.count / data.totalEmployees) * 100) : 0;

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {dept.department}
                      </span>
                      <span className="font-mono text-slate-500">
                        {dept.count} ({pct}%)
                      </span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* New Joiners Spotlight */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5 text-emerald-600" />
              <span>New Joiners This Month ({data.newJoinersThisMonth.length})</span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {data.newJoinersThisMonth.map((joiner) => (
              <div
                key={joiner.id}
                className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center gap-2"
              >
                <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                  {joiner.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {joiner.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {joiner.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mt-3">
        <span>Workforce Operations & Distribution</span>
        <span className="font-mono text-[10px] text-slate-500">Live Department Metrics</span>
      </div>
    </div>
  );
}
