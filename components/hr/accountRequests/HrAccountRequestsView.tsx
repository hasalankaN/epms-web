"use client";

import React, { useState } from "react";
import {
  UserCheck,
  ShieldCheck,
  PlusCircle,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { NewAccountRequestModal } from "./NewAccountRequestModal";
import { useAccountRequestsQuery } from "@/hooks/api/accountRequests/useAccountRequests";
import type { AccountRequestItem } from "@/types/dto/accountRequest.dto";

export function HrAccountRequestsView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: requests = [], isLoading } = useAccountRequestsQuery(statusFilter);

  const filteredRequests = requests.filter((r) => {
    if (!search) return true;
    return (
      r.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      r.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase())
    );
  });

  const columns: Column<AccountRequestItem>[] = [
    {
      header: "Employee",
      accessorKey: "employeeName",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.employeeName}</p>
          <p className="text-xs text-muted-foreground">{item.employeeCode} • {item.departmentName}</p>
        </div>
      ),
    },
    {
      header: "Request Type",
      accessorKey: "type",
      cell: (item) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-50 text-[#E60076] dark:bg-pink-950/40 dark:text-pink-300">
          {item.type.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Proposed System Role",
      accessorKey: "proposedRole",
      cell: (item) => (
        item.proposedRole ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted">
            {item.proposedRole}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )
      ),
    },
    {
      header: "Justification & Admin Feedback",
      accessorKey: "reason",
      cell: (item) => (
        <div className="max-w-xs space-y-0.5 text-xs">
          <p className="text-foreground line-clamp-1" title={item.reason}>{item.reason}</p>
          {item.adminComment && (
            <p className="text-[11px] text-muted-foreground italic line-clamp-1">
              Admin: {item.adminComment}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Requested Date",
      accessorKey: "requestedAt",
      cell: (item) => <span className="text-xs text-muted-foreground">{item.requestedAt}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Account & Role Requests
          </h1>
          <p className="text-sm text-muted-foreground">
            Request user account provisioning, role adjustments, and account offboarding from IT Administration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="bg-[#E60076] hover:bg-[#c40064] text-white gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle className="w-4 h-4" />
            New Account Request
          </Button>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by worker name, code, or justification..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Admin Review</option>
            <option value="APPROVED">Approved & Provisioned</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <DataTable
            columns={columns}
            data={filteredRequests}
            isLoading={isLoading}
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>

      {/* New Request Modal */}
      <NewAccountRequestModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}

