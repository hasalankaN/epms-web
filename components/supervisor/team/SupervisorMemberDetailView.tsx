"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Clock,
  CheckCircle2,
  Calendar,
  Activity,
  Star,
  Plus,
  Briefcase,
  Award,
  ArrowLeft,
} from "lucide-react";
import { BackButton } from "@/components/common/BackButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { useTeamTasksQuery } from "@/hooks/api/tasks/useTasks";
import { useTeamAttendanceQuery } from "@/hooks/api/attendance/useAttendance";
import { useSupervisorLeavesQuery } from "@/hooks/api/leaves/useLeaves";
import { useSupervisorProductionQuery } from "@/hooks/api/production/useProduction";
import { useCurrentSelfEvaluationQuery } from "@/hooks/api/performance/usePerformance";
import { toast } from "sonner";

interface SupervisorMemberDetailViewProps {
  empId: string;
}

export function SupervisorMemberDetailView({ empId }: SupervisorMemberDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "attendance" | "tasks" | "production" | "performance" | "leave"
  >("overview");

  const { data: attendanceData } = useTeamAttendanceQuery();
  const { data: tasksData } = useTeamTasksQuery();
  const { data: leavesData } = useSupervisorLeavesQuery();
  const { data: prodData } = useSupervisorProductionQuery();
  const { data: selfEval } = useCurrentSelfEvaluationQuery();

  const attendanceList = attendanceData?.items || [];
  const tasksList = tasksData?.items || [];
  const leavesList = leavesData?.items || [];
  const prodList = prodData?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton href="/supervisor-panel/team" label="Back to Team" />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => router.push(`/supervisor-panel/tasks`)}
            className="text-xs gap-1.5 bg-[#E60076] hover:bg-[#d0006a] text-white"
          >
            <Plus className="h-3.5 w-3.5" /> Assign Task
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/supervisor-panel/kpis`)}
            className="text-xs gap-1.5"
          >
            <Star className="h-3.5 w-3.5 text-amber-500" /> Evaluate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/supervisor-panel/kpis`)}
            className="text-xs gap-1.5"
          >
            <Calendar className="h-3.5 w-3.5 text-pink-600" /> Schedule Meeting
          </Button>
        </div>
      </div>

      {/* Header Profile Summary Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <Avatar className="h-20 w-20 border-2 border-pink-500 shadow-sm">
            <AvatarFallback className="bg-pink-100 text-pink-700 font-extrabold text-2xl">
              NP
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Nuwan Pradeep Perera
              </h2>
              <StatusBadge status="ACTIVE" />
            </div>
            <p className="text-xs font-semibold text-pink-600 dark:text-pink-400">
              Senior Software Engineer · Technology & Engineering
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
              <span>Code: <strong className="text-slate-700 dark:text-slate-300">EMP-1042</strong></span>
              <span>•</span>
              <span>Joined: <strong className="text-slate-700 dark:text-slate-300">2022-03-01</strong></span>
              <span>•</span>
              <span>NIC: <strong className="text-slate-700 dark:text-slate-300">199418204910</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: "overview", label: "Overview", icon: User },
          { key: "attendance", label: "Attendance Logs", icon: Clock },
          { key: "tasks", label: `Tasks (${tasksList.length})`, icon: CheckCircle2 },
          { key: "production", label: "Production Ratios", icon: Activity },
          { key: "performance", label: "Appraisal & Ratings", icon: Star },
          { key: "leave", label: "Leave Quotas", icon: Calendar },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                isActive
                  ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Contact & Employment Info</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Official Email:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">nuwan.perera@epms.lk</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Mobile Phone:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">+94 77 123 4567</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Residential Address:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">45/2 Lake Drive, Rajagiriya</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">EPF / ETF No:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">EPF-88392</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Qualifications:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">B.Sc in Computing (Hons), AWS Certified SAA</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Emergency Contacts</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">Thilini Perera (Spouse)</p>
                <p className="text-slate-500">Mobile: +94 77 987 6543 · Work: +94 11 234 5678</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">Sunil Perera (Father)</p>
                <p className="text-slate-500">Mobile: +94 71 456 7890</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance */}
      {activeTab === "attendance" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Punch In</th>
                  <th className="p-3">Punch Out</th>
                  <th className="p-3">Work Hours</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendanceList.map((a) => (
                  <tr key={a.id}>
                    <td className="p-3 font-semibold">{a.date} ({a.day})</td>
                    <td className="p-3 font-mono">{a.punchIn || "—"}</td>
                    <td className="p-3 font-mono">{a.punchOut || "—"}</td>
                    <td className="p-3 font-semibold">{a.workHours}h</td>
                    <td className="p-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Tasks */}
      {activeTab === "tasks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasksList.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{task.title}</span>
                <StatusBadge status={task.status} />
              </div>
              <p className="text-slate-500 line-clamp-2">{task.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                <span>Priority: {task.priority}</span>
                <span>Due: {task.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Production */}
      {activeTab === "production" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Project</th>
                <th className="p-3">Expected</th>
                <th className="p-3">Actual</th>
                <th className="p-3">Achievement</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {prodList.map((p) => (
                <tr key={p.id}>
                  <td className="p-3 font-semibold">{p.date}</td>
                  <td className="p-3">{p.projectName}</td>
                  <td className="p-3">{p.expectedUnits} units</td>
                  <td className="p-3 font-bold">{p.actualUnits} units</td>
                  <td className="p-3 font-bold text-emerald-600">{p.achievementPercentage}%</td>
                  <td className="p-3"><StatusBadge status={p.approvalStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Performance */}
      {activeTab === "performance" && selfEval && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-5 space-y-4 text-xs">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Latest Self Appraisal ({selfEval.period})
            </h3>
            <span className="font-bold text-[#E60076]">Self Score: {selfEval.overallRating} / 5.0</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300">Reported Achievements:</span>
              <p className="text-slate-600 dark:text-slate-400">{selfEval.achievements}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300">Stated Career Goals:</span>
              <p className="text-slate-600 dark:text-slate-400">{selfEval.goals}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Leave */}
      {activeTab === "leave" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Applied On</th>
                <th className="p-3">Leave Type</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Days</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leavesList.map((l) => (
                <tr key={l.id}>
                  <td className="p-3 text-slate-500">{l.appliedOn}</td>
                  <td className="p-3 font-semibold">{l.type}</td>
                  <td className="p-3">{l.fromDate} → {l.toDate}</td>
                  <td className="p-3 font-bold">{l.days}d</td>
                  <td className="p-3 text-slate-500 max-w-xs truncate">{l.reason}</td>
                  <td className="p-3"><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
