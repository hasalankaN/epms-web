"use client";

import React, { useState } from "react";
import {
  Building2,
  Briefcase,
  Search,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { useDepartmentsQuery } from "@/hooks/api/departments/useDepartments";
import { usePositionsQuery } from "@/hooks/api/positions/usePositions";
import type { DepartmentItem } from "@/types/dto/department.dto";
import type { PositionItem } from "@/types/dto/position.dto";

export function HrOrganizationView() {
  const [activeTab, setActiveTab] = useState<"departments" | "positions">("departments");

  // Departments query state
  const [deptSearch, setDeptSearch] = useState("");
  const [deptPage, setDeptPage] = useState(1);

  // Positions query state
  const [posSearch, setPosSearch] = useState("");
  const [posPage, setPosPage] = useState(1);

  const { data: deptData, isLoading: isDeptLoading } = useDepartmentsQuery({
    page: deptPage,
    pageSize: 10,
    search: deptSearch.trim() || undefined,
  });

  const { data: posData, isLoading: isPosLoading } = usePositionsQuery({
    page: posPage,
    pageSize: 10,
    search: posSearch.trim() || undefined,
  });

  const departments = deptData?.items || [];
  const positions = posData?.items || [];

  const deptColumns: Column<DepartmentItem>[] = [
    {
      header: "Department",
      accessorKey: "departmentName",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.departmentName}</p>
          <p className="text-xs text-muted-foreground">{item.location || "Main Plant"}</p>
        </div>
      ),
    },
    {
      header: "Location",
      accessorKey: "location",
      cell: (item) => <span className="text-sm font-medium">{item.location || "—"}</span>,
    },
    {
      header: "Contact / Phone",
      accessorKey: "deptPhone",
      cell: (item) => <span className="text-xs font-mono text-muted-foreground">{item.deptPhone || "—"}</span>,
    },
    {
      header: "Headcount",
      accessorKey: "employeeCount",
      cell: (item) => (
        <span className="font-semibold text-sm">
          {item.employeeCount !== undefined ? `${item.employeeCount} staff` : "—"}
        </span>
      ),
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

  const posColumns: Column<PositionItem>[] = [
    {
      header: "Position Code",
      accessorKey: "positionCode",
      cell: (item) => (
        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-pink-50 text-[#E60076] dark:bg-pink-950/40 dark:text-pink-300">
          {item.positionCode || "POS"}
        </span>
      ),
    },
    {
      header: "Designation / Position Title",
      accessorKey: "positionName",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground text-sm">{item.positionName}</p>
          {item.departmentName && (
            <p className="text-xs text-muted-foreground">{item.departmentName}</p>
          )}
        </div>
      ),
    },
    {
      header: "Role Description",
      accessorKey: "description",
      cell: (item) => (
        <p className="text-xs text-muted-foreground max-w-md line-clamp-2" title={item.description}>
          {item.description || "—"}
        </p>
      ),
    },
    {
      header: "Effective Date",
      accessorKey: "effectiveDate",
      cell: (item) => (
        <span className="text-xs text-muted-foreground">
          {item.effectiveDate || "—"}
        </span>
      ),
    },
    {
      header: "Created Date",
      accessorKey: "createdAt",
      cell: (item) => (
        <span className="text-xs text-muted-foreground">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Organization & Positions
          </h1>
          <p className="text-sm text-muted-foreground">
            Overview of company departments and designated organizational job positions.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("departments")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "departments"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Departments ({deptData?.total ?? departments.length})
        </button>
        <button
          onClick={() => setActiveTab("positions")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "positions"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          Positions & Roles ({posData?.total ?? positions.length})
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
              value={deptSearch}
              onChange={(e) => {
                setDeptSearch(e.target.value);
                setDeptPage(1);
              }}
            />
          </div>
          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={deptColumns}
              data={departments}
              isLoading={isDeptLoading}
              keyExtractor={(item) => String(item.id || item.departmentName)}
              pagination={{
                variant: "simple",
                currentPage: deptPage,
                totalPages: deptData?.totalPages ?? 1,
                totalCount: deptData?.total ?? departments.length,
                itemsPerPage: 10,
                onPageChange: setDeptPage,
              }}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Positions */}
      {activeTab === "positions" && (
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search positions by code, title, or description..."
              className="pl-9"
              value={posSearch}
              onChange={(e) => {
                setPosSearch(e.target.value);
                setPosPage(1);
              }}
            />
          </div>
          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={posColumns}
              data={positions}
              isLoading={isPosLoading}
              keyExtractor={(item) => item.id || item.positionCode || item.positionName}
              pagination={{
                variant: "simple",
                currentPage: posPage,
                totalPages: posData?.totalPages ?? 1,
                totalCount: posData?.total ?? positions.length,
                itemsPerPage: 10,
                onPageChange: setPosPage,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
