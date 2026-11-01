"use client";

import React, { useState } from "react";
import {
  Star,
  Calendar,
  Activity,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { SupervisorEvaluationModal } from "./SupervisorEvaluationModal";
import { ScheduleMeetingModal } from "./ScheduleMeetingModal";
import { ReviewProductionModal } from "./ReviewProductionModal";
import {
  useTeamSelfEvaluationsQuery,
  useEvaluationMeetingsQuery,
} from "@/hooks/api/performance/usePerformance";
import { useSupervisorProductionQuery } from "@/hooks/api/production/useProduction";
import type { SelfEvaluation, EvaluationMeeting } from "@/types/dto/performance.dto";
import type { ProductionRecord } from "@/types/dto/production.dto";

export function SupervisorKpisView() {
  const [activeTab, setActiveTab] = useState<"evaluations" | "meetings" | "production">("evaluations");

  const { data: evaluations = [] } = useTeamSelfEvaluationsQuery();
  const { data: meetings = [] } = useEvaluationMeetingsQuery();
  const { data: productionData } = useSupervisorProductionQuery();

  const [selectedEval, setSelectedEval] = useState<SelfEvaluation | null>(null);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);

  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  const [selectedProd, setSelectedProd] = useState<ProductionRecord | null>(null);
  const [isProdModalOpen, setIsProdModalOpen] = useState(false);

  const evalColumns: Column<SelfEvaluation>[] = [
    {
      header: "Team Member",
      cell: (item) => (
        <div>
          <p className="font-bold text-xs text-slate-900 dark:text-white">{item.employeeName}</p>
          <p className="text-[11px] text-slate-400">{item.departmentName}</p>
        </div>
      ),
    },
    {
      header: "Period Cycle",
      cell: (item) => <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.period}</span>,
    },
    {
      header: "Self Rating",
      cell: (item) => (
        <span className="font-bold text-xs text-amber-500">{item.overallRating} ★</span>
      ),
    },
    {
      header: "Supervisor Rating",
      cell: (item) => (
        <span className="font-bold text-xs text-pink-600">
          {item.supervisorRating ? `${item.supervisorRating} ★` : "Pending"}
        </span>
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
            setSelectedEval(item);
            setIsEvalModalOpen(true);
          }}
          className="h-7 text-xs font-semibold text-[#E60076] hover:bg-pink-50"
        >
          {item.status === "FINALIZED" ? "View Details" : "Conduct Appraisal"}
        </Button>
      ),
    },
  ];

  const meetingColumns: Column<EvaluationMeeting>[] = [
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
      header: "Date & Time",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
          <Clock className="h-3.5 w-3.5 text-pink-600" />
          <span>{item.dateTime}</span>
        </div>
      ),
    },
    {
      header: "Location",
      cell: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5 text-slate-400" />
          <span>{item.location}</span>
        </div>
      ),
    },
    {
      header: "Agenda Notes",
      cell: (item) => <p className="text-xs text-slate-500 max-w-xs truncate">{item.notes || "—"}</p>,
    },
    {
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
  ];

  const prodColumns: Column<ProductionRecord>[] = [
    {
      header: "Employee & Date",
      cell: (item) => (
        <div>
          <p className="font-bold text-xs text-slate-900 dark:text-white">{item.employeeName}</p>
          <p className="text-[11px] text-slate-400">{item.date}</p>
        </div>
      ),
    },
    {
      header: "Project",
      cell: (item) => (
        <div className="text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{item.projectName}</p>
          <p className="text-[10px] text-slate-400">{item.clientName}</p>
        </div>
      ),
    },
    {
      header: "Units (Target / Act)",
      cell: (item) => (
        <span className="text-xs font-bold font-mono">
          {item.actualUnits} / {item.expectedUnits}
        </span>
      ),
    },
    {
      header: "Achievement",
      cell: (item) => (
        <span className="text-xs font-bold text-emerald-600">{item.achievementPercentage}%</span>
      ),
    },
    {
      header: "Status",
      cell: (item) => <StatusBadge status={item.approvalStatus} />,
    },
    {
      header: "Action",
      cell: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedProd(item);
            setIsProdModalOpen(true);
          }}
          className="h-7 text-xs"
        >
          Review Output
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
            onClick={() => setActiveTab("evaluations")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "evaluations"
                ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Star className="h-4 w-4" />
            <span>Quarterly Appraisals ({evaluations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("meetings")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "meetings"
                ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Appraisal Meetings ({meetings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("production")}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === "production"
                ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Production Authorizations</span>
          </button>
        </div>

        {activeTab === "meetings" && (
          <Button
            size="sm"
            onClick={() => setIsMeetingModalOpen(true)}
            className="bg-[#E60076] hover:bg-[#d0006a] text-white text-xs gap-1.5 self-start sm:self-auto font-semibold"
          >
            <Plus className="h-3.5 w-3.5" /> Schedule Appraisal Meeting
          </Button>
        )}
      </div>

      {/* Tab 1: Evaluations */}
      {activeTab === "evaluations" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <DataTable
            data={evaluations}
            columns={evalColumns}
            keyExtractor={(item) => item.id}
          />
        </div>
      )}

      {/* Tab 2: Meetings */}
      {activeTab === "meetings" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <DataTable
            data={meetings}
            columns={meetingColumns}
            keyExtractor={(item) => item.id}
          />
        </div>
      )}

      {/* Tab 3: Production Approvals */}
      {activeTab === "production" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <DataTable
            data={productionData?.items || []}
            columns={prodColumns}
            keyExtractor={(item) => item.id}
          />
        </div>
      )}

      <SupervisorEvaluationModal
        isOpen={isEvalModalOpen}
        onClose={() => {
          setIsEvalModalOpen(false);
          setSelectedEval(null);
        }}
        evaluation={selectedEval}
      />

      <ScheduleMeetingModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
      />

      <ReviewProductionModal
        isOpen={isProdModalOpen}
        onClose={() => {
          setIsProdModalOpen(false);
          setSelectedProd(null);
        }}
        record={selectedProd}
      />
    </div>
  );
}

