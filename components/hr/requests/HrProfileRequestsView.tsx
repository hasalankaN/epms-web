"use client";

import React, { useState } from "react";
import { Clock, Filter, Search, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { ProfileRequestReviewModal } from "./ProfileRequestReviewModal";
import { useProfileUpdateRequestsQuery } from "@/hooks/api/profile/useProfile";
import type { ProfileUpdateRequest } from "@/types/dto/profile.dto";

export function HrProfileRequestsView() {
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const { data: requests = [], isLoading } = useProfileUpdateRequestsQuery();

  const [selectedReq, setSelectedReq] = useState<ProfileUpdateRequest | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const filtered = requests.filter((r) => r.status === activeTab);

  const columns: Column<ProfileUpdateRequest>[] = [
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
      header: "Requested On",
      cell: (item) => <span className="text-xs text-slate-500">{item.requestedAt}</span>,
    },
    {
      header: "Modifications Summary",
      cell: (item) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{item.summary}</p>
          <span className="text-[11px] text-pink-600 font-bold">
            {item.changes?.length || 1} attribute{(item.changes?.length || 1) === 1 ? "" : "s"} modified
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Actions",
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedReq(item);
            setIsReviewModalOpen(true);
          }}
          className="h-7 text-xs font-semibold text-[#E60076] hover:bg-pink-50"
        >
          {item.status === "PENDING" ? "Review Diff" : "View Details"}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {(["PENDING", "APPROVED", "REJECTED"] as const).map((tab) => {
          const count = requests.filter((r) => r.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab ? "bg-pink-200/60 dark:bg-pink-900 text-pink-800" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests Table */}
      <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
        <DataTable
          data={filtered}
          columns={columns}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
        />
      </div>

      <ProfileRequestReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedReq(null);
        }}
        request={selectedReq}
      />
    </div>
  );
}

