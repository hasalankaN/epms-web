"use client";

import React, { useState } from "react";
import {
  Activity,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Download,
  Filter,
  Search,
  Star,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { ProductionReportModal } from "./ProductionReportModal";
import {
  useSupervisorProductionQuery,
  useProductionStatsQuery,
} from "@/hooks/api/production/useProduction";
import type { ProductionRecord } from "@/types/dto/production.dto";

export function HrProductionView() {
  const [search, setSearch] = useState("");
  const [lineFilter, setLineFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isReportOpen, setIsReportOpen] = useState(false);

  const { data: productionData, isLoading } = useSupervisorProductionQuery({
    search,
    approvalStatus: statusFilter,
  });
  const { data: stats } = useProductionStatsQuery();

  const records = productionData?.items || [];

  const columns: Column<ProductionRecord>[] = [
    {
      header: "Employee",
      accessorKey: "employeeName",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.employeeName}</p>
          <p className="text-xs text-muted-foreground">
            {item.employeeCode || "EMP-001"} • {item.departmentName || "Line 1 - Stitching"}
          </p>
        </div>
      ),
    },
    {
      header: "Project / Product",
      accessorKey: "projectName",
      cell: (item) => (
        <div>
          <p className="text-sm font-medium">{item.projectName}</p>
          <p className="text-xs text-muted-foreground">Client: {item.clientName}</p>
        </div>
      ),
    },
    {
      header: "Expected vs Actual",
      accessorKey: "achievementPercentage",
      cell: (item) => (
        <div>
          <p className="text-sm font-semibold">
            {item.actualUnits} / {item.expectedUnits} units
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-16 bg-muted rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  item.achievementPercentage >= 100
                    ? "bg-emerald-500"
                    : item.achievementPercentage >= 80
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${Math.min(item.achievementPercentage, 100)}%` }}
              />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {item.achievementPercentage}%
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Supervisor Rating",
      accessorKey: "rating",
      cell: (item) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < item.rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
          <span className="text-xs font-semibold ml-1">{item.rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      header: "Supervisor Remarks",
      accessorKey: "supervisorComment",
      cell: (item) => (
        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]" title={item.supervisorComment}>
          {item.supervisorComment || "—"}
        </p>
      ),
    },
    {
      header: "Status",
      accessorKey: "approvalStatus",
      cell: (item) => <StatusBadge status={item.approvalStatus} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Production & Factory Efficiency
          </h1>
          <p className="text-sm text-muted-foreground">
            Track daily garment output, piece-rate target completion, line QA feedback and supervisor ratings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="bg-[#E60076] hover:bg-[#c40064] text-white gap-2"
            onClick={() => setIsReportOpen(true)}
          >
            <FileText className="w-4 h-4" />
            Generate Production Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Total Output (Month)</p>
            <Activity className="w-4 h-4 text-[#E60076]" />
          </div>
          <p className="text-2xl font-bold mt-2 text-foreground">
            {stats?.totalActual?.toLocaleString() || "18,450"} units
          </p>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            +8.2% compared to last month
          </p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Target Achievement Rate</p>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold mt-2 text-foreground">
            {stats?.targetAchievementPct || 98.4}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Target benchmark: &gt;95%
          </p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Avg Line Quality Rating</p>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-2xl font-bold mt-2 text-foreground">
            {stats?.avgRating || 4.6} / 5.0
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Based on 85 supervisor reviews
          </p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Defect / Rework Rate</p>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold mt-2 text-foreground">1.12%</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">
            Below maximum allowable tolerance (2.0%)
          </p>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by worker name, code, or project..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={lineFilter}
            onChange={(e) => setLineFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All Production Lines</option>
            <option value="Line A">Line A - Active Wear</option>
            <option value="Line B">Line B - Denim</option>
            <option value="Cutting">Cutting Section</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending Supervisor Review</option>
            <option value="REJECTED">Flagged / Rejected</option>
          </select>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <DataTable
            columns={columns}
            data={records}
            isLoading={isLoading}
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>

      {/* Report Modal */}
      <ProductionReportModal
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
      />
    </div>
  );
}
