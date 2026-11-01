"use client";

import React, { useState } from "react";
import { Calendar, Clock, Filter, Search, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { LeaveDecisionModal } from "./LeaveDecisionModal";
import { AdjustmentDecisionModal } from "./AdjustmentDecisionModal";
import { useSupervisorLeavesQuery } from "@/hooks/api/leaves/useLeaves";
import { useAdjustmentRequestsQuery } from "@/hooks/api/attendance/useAttendance";
import type { LeaveApplication } from "@/types/dto/leave.dto";
import type { AttendanceAdjustmentRequest } from "@/types/dto/attendance.dto";

export function SupervisorApprovalsView() {
  const [activeTab, setActiveTab] = useState<"leaves" | "adjustments">("leaves");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [search, setSearch] = useState("");

  const { data: leavesData, isLoading: isLeavesLoading } = useSupervisorLeavesQuery({
    status: statusFilter,
    search,
  });
  const { data: adjustments = [], isLoading: isAdjLoading } = useAdjustmentRequestsQuery();

  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const [selectedAdj, setSelectedAdj] = useState<AttendanceAdjustmentRequest | null>(null);
  const [isAdjModalOpen, setIsAdjModalOpen] = useState(false);

  const filteredAdjustments = adjustments.filter((a) => {
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
    const matchesSearch =
      !search ||
      a.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
      a.reason?.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const leaveColumns: Column<LeaveApplication>[] = [
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
      header: "Leave Type",
      cell: (item) => (
        <span className="font-semibold text-xs text-slate-900 dark:text-white">{item.type}</span>
      ),
    },
    {
      header: "Duration Dates",
      cell: (item) => (
        <div className="text-xs">
          <p className="font-medium text-slate-800 dark:text-slate-200">
            {item.fromDate} → {item.toDate}
          </p>
          <span className="text-[11px] text-pink-600 dark:text-pink-400 font-bold">
            {item.days} Day{item.days === 1 ? "" : "s"}
          </span>
        </div>
      ),
    },
    {
      header: "Reason",
      cell: (item) => (
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate" title={item.reason}>
          {item.reason}
        </p>
      ),
    },
    {
      header: "Balance After",
      cell: (item) => {
        const bal = item.balanceAfterApproval ?? 4;
        return (
          <span className={`text-xs font-bold ${bal < 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {bal} days
          </span>
        );
      },
    },
    {
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Action",
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedLeave(item);
            setIsLeaveModalOpen(true);
          }}
          className="h-7 text-xs font-semibold text-[#E60076] hover:bg-pink-50"
        >
          Review
        </Button>
      ),
    },
  ];

  const adjustmentColumns: Column<AttendanceAdjustmentRequest>[] = [
    {
      header: "Employee",
      cell: (item) => (
        <div>
          <p className="font-bold text-xs text-slate-900 dark:text-white">{item.employeeName}</p>
          <p className="text-[11px] text-slate-400">Shift Date: {item.date}</p>
        </div>
      ),
    },
    {
      header: "Recorded (In / Out)",
      cell: (item) => (
        <span className="font-mono text-xs text-slate-500">
          {item.currentPunchIn || "None"} - {item.currentPunchOut || "None"}
        </span>
      ),
    },
    {
      header: "Requested Times",
      cell: (item) => (
        <span className="font-mono text-xs font-bold text-pink-600 dark:text-pink-400">
          {item.requestedPunchIn} - {item.requestedPunchOut}
        </span>
      ),
    },
    {
      header: "Reason",
      cell: (item) => (
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate" title={item.reason}>
          {item.reason}
        </p>
      ),
    },
    {
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Action",
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedAdj(item);
            setIsAdjModalOpen(true);
          }}
          className="h-7 text-xs font-semibold text-[#E60076] hover:bg-pink-50"
        >
          Review
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("leaves")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "leaves"
                ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Leave Applications ({leavesData?.total || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab("adjustments")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "adjustments"
                ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Attendance Adjustments ({filteredAdjustments.length})</span>
          </button>
        </div>

        {/* Status Filter buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {["PENDING", "APPROVED", "REJECTED", "ESCALATED", "ALL"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                statusFilter === st
                  ? "bg-[#E60076] text-white shadow-sm font-semibold"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "All" : st}
            </button>
          ))}
        </div>
      </div>

      {/* Content Table */}
      {activeTab === "leaves" ? (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <DataTable
            data={leavesData?.items || []}
            columns={leaveColumns}
            keyExtractor={(item) => item.id}
            isLoading={isLeavesLoading}
          />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <DataTable
            data={filteredAdjustments}
            columns={adjustmentColumns}
            keyExtractor={(item) => item.id}
            isLoading={isAdjLoading}
          />
        </div>
      )}

      <LeaveDecisionModal
        isOpen={isLeaveModalOpen}
        onClose={() => {
          setIsLeaveModalOpen(false);
          setSelectedLeave(null);
        }}
        leave={selectedLeave}
      />

      <AdjustmentDecisionModal
        isOpen={isAdjModalOpen}
        onClose={() => {
          setIsAdjModalOpen(false);
          setSelectedAdj(null);
        }}
        adjustment={selectedAdj}
      />
    </div>
  );
}

