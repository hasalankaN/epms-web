"use client";

import React, { useState } from "react";
import {
  Clock,
  CalendarCheck,
  AlertTriangle,
  UserX,
  Bell,
  Download,
  Filter,
  Search,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { NotifyAttendanceModal } from "./NotifyAttendanceModal";
import {
  useTeamAttendanceQuery,
  useOvertimeRecordsQuery,
} from "@/hooks/api/attendance/useAttendance";
import { toast } from "sonner";
import type { AttendanceRecord, OvertimeRecord } from "@/types/dto/attendance.dto";

export function HrAttendanceView() {
  const [activeTab, setActiveTab] = useState<"daily" | "summary" | "overtime">("daily");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedRecords, setSelectedRecords] = useState<AttendanceRecord[]>([]);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);

  const { data: attendanceData, isLoading } = useTeamAttendanceQuery({
    search,
    status: statusFilter,
  });
  const { data: overtimeRecords = [] } = useOvertimeRecordsQuery();

  const attendanceList = attendanceData?.items || [];

  const handleSelectRecord = (record: AttendanceRecord) => {
    if (selectedRecords.find((r) => r.id === record.id)) {
      setSelectedRecords(selectedRecords.filter((r) => r.id !== record.id));
    } else {
      setSelectedRecords([...selectedRecords, record]);
    }
  };

  const dailyColumns: Column<AttendanceRecord>[] = [
    {
      header: (
        <input
          type="checkbox"
          checked={selectedRecords.length > 0 && selectedRecords.length === attendanceList.length}
          onChange={(e) => {
            if (e.target.checked) setSelectedRecords([...attendanceList]);
            else setSelectedRecords([]);
          }}
          className="rounded border-slate-300 text-pink-600 focus:ring-pink-500"
        />
      ),
      cell: (item) => (
        <input
          type="checkbox"
          checked={!!selectedRecords.find((r) => r.id === item.id)}
          onChange={() => handleSelectRecord(item)}
          className="rounded border-slate-300 text-pink-600 focus:ring-pink-500"
        />
      ),
    },
    {
      header: "Employee",
      cell: (item) => (
        <div>
          <p className="font-bold text-xs text-slate-900 dark:text-white">{item.employeeName}</p>
          <p className="text-[11px] text-slate-400">{item.employeeCode} · {item.departmentName || "Technology"}</p>
        </div>
      ),
    },
    {
      header: "Date",
      cell: (item) => <span className="text-xs font-semibold">{item.date} ({item.day})</span>,
    },
    {
      header: "Punch In",
      cell: (item) => <span className="font-mono text-xs">{item.punchIn || "—"}</span>,
    },
    {
      header: "Punch Out",
      cell: (item) => <span className="font-mono text-xs">{item.punchOut || "—"}</span>,
    },
    {
      header: "Work Hours",
      cell: (item) => <span className="font-bold text-xs font-mono">{item.workHours}h</span>,
    },
    {
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
  ];

  const overtimeColumns: Column<OvertimeRecord>[] = [
    {
      header: "Employee",
      cell: (item) => (
        <div>
          <p className="font-bold text-xs text-slate-900 dark:text-white">{item.employeeName}</p>
          <p className="text-[11px] text-slate-400">{item.employeeCode} · {item.departmentName}</p>
        </div>
      ),
    },
    {
      header: "Billing Period",
      cell: (item) => <span className="text-xs font-medium">{item.period}</span>,
    },
    {
      header: "Regular Shift Hours",
      cell: (item) => <span className="font-mono text-xs">{item.regularHours}h</span>,
    },
    {
      header: "Overtime Hours",
      cell: (item) => (
        <span className="font-mono font-bold text-xs text-[#E60076]">
          +{item.overtimeHours}h
        </span>
      ),
    },
    {
      header: "Overtime Remuneration",
      cell: (item) => (
        <span className="font-mono font-bold text-xs text-emerald-600">
          LKR {item.overtimeAmount.toLocaleString("en-LK", { minimumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("daily")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "daily"
                ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Daily Biometric Logs</span>
          </button>
          <button
            onClick={() => setActiveTab("summary")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "summary"
                ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <CalendarCheck className="h-4 w-4" />
            <span>Individual Summary Heatmap</span>
          </button>
          <button
            onClick={() => setActiveTab("overtime")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "overtime"
                ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Overtime Register ({overtimeRecords.length})</span>
          </button>
        </div>

        {activeTab === "daily" && selectedRecords.length > 0 && (
          <Button
            size="sm"
            onClick={() => setIsNotifyModalOpen(true)}
            className="bg-[#E60076] hover:bg-[#d0006a] text-white text-xs gap-1.5 font-semibold"
          >
            <Bell className="h-3.5 w-3.5" /> Notify Selected ({selectedRecords.length})
          </Button>
        )}

        {activeTab === "overtime" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Exporting Overtime CSV report...")}
            className="text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" /> Export Overtime CSV
          </Button>
        )}
      </div>

      {/* Tab 1: Daily Log */}
      {activeTab === "daily" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, employee code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-pink-500"
              >
                <option value="ALL">All Status</option>
                <option value="PRESENT">Present</option>
                <option value="LATE">Late Arrivals</option>
                <option value="EARLY_DEPARTURE">Early Exits</option>
                <option value="ABSENT">Absent</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
            <DataTable
              data={attendanceList}
              columns={dailyColumns}
              keyExtractor={(item) => item.id}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Individual Summary Heatmap */}
      {activeTab === "summary" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Monthly Attendance Breakdown & Heatmap
              </h3>
              <p className="text-xs text-slate-500">Employee: Nuwan Perera (EMP-1042) · October 2026</p>
            </div>
            <select className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold">
              <option value="emp-1042">Nuwan Perera (Technology)</option>
              <option value="emp-1015">Dilani Wickramasinghe (Technology)</option>
              <option value="emp-1022">Kasun Jayasuriya (Technology)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl">
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Present Days</span>
              <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mt-1">21 days</p>
            </div>
            <div className="p-3 bg-amber-50/60 dark:bg-amber-950/20 rounded-xl">
              <span className="text-amber-700 dark:text-amber-400 font-medium">Late Check-ins</span>
              <p className="text-xl font-bold text-amber-800 dark:text-amber-300 mt-1">2 days</p>
            </div>
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl">
              <span className="text-blue-700 dark:text-blue-400 font-medium">Total Late Time</span>
              <p className="text-xl font-bold text-blue-800 dark:text-blue-300 mt-1">48 mins</p>
            </div>
            <div className="p-3 bg-rose-50/60 dark:bg-rose-950/20 rounded-xl">
              <span className="text-rose-700 dark:text-rose-400 font-medium">Absent Days</span>
              <p className="text-xl font-bold text-rose-800 dark:text-rose-300 mt-1">1 day</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-500 font-medium">Shift Hours</span>
              <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">154.5h</p>
            </div>
          </div>

          {/* Calendar Heatmap Grid for 31 days */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              October 2026 Shift Day Matrix
            </span>
            <div className="grid grid-cols-7 gap-2 pt-2">
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const isWeekend = day % 7 === 0 || day % 7 === 6;
                const isLate = day === 23 || day === 30;
                const isAbsent = day === 28;

                let bg = "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300";
                if (isWeekend) bg = "bg-slate-100 dark:bg-slate-800/40 text-slate-400 border-slate-200";
                else if (isAbsent) bg = "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300";
                else if (isLate) bg = "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300";

                return (
                  <div
                    key={day}
                    className={`h-14 rounded-lg p-1.5 border flex flex-col justify-between text-xs transition-all ${bg}`}
                  >
                    <span className="font-bold">{day}</span>
                    <span className="text-[10px] font-semibold">
                      {isWeekend ? "Off" : isAbsent ? "Absent" : isLate ? "Late" : "Present"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Overtime Register */}
      {activeTab === "overtime" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <DataTable
            data={overtimeRecords}
            columns={overtimeColumns}
            keyExtractor={(item) => item.id}
          />
        </div>
      )}

      <NotifyAttendanceModal
        isOpen={isNotifyModalOpen}
        onClose={() => setIsNotifyModalOpen(false)}
        selectedRecords={selectedRecords}
      />
    </div>
  );
}

