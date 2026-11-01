"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Clock,
  Filter,
  Search,
  Settings,
  Download,
  AlertTriangle,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { SpecialLeaveModal } from "./SpecialLeaveModal";
import { AdjustBalanceModal } from "./AdjustBalanceModal";
import { EditPolicyModal } from "./EditPolicyModal";
import {
  useSupervisorLeavesQuery,
  useDecideLeaveMutation,
  useLeavePoliciesQuery,
} from "@/hooks/api/leaves/useLeaves";
import type { LeaveApplication, LeavePolicy } from "@/types/dto/leave.dto";
import { toast } from "sonner";

export function HrLeaveView() {
  const [activeTab, setActiveTab] = useState<"requests" | "balances" | "policies" | "report">("requests");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals state
  const [isSpecialOpen, setIsSpecialOpen] = useState(false);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedEmpForAdjust, setSelectedEmpForAdjust] = useState<any>(null);
  const [editingPolicy, setEditingPolicy] = useState<LeavePolicy | null>(null);

  // Queries
  const { data: leavesData, isLoading: isLeavesLoading } = useSupervisorLeavesQuery({
    search,
    status: statusFilter,
  });
  const { data: policies = [], isLoading: isPoliciesLoading } = useLeavePoliciesQuery();

  const decideMutation = useDecideLeaveMutation();

  const requestsList = leavesData?.items || [];

  const handleApprove = (id: string) => {
    decideMutation.mutate({
      id,
      decision: "APPROVED",
      comment: "Approved by HR Department.",
    });
  };

  const handleReject = (id: string) => {
    const reason = prompt("Enter reason for rejection:") || "Rejected per company leave quota rules.";
    decideMutation.mutate({
      id,
      decision: "REJECTED",
      comment: reason,
    });
  };

  // Mock employee balances table data
  const employeeBalances = [
    { id: "EMP-001", name: "Kavinda Perera", dept: "Production", annual: 10, casual: 4, medical: 6, special: 0 },
    { id: "EMP-002", name: "Nuwan Disanayake", dept: "Quality Assurance", annual: 12, casual: 5, medical: 7, special: 2 },
    { id: "EMP-003", name: "Sanduni Jayawardena", dept: "Cutting & Sewing", annual: 8, casual: 2, medical: 5, special: 0 },
    { id: "EMP-004", name: "Thilina Fernando", dept: "Maintenance", annual: 14, casual: 6, medical: 7, special: 0 },
    { id: "EMP-005", name: "Dilani Silva", dept: "Warehouse & Logistics", annual: 6, casual: 3, medical: 4, special: 1 },
    { id: "EMP-006", name: "Roshan Alwis", dept: "Human Resources", annual: 14, casual: 7, medical: 7, special: 0 },
  ];

  const requestColumns: Column<LeaveApplication>[] = [
    {
      header: "Employee",
      accessorKey: "employeeName",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.employeeName}</p>
          <p className="text-xs text-muted-foreground">{item.employeeCode} • {item.departmentName || "Factory Ops"}</p>
        </div>
      ),
    },
    {
      header: "Leave Type",
      accessorKey: "type",
      cell: (item) => <span className="font-medium text-sm">{item.type}</span>,
    },
    {
      header: "Dates & Duration",
      accessorKey: "fromDate",
      cell: (item) => (
        <div>
          <p className="text-sm font-medium">{item.fromDate} to {item.toDate}</p>
          <p className="text-xs text-muted-foreground">{item.days} {item.days === 1 ? "day" : "days"}</p>
        </div>
      ),
    },
    {
      header: "Reason",
      accessorKey: "reason",
      cell: (item) => (
        <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]" title={item.reason}>
          {item.reason}
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (item) => {
        if (item.status === "PENDING" || item.status === "ESCALATED") {
          return (
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                onClick={() => handleApprove(item.id)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-destructive hover:bg-destructive/10"
                onClick={() => handleReject(item.id)}
              >
                Reject
              </Button>
            </div>
          );
        }
        return <span className="text-xs text-muted-foreground italic">Processed</span>;
      },
    },
  ];

  const balanceColumns: Column<typeof employeeBalances[0]>[] = [
    {
      header: "Employee",
      accessorKey: "name",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.id} • {item.dept}</p>
        </div>
      ),
    },
    {
      header: "Annual (Rem / Total)",
      accessorKey: "annual",
      cell: (item) => <span className="font-medium text-sm">{item.annual} / 14</span>,
    },
    {
      header: "Casual (Rem / Total)",
      accessorKey: "casual",
      cell: (item) => <span className="font-medium text-sm">{item.casual} / 7</span>,
    },
    {
      header: "Medical (Rem / Total)",
      accessorKey: "medical",
      cell: (item) => <span className="font-medium text-sm">{item.medical} / 7</span>,
    },
    {
      header: "Special Leave",
      accessorKey: "special",
      cell: (item) => (
        <span className="font-medium text-sm text-[#E60076]">
          {item.special > 0 ? `${item.special} days` : "—"}
        </span>
      ),
    },
    {
      header: "Action",
      accessorKey: "id",
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs"
          onClick={() => {
            setSelectedEmpForAdjust({ id: item.id, name: item.name, code: item.id });
            setIsAdjustOpen(true);
          }}
        >
          Adjust Balance
        </Button>
      ),
    },
  ];

  const policyColumns: Column<LeavePolicy>[] = [
    {
      header: "Leave Category",
      accessorKey: "label",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.label}</p>
          <p className="text-xs text-muted-foreground">{item.leaveType}</p>
        </div>
      ),
    },
    {
      header: "Annual Quota",
      accessorKey: "daysPerYear",
      cell: (item) => <span className="font-semibold text-sm">{item.daysPerYear} days</span>,
    },
    {
      header: "Carry Forward",
      accessorKey: "carryForward",
      cell: (item) => (
        <div>
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${item.carryForward ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
            {item.carryForward ? `Yes (Max ${item.maxCarryForwardDays}d)` : "No"}
          </span>
        </div>
      ),
    },
    {
      header: "Policy Description",
      accessorKey: "rulesDescription",
      cell: (item) => <p className="text-xs text-muted-foreground max-w-sm line-clamp-2">{item.rulesDescription}</p>,
    },
    {
      header: "Action",
      accessorKey: "id",
      cell: (item) => (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-xs text-[#E60076]"
          onClick={() => setEditingPolicy(item)}
        >
          <Settings className="w-3.5 h-3.5 mr-1" />
          Edit Rules
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Leave Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor organizational leave applications, employee balances, quotas and policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              setSelectedEmpForAdjust(null);
              setIsAdjustOpen(true);
            }}
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
            Adjust Quota
          </Button>
          <Button
            className="bg-[#E60076] hover:bg-[#c40064] text-white gap-2"
            onClick={() => setIsSpecialOpen(true)}
          >
            <PlusCircle className="w-4 h-4" />
            Grant Special Leave
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "requests"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Leave Applications ({requestsList.length})
        </button>
        <button
          onClick={() => setActiveTab("balances")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "balances"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Employee Quotas & Balances
        </button>
        <button
          onClick={() => setActiveTab("policies")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "policies"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Leave Policies & Rules ({policies.length})
        </button>
        <button
          onClick={() => setActiveTab("report")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "report"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Monthly Leave Analysis
        </button>
      </div>

      {/* Tab 1: Requests */}
      {activeTab === "requests" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by employee name or reason..."
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
              <option value="PENDING">Pending Only</option>
              <option value="ESCALATED">Escalated to HR</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={requestColumns}
              data={requestsList}
              isLoading={isLeavesLoading}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Balances */}
      {activeTab === "balances" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Showing active employee leave quotas for current year (2026).
            </p>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => toast.success("Exporting leave balances to CSV...")}
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
          </div>
          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={balanceColumns}
              data={employeeBalances}
              isLoading={false}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      )}

      {/* Tab 3: Policies */}
      {activeTab === "policies" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Define standard leave entitlement days and annual rollover criteria for factory employees.
            </p>
          </div>
          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={policyColumns}
              data={policies}
              isLoading={isPoliciesLoading}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      )}

      {/* Tab 4: Leave Report */}
      {activeTab === "report" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">Total Leave Days Taken</p>
              <p className="text-2xl font-bold mt-1 text-foreground">148 Days</p>
              <p className="text-xs text-muted-foreground mt-1">This current month across all departments</p>
            </div>
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">Most Common Category</p>
              <p className="text-2xl font-bold mt-1 text-[#E60076]">Medical Leave</p>
              <p className="text-xs text-muted-foreground mt-1">44% of all granted leaves</p>
            </div>
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">Avg Absenteeism Rate</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600">3.2%</p>
              <p className="text-xs text-muted-foreground mt-1">Within healthy factory threshold (&lt; 5%)</p>
            </div>
            <div className="p-4 rounded-xl border bg-card shadow-sm">
              <p className="text-xs font-medium text-muted-foreground">Special Leaves Active</p>
              <p className="text-2xl font-bold mt-1 text-foreground">3 Granted</p>
              <p className="text-xs text-muted-foreground mt-1">Authorized by HR Department</p>
            </div>
          </div>

          <div className="p-6 rounded-xl border bg-card shadow-sm space-y-4">
            <h3 className="text-base font-semibold text-foreground">Department-Wise Absenteeism</h3>
            <div className="space-y-3">
              {[
                { dept: "Production Line A & B", pct: 4.1, days: 54 },
                { dept: "Cutting & Sewing", pct: 3.5, days: 42 },
                { dept: "Quality Assurance", pct: 2.1, days: 18 },
                { dept: "Warehouse & Logistics", pct: 2.8, days: 22 },
                { dept: "Maintenance & Engineering", pct: 1.4, days: 12 },
              ].map((item) => (
                <div key={item.dept} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>{item.dept}</span>
                    <span className="text-muted-foreground">{item.days} days ({item.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div
                      className="bg-[#E60076] h-2 rounded-full"
                      style={{ width: `${item.pct * 15}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <SpecialLeaveModal
        open={isSpecialOpen}
        onOpenChange={setIsSpecialOpen}
      />

      <AdjustBalanceModal
        open={isAdjustOpen}
        onOpenChange={setIsAdjustOpen}
        defaultEmployee={selectedEmpForAdjust}
      />

      <EditPolicyModal
        open={Boolean(editingPolicy)}
        onOpenChange={(open) => !open && setEditingPolicy(null)}
        policy={editingPolicy}
      />
    </div>
  );
}

