"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Calendar,
  Users,
  DollarSign,
  PlusCircle,
  Search,
  Filter,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { PlanTrainingModal } from "./PlanTrainingModal";
import { HrTrainingDetailDrawer } from "./HrTrainingDetailDrawer";
import { useHrTrainingsQuery } from "@/hooks/api/training/useTraining";
import type { TrainingItem } from "@/types/dto/training.dto";

export function HrTrainingView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<TrainingItem | null>(null);

  const { data: trainingData, isLoading } = useHrTrainingsQuery({
    search,
    status: statusFilter,
  });

  const trainings = trainingData?.items || [];

  const columns: Column<TrainingItem>[] = [
    {
      header: "Training Program",
      accessorKey: "name",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.venue} • {item.mode}</p>
        </div>
      ),
    },
    {
      header: "Date & Schedule",
      accessorKey: "date",
      cell: (item) => (
        <div>
          <p className="text-sm font-medium">{item.date}</p>
          <p className="text-xs text-muted-foreground">{item.startTime} - {item.endTime}</p>
        </div>
      ),
    },
    {
      header: "Instructors",
      accessorKey: "instructors",
      cell: (item) => (
        <span className="text-xs font-medium">{item.instructors?.join(", ") || "Trainer"}</span>
      ),
    },
    {
      header: "Budget Allocation",
      accessorKey: "budget",
      cell: (item) => (
        <span className="font-semibold text-sm text-[#E60076]">
          Rs. {item.budget ? item.budget.toLocaleString() : "45,000"}
        </span>
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
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          className="h-8 text-xs gap-1"
          onClick={() => setSelectedTraining(item)}
        >
          <Eye className="w-3.5 h-3.5" />
          Roster & Details
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
            Training & Capacity Building
          </h1>
          <p className="text-sm text-muted-foreground">
            Plan factory skill developments, manage training cohorts, upload materials, and review evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="bg-[#E60076] hover:bg-[#c40064] text-white gap-2"
            onClick={() => setIsPlanModalOpen(true)}
          >
            <PlusCircle className="w-4 h-4" />
            Plan Training Session
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Active Programs</p>
            <GraduationCap className="w-4 h-4 text-[#E60076]" />
          </div>
          <p className="text-2xl font-bold mt-2 text-foreground">{trainings.length} Sessions</p>
          <p className="text-xs text-muted-foreground mt-1">Across 4 departments</p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Enrolled Factory Workers</p>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold mt-2 text-foreground">64 Employees</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">94% average attendance rate</p>
        </div>

        <div className="p-4 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">Total Training Budget</p>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold mt-2 text-foreground">Rs. 385,000</p>
          <p className="text-xs text-muted-foreground mt-1">FY 2026 Skills Fund</p>
        </div>
      </div>

      {/* Filters and Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search training programs or trainers..."
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
            <option value="UPCOMING">Upcoming</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <DataTable
            columns={columns}
            data={trainings}
            isLoading={isLoading}
            keyExtractor={(item) => item.id}
          />
        </div>
      </div>

      {/* Modals */}
      <PlanTrainingModal
        open={isPlanModalOpen}
        onOpenChange={setIsPlanModalOpen}
      />

      <HrTrainingDetailDrawer
        open={Boolean(selectedTraining)}
        onOpenChange={(open) => !open && setSelectedTraining(null)}
        training={selectedTraining}
      />
    </div>
  );
}
