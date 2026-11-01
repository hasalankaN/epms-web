"use client";

import React, { useState } from "react";
import {
  Building2,
  Users,
  Briefcase,
  ArrowRightLeft,
  Network,
  Search,
  PlusCircle,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { TransferEmployeeModal } from "./TransferEmployeeModal";
import { useDepartmentsQuery } from "@/hooks/api/departments/useDepartments";

export function HrOrganizationView() {
  const [activeTab, setActiveTab] = useState<"departments" | "positions" | "transfers" | "hierarchy">("departments");
  const [search, setSearch] = useState("");
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const { data: deptData, isLoading: isDeptLoading } = useDepartmentsQuery({
    search,
  });

  const departments = deptData?.items || [
    { id: "1", name: "Production & Manufacturing", code: "DEPT-PROD", head: "Chandana Gunasekara", count: 48, location: "Main Plant Floor" },
    { id: "2", name: "Quality Assurance", code: "DEPT-QA", head: "Mahesh Wickramasinghe", count: 18, location: "Inspection Lab" },
    { id: "3", name: "Cutting & Sewing", code: "DEPT-SEW", head: "Kamal Rathnayake", count: 32, location: "East Wing Floor 2" },
    { id: "4", name: "Warehouse & Logistics", code: "DEPT-WHS", head: "Saman Ratnayake", count: 14, location: "Cargo Bay 1-4" },
    { id: "5", name: "Maintenance & Facility", code: "DEPT-MNT", head: "Sunil Shantha", count: 12, location: "Utility Building" },
    { id: "6", name: "Human Resources", code: "DEPT-HR", head: "Roshan Alwis", count: 6, location: "Admin Block Floor 3" },
  ];

  const positions = [
    { title: "Sewing Machine Operator", dept: "Cutting & Sewing", grade: "Grade B (LKR 45k - 65k)", count: 28, open: 4 },
    { title: "Senior Quality Auditor", dept: "Quality Assurance", grade: "Grade D (LKR 75k - 110k)", count: 6, open: 1 },
    { title: "Line Supervisor", dept: "Production", grade: "Grade E (LKR 95k - 140k)", count: 8, open: 2 },
    { title: "Forklift Operator", dept: "Warehouse & Logistics", grade: "Grade B (LKR 50k - 70k)", count: 5, open: 0 },
    { title: "Maintenance Technician", dept: "Maintenance & Facility", grade: "Grade C (LKR 60k - 85k)", count: 7, open: 1 },
  ];

  const transfers = [
    {
      id: "TR-001",
      employee: "Kavinda Perera (EMP-001)",
      fromDept: "Sewing Section",
      toDept: "Line 1 - Stitching",
      date: "2026-03-15",
      supervisor: "Chandana Gunasekara",
      reason: "Shift balancing for export sportswear line",
      status: "COMPLETED",
    },
    {
      id: "TR-002",
      employee: "Nuwan Disanayake (EMP-002)",
      fromDept: "General Assembly",
      toDept: "Quality Assurance Lab",
      date: "2026-02-01",
      supervisor: "Mahesh Wickramasinghe",
      reason: "Internal promotion to QA inspector",
      status: "COMPLETED",
    },
  ];

  const deptColumns: Column<any>[] = [
    {
      header: "Department",
      accessorKey: "name",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.code || "DEPT"} • {item.location || "Main Plant"}</p>
        </div>
      ),
    },
    {
      header: "Department Head",
      accessorKey: "head",
      cell: (item) => <span className="text-sm font-medium">{item.head || "Appointed Lead"}</span>,
    },
    {
      header: "Headcount",
      accessorKey: "count",
      cell: (item) => <span className="font-semibold text-sm">{item.count || 24} staff</span>,
    },
    {
      header: "Operational Status",
      accessorKey: "id",
      cell: () => (
        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          Active
        </span>
      ),
    },
  ];

  const posColumns: Column<typeof positions[0]>[] = [
    {
      header: "Designation / Title",
      accessorKey: "title",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.dept}</p>
        </div>
      ),
    },
    {
      header: "Pay Band / Grade",
      accessorKey: "grade",
      cell: (item) => <span className="text-xs font-medium text-muted-foreground">{item.grade}</span>,
    },
    {
      header: "Active Staff",
      accessorKey: "count",
      cell: (item) => <span className="font-medium text-sm">{item.count} employees</span>,
    },
    {
      header: "Open Headcount Vacancies",
      accessorKey: "open",
      cell: (item) => (
        item.open > 0 ? (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-pink-100 text-[#E60076] dark:bg-pink-950/40 dark:text-pink-300">
            {item.open} Openings
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Fully Staffed</span>
        )
      ),
    },
  ];

  const transferColumns: Column<typeof transfers[0]>[] = [
    {
      header: "Employee",
      accessorKey: "employee",
      cell: (item) => <span className="font-semibold text-foreground text-sm">{item.employee}</span>,
    },
    {
      header: "Movement",
      accessorKey: "fromDept",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-muted-foreground">{item.fromDept}</span>
          <span className="text-[#E60076] font-bold">→</span>
          <span className="font-medium text-foreground">{item.toDept}</span>
        </div>
      ),
    },
    {
      header: "Supervisor / Reporting",
      accessorKey: "supervisor",
      cell: (item) => <span className="text-xs font-medium">{item.supervisor}</span>,
    },
    {
      header: "Effective Date",
      accessorKey: "date",
      cell: (item) => <span className="text-xs text-muted-foreground">{item.date}</span>,
    },
    {
      header: "Reason",
      accessorKey: "reason",
      cell: (item) => <p className="text-xs text-muted-foreground max-w-xs line-clamp-1">{item.reason}</p>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Organization & Staff Allocation
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage factory departments, organizational hierarchy, salary grades, and internal transfers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="bg-[#E60076] hover:bg-[#c40064] text-white gap-2"
            onClick={() => setIsTransferModalOpen(true)}
          >
            <ArrowRightLeft className="w-4 h-4" />
            Transfer Employee
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("departments")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "departments"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Departments ({departments.length})
        </button>
        <button
          onClick={() => setActiveTab("positions")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "positions"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Positions & Pay Grades ({positions.length})
        </button>
        <button
          onClick={() => setActiveTab("transfers")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "transfers"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Internal Transfer History ({transfers.length})
        </button>
        <button
          onClick={() => setActiveTab("hierarchy")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "hierarchy"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Organizational Structure Tree
        </button>
      </div>

      {/* Tab 1: Departments */}
      {activeTab === "departments" && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={deptColumns}
              data={departments}
              isLoading={isDeptLoading}
              keyExtractor={(item) => String(item.id)}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Positions */}
      {activeTab === "positions" && (
        <div className="space-y-4">
          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={posColumns}
              data={positions}
              isLoading={false}
              keyExtractor={(item) => item.title}
            />
          </div>
        </div>
      )}

      {/* Tab 3: Transfers */}
      {activeTab === "transfers" && (
        <div className="space-y-4">
          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={transferColumns}
              data={transfers}
              isLoading={false}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      )}

      {/* Tab 4: Hierarchy */}
      {activeTab === "hierarchy" && (
        <div className="p-8 rounded-xl border bg-card shadow-sm space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Factory Management Tier</span>
            <div className="inline-block p-4 rounded-xl border-2 border-[#E60076] bg-[#E60076]/5 shadow-sm">
              <p className="font-bold text-base text-foreground">General Factory Manager</p>
              <p className="text-xs text-muted-foreground">Executive Board Directorate</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">
            <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
              <div className="border-b pb-2">
                <span className="text-xs font-semibold text-[#E60076]">Head of Production</span>
                <p className="text-sm font-bold text-foreground">Chandana Gunasekara</p>
              </div>
              <ul className="text-xs space-y-1.5 text-muted-foreground pl-3 list-disc">
                <li>Stitching & Line Supervisors (4)</li>
                <li>Machine Technicians (8)</li>
                <li>Line Operators (48 workers)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
              <div className="border-b pb-2">
                <span className="text-xs font-semibold text-[#E60076]">Head of Quality Assurance</span>
                <p className="text-sm font-bold text-foreground">Mahesh Wickramasinghe</p>
              </div>
              <ul className="text-xs space-y-1.5 text-muted-foreground pl-3 list-disc">
                <li>QA Section Leads (2)</li>
                <li>In-line Inspectors (10)</li>
                <li>Finishing & Packing QA (6)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
              <div className="border-b pb-2">
                <span className="text-xs font-semibold text-[#E60076]">Head of Logistics & Supply</span>
                <p className="text-sm font-bold text-foreground">Saman Ratnayake</p>
              </div>
              <ul className="text-xs space-y-1.5 text-muted-foreground pl-3 list-disc">
                <li>Warehouse Dispatchers (3)</li>
                <li>Material Handlers (8)</li>
                <li>Inventory Clerks (3)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      <TransferEmployeeModal
        open={isTransferModalOpen}
        onOpenChange={setIsTransferModalOpen}
      />
    </div>
  );
}

