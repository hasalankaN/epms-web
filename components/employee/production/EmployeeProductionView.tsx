"use client";

import React, { useState } from "react";
import { Activity, Star, CheckCircle, Percent, Target, TrendingUp, Filter } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import {
  useMyProductionQuery,
  useProductionStatsQuery,
} from "@/hooks/api/production/useProduction";
import type { ProductionRecord } from "@/types/dto/production.dto";

export function EmployeeProductionView() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [projectFilter, setProjectFilter] = useState("ALL");

  const { data: stats } = useProductionStatsQuery();
  const { data: productionData, isLoading, isError } = useMyProductionQuery({
    page,
    pageSize: 10,
    approvalStatus: statusFilter,
    projectName: projectFilter,
  });

  const columns: Column<ProductionRecord>[] = [
    {
      header: "Date",
      cell: (item) => <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.date}</span>,
    },
    {
      header: "Project & Client",
      cell: (item) => (
        <div className="text-xs">
          <p className="font-bold text-slate-900 dark:text-white">{item.projectName}</p>
          <p className="text-[11px] text-slate-400">{item.clientName}</p>
        </div>
      ),
    },
    {
      header: "Expected",
      cell: (item) => <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.expectedUnits} units</span>,
    },
    {
      header: "Actual",
      cell: (item) => (
        <span className="text-xs font-bold text-slate-900 dark:text-white">
          {item.actualUnits} units
        </span>
      ),
    },
    {
      header: "Achievement %",
      cell: (item) => {
        const pct = item.achievementPercentage;
        let color = "bg-rose-500 text-rose-600";
        if (pct >= 100) color = "bg-emerald-500 text-emerald-600";
        else if (pct >= 80) color = "bg-amber-500 text-amber-600";

        return (
          <div className="w-28 space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span className={color.split(" ")[1]}>{pct}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${color.split(" ")[0]}`}
                style={{ width: `${Math.min(100, pct)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: "Rating",
      cell: (item) => (
        <div className="flex items-center gap-0.5 text-amber-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < item.rating ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      header: "Supervisor Comment",
      cell: (item) => (
        <span
          className="text-xs text-slate-500 max-w-xs truncate block"
          title={item.supervisorComment}
        >
          {item.supervisorComment || "—"}
        </span>
      ),
    },
    {
      header: "Approval",
      cell: (item) => <StatusBadge status={item.approvalStatus} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Average Rating"
            value={`${stats.avgRating} / 5.0`}
            icon={Star}
            subText="Based on supervisor reviews"
          />
          <StatCard
            label="Target Achievement"
            value={`${stats.targetAchievementPct}%`}
            icon={Target}
            subText="Expected vs actual output"
          />
          <StatCard
            label="Records This Month"
            value={stats.recordsThisMonth}
            icon={Activity}
            subText="Daily production logs"
          />
          <StatCard
            label="Approved Records"
            value={`${stats.approvedPct}%`}
            icon={CheckCircle}
            subText="Signed off by supervisor"
          />
        </div>
      )}

      {/* Visual Progress / Target Summary */}
      <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#E60076]" />
              Production Target vs Actual Performance (Weekly Overview)
            </h3>
            <p className="text-xs text-slate-500">
              Daily units completed across assigned client delivery projects.
            </p>
          </div>
        </div>

        {/* CSS-based Bar Chart Comparison */}
        <div className="grid grid-cols-5 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          {[
            { day: "Mon (Oct 27)", expected: 10, actual: 12, pct: 120 },
            { day: "Tue (Oct 28)", expected: 15, actual: 14, pct: 93 },
            { day: "Wed (Oct 29)", expected: 12, actual: 9, pct: 75 },
            { day: "Thu (Oct 30)", expected: 10, actual: 10, pct: 100 },
            { day: "Fri (Oct 31)", expected: 10, actual: 12, pct: 120 },
          ].map((bar, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-2">
              <div className="h-28 w-full bg-slate-50 dark:bg-slate-800 rounded-lg flex items-end justify-center p-2 gap-1.5">
                {/* Expected bar */}
                <div
                  className="w-1/3 bg-slate-300 dark:bg-slate-600 rounded-t transition-all"
                  style={{ height: `${(bar.expected / 15) * 100}%` }}
                  title={`Expected: ${bar.expected}`}
                />
                {/* Actual bar */}
                <div
                  className="w-1/3 bg-[#E60076] rounded-t transition-all"
                  style={{ height: `${(bar.actual / 15) * 100}%` }}
                  title={`Actual: ${bar.actual}`}
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-500 text-center">{bar.day}</span>
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{bar.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Approval Status:
          </span>
          {["ALL", "APPROVED", "PENDING", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                statusFilter === st
                  ? "bg-[#E60076] text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Production Records Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
        <DataTable
          data={productionData?.items || []}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          isError={isError}
          pagination={{
            currentPage: productionData?.page || 1,
            totalPages: productionData?.totalPages || 1,
            totalCount: productionData?.total || 0,
            onPageChange: (p) => setPage(p),
          }}
        />
      </div>
    </div>
  );
}

