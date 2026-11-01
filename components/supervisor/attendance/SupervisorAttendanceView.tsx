"use client";

import React, { useState } from "react";
import { Clock, CheckCircle2, AlertTriangle, UserX, Search, Filter, Edit } from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EditAttendanceRecordModal } from "./EditAttendanceRecordModal";
import { useTeamAttendanceQuery } from "@/hooks/api/attendance/useAttendance";
import type { AttendanceRecord } from "@/types/dto/attendance.dto";

export function SupervisorAttendanceView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: attendanceData, isLoading, isError } = useTeamAttendanceQuery({
    page,
    pageSize: 10,
    search,
    status: statusFilter,
  });

  const list = attendanceData?.items || [];
  const presentCount = list.filter((a) => a.status === "PRESENT").length;
  const lateCount = list.filter((a) => a.status === "LATE").length;
  const earlyCount = list.filter((a) => a.status === "EARLY_DEPARTURE").length;
  const absentCount = list.filter((a) => a.status === "ABSENT").length;

  const columns: Column<AttendanceRecord>[] = [
    {
      header: "Employee",
      cell: (item) => (
        <div>
          <p className="font-bold text-xs text-slate-900 dark:text-white">{item.employeeName}</p>
          <p className="text-[11px] text-slate-400">{item.employeeCode}</p>
        </div>
      ),
    },
    {
      header: "Date",
      cell: (item) => (
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {item.date} ({item.day})
        </span>
      ),
    },
    {
      header: "Punch In",
      cell: (item) => <span className="text-xs font-mono">{item.punchIn || "—"}</span>,
    },
    {
      header: "Punch Out",
      cell: (item) => <span className="text-xs font-mono">{item.punchOut || "—"}</span>,
    },
    {
      header: "Work Hours",
      cell: (item) => <span className="text-xs font-bold font-mono">{item.workHours}h</span>,
    },
    {
      header: "Flags & Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Action",
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedRecord(item);
            setIsEditModalOpen(true);
          }}
          className="h-7 text-xs gap-1"
        >
          <Edit className="h-3 w-3" /> Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Present Members" value={presentCount} icon={CheckCircle2} subText="On-time shifts" />
        <StatCard label="Late Check-ins" value={lateCount} icon={Clock} subText="Logged past 08:45" />
        <StatCard label="Early Exits" value={earlyCount} icon={AlertTriangle} subText="Left before 17:00" />
        <StatCard label="Absences" value={absentCount} icon={UserX} subText="Unplanned days off" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search member by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {["ALL", "PRESENT", "LATE", "EARLY_DEPARTURE", "ABSENT"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                statusFilter === st
                  ? "bg-[#E60076] text-white shadow-sm font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "All Shifts" : st.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
        <DataTable
          data={list}
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

      <EditAttendanceRecordModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord}
      />
    </div>
  );
}

