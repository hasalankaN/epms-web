"use client";

import React, { useState } from "react";
import { Clock, CalendarCheck, AlertTriangle, UserX, Timer, Filter, RefreshCw } from "lucide-react";
import { AttendanceClockCard } from "./AttendanceClockCard";
import { AttendanceAdjustmentModal } from "./AttendanceAdjustmentModal";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  useMyAttendanceQuery,
  useAttendanceStatsQuery,
} from "@/hooks/api/attendance/useAttendance";
import type { AttendanceRecord } from "@/types/dto/attendance.dto";

export function EmployeeAttendanceView() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedRecordForAdj, setSelectedRecordForAdj] = useState<AttendanceRecord | null>(null);
  const [isAdjModalOpen, setIsAdjModalOpen] = useState(false);

  const { data: stats } = useAttendanceStatsQuery();
  const {
    data: attendanceData,
    isLoading,
    isError,
    refetch,
  } = useMyAttendanceQuery({
    page,
    pageSize: 10,
    status: statusFilter,
  });

  const columns: Column<AttendanceRecord>[] = [
    {
      header: "Date & Day",
      cell: (item) => (
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-200">{item.date}</p>
          <p className="text-[11px] text-slate-400">{item.day}</p>
        </div>
      ),
    },
    {
      header: "Punch In",
      cell: (item) => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
          {item.punchIn || "—"}
        </span>
      ),
    },
    {
      header: "Punch Out",
      cell: (item) => (
        <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
          {item.punchOut || "—"}
        </span>
      ),
    },
    {
      header: "Break (h)",
      cell: (item) => <span className="text-xs text-slate-500">{item.breakHours}h</span>,
    },
    {
      header: "Work Hours",
      cell: (item) => (
        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
          {item.workHours > 0 ? `${item.workHours.toFixed(2)}h` : "—"}
        </span>
      ),
    },
    {
      header: "Flags & Status",
      cell: (item) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <StatusBadge status={item.status} />
        </div>
      ),
    },
    {
      header: "Action",
      cell: (item) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedRecordForAdj(item);
            setIsAdjModalOpen(true);
          }}
          className="h-7 text-xs hover:border-[#E60076] hover:text-[#E60076]"
        >
          Request Adjustment
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Real-time Clock In / Out Card */}
      <AttendanceClockCard />

      {/* Stat Cards Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard
            label="Days Present"
            value={stats.daysPresent}
            icon={CalendarCheck}
            subText="This month"
          />
          <StatCard
            label="Late Arrivals"
            value={stats.lateArrivals}
            icon={Clock}
            subText="Grace period: 15m"
          />
          <StatCard
            label="Early Departures"
            value={stats.earlyDepartures}
            icon={AlertTriangle}
            subText="Recorded exits"
          />
          <StatCard
            label="Absent Days"
            value={stats.absentDays}
            icon={UserX}
            subText="Unplanned absences"
          />
          <StatCard
            label="Total Work Hours"
            value={`${stats.totalWorkHours}h`}
            icon={Timer}
            subText="Standard: 160h"
          />
        </div>
      )}

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Filter Status:
          </span>
          {["ALL", "PRESENT", "LATE", "EARLY_DEPARTURE", "ABSENT"].map((st) => (
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
              {st === "ALL" ? "All Shifts" : st.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="text-xs gap-1.5 self-end sm:self-auto"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Attendance Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
        <DataTable
          data={attendanceData?.items || []}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          isError={isError}
          pagination={{
            currentPage: attendanceData?.page || 1,
            totalPages: attendanceData?.totalPages || 1,
            totalCount: attendanceData?.total || 0,
            onPageChange: (p) => setPage(p),
          }}
        />
      </div>

      <AttendanceAdjustmentModal
        isOpen={isAdjModalOpen}
        onClose={() => {
          setIsAdjModalOpen(false);
          setSelectedRecordForAdj(null);
        }}
        record={selectedRecordForAdj}
      />
    </div>
  );
}

