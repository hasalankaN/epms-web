"use client";

import React, { useState } from "react";
import { Plus, Calendar, CheckCircle2, Clock, XCircle, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { ApplyLeaveModal } from "./ApplyLeaveModal";
import {
  useLeaveBalancesQuery,
  useMyLeavesQuery,
  useCancelLeaveMutation,
} from "@/hooks/api/leaves/useLeaves";
import type { LeaveApplication } from "@/types/dto/leave.dto";

export function EmployeeLeaveView() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const { data: balances = [] } = useLeaveBalancesQuery();
  const { data: leavesData, isLoading, isError } = useMyLeavesQuery({
    page,
    pageSize: 10,
    status: statusFilter,
    leaveType: typeFilter,
  });

  const cancelMutation = useCancelLeaveMutation();

  const columns: Column<LeaveApplication>[] = [
    {
      header: "Applied On",
      cell: (item) => <span className="text-xs text-slate-500">{item.appliedOn}</span>,
    },
    {
      header: "Leave Type",
      cell: (item) => (
        <span className="font-semibold text-xs text-slate-900 dark:text-white">
          {item.type}
        </span>
      ),
    },
    {
      header: "Dates",
      cell: (item) => (
        <div className="text-xs">
          <p className="font-medium text-slate-800 dark:text-slate-200">
            {item.fromDate} → {item.toDate}
          </p>
          <span className="text-[11px] text-pink-600 dark:text-pink-400 font-semibold">
            {item.days} Day{item.days === 1 ? "" : "s"}
          </span>
        </div>
      ),
    },
    {
      header: "Reason & Notes",
      cell: (item) => (
        <div className="max-w-xs text-xs">
          <p className="text-slate-700 dark:text-slate-300 truncate" title={item.reason}>
            {item.reason}
          </p>
          {item.note && <p className="text-[10px] text-slate-400 italic">Note: {item.note}</p>}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Decision Comment",
      cell: (item) => (
        <span className="text-xs text-slate-500 max-w-xs truncate block" title={item.decisionComment}>
          {item.decisionComment || "—"}
        </span>
      ),
    },
    {
      header: "Action",
      cell: (item) =>
        item.status === "PENDING" ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => cancelMutation.mutate(item.id)}
            disabled={cancelMutation.isPending}
            className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:border-rose-300"
          >
            Cancel
          </Button>
        ) : (
          <span className="text-[11px] text-slate-400">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Leave Balance Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {balances.map((b) => {
          const usedPct = Math.min(100, Math.round((b.used / (b.total || 1)) * 100));
          return (
            <div
              key={b.type}
              className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-500">{b.label}</span>
                <span className="text-[10px] text-slate-400 font-medium">Quota: {b.total}</span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {b.remaining}
                </p>
                <p className="text-[11px] text-slate-400">Days Remaining</p>
              </div>
              {/* Progress bar */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#E60076] rounded-full transition-all"
                    style={{ width: `${usedPct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Used: {b.used}d</span>
                  {b.pending > 0 && <span className="text-amber-600 font-medium">Pending: {b.pending}d</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          {["ALL", "PENDING", "APPROVED", "REJECTED", "ESCALATED", "CANCELLED"].map((st) => (
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
              {st === "ALL" ? "All Requests" : st}
            </button>
          ))}
        </div>

        <Button
          onClick={() => setIsApplyModalOpen(true)}
          className="bg-[#E60076] hover:bg-[#d0006a] text-white gap-2 text-xs font-semibold self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Apply for Leave
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
        <DataTable
          data={leavesData?.items || []}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          isError={isError}
          pagination={{
            currentPage: leavesData?.page || 1,
            totalPages: leavesData?.totalPages || 1,
            totalCount: leavesData?.total || 0,
            onPageChange: (p) => setPage(p),
          }}
        />
      </div>

      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        balances={balances}
      />
    </div>
  );
}

