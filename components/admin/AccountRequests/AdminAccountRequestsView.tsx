"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { ReviewAccountRequestModal } from "./ReviewAccountRequestModal";
import { useAccountRequestsQuery } from "@/hooks/api/accountRequests/useAccountRequests";
import type { AccountRequestItem } from "@/types/dto/accountRequest.dto";

export function AdminAccountRequestsView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedRequest, setSelectedRequest] = useState<AccountRequestItem | null>(null);

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
      header: "Submitted Justification",
      accessorKey: "reason",
      cell: (item) => (
        <div className="max-w-xs space-y-0.5 text-xs">
          <p className="text-foreground line-clamp-1" title={item.reason}>{item.reason}</p>
          <p className="text-[11px] text-muted-foreground">Requested by {item.requestedBy} on {item.requestedAt}</p>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Action",
      accessorKey: "id",
      cell: (item) => {
        if (item.status === "PENDING") {
          return (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs text-[#E60076] gap-1"
              onClick={() => setSelectedRequest(item)}
            >
              Review
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          );
        }
        return <span className="text-xs text-muted-foreground italic">Completed</span>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Account Provisioning & Security Requests
        </h1>
        <p className="text-sm text-muted-foreground">
          Review user account requests, security privilege adjustments, and role offboarding requests submitted by HR.
        </p>
      </div>

      {/* Filters and Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by worker name, employee code, or justification..."
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

      {/* Review Modal */}
      <ReviewAccountRequestModal
        open={Boolean(selectedRequest)}
        onOpenChange={(open) => !open && setSelectedRequest(null)}
        request={selectedRequest}
      />
    </div>
  );
}

