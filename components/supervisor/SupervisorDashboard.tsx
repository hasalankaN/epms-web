"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Clock,
  Target,
  ArrowUpRight,
  Calendar,
  AlertTriangle,
  FileCheck,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useSupervisorLeavesQuery, useDecideLeaveMutation } from "@/hooks/api/leaves/useLeaves";
import { useAdjustmentRequestsQuery, useDecideAdjustmentMutation } from "@/hooks/api/attendance/useAttendance";
import { useTeamAttendanceQuery } from "@/hooks/api/attendance/useAttendance";
import { useTeamTasksQuery } from "@/hooks/api/tasks/useTasks";
import { useEvaluationMeetingsQuery } from "@/hooks/api/performance/usePerformance";
import { useSupervisorProductionQuery } from "@/hooks/api/production/useProduction";

export function SupervisorDashboard() {
  const { data: leavesData } = useSupervisorLeavesQuery({ status: "PENDING" });
  const { data: adjustmentRequests = [] } = useAdjustmentRequestsQuery();
  const { data: attendanceData } = useTeamAttendanceQuery();
  const { data: tasksData } = useTeamTasksQuery();
  const { data: meetings = [] } = useEvaluationMeetingsQuery();
  const { data: productionData } = useSupervisorProductionQuery({ approvalStatus: "PENDING" });

  const decideLeaveMutation = useDecideLeaveMutation();
  const decideAdjMutation = useDecideAdjustmentMutation();

  const pendingLeaves = leavesData?.items || [];
  const pendingAdjustments = adjustmentRequests.filter((a) => a.status === "PENDING");
  const attendanceList = attendanceData?.items || [];
  const tasksList = tasksData?.items || [];
  const pendingProd = productionData?.items || [];

  const presentCount = attendanceList.filter((a) => a.status === "PRESENT" || a.status === "LATE").length;
  const lateCount = attendanceList.filter((a) => a.status === "LATE").length;
  const absentCount = attendanceList.filter((a) => a.status === "ABSENT").length;
  const earlyCount = attendanceList.filter((a) => a.status === "EARLY_DEPARTURE").length;

  const overdueTasks = tasksList.filter(
    (t) => new Date(t.dueDate) < new Date() && t.status !== "DONE"
  );

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Supervisor Management Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time operational overview of team attendance, task allocations, and pending approvals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/supervisor-panel/approvals">
            <Button className="bg-[#E60076] hover:bg-[#d0006a] text-white text-xs gap-1.5 font-semibold">
              <FileCheck className="h-4 w-4" />
              Approvals Center ({pendingLeaves.length + pendingAdjustments.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Team Size"
          value="12"
          icon={Users}
          subText="Active direct reports"
        />
        <StatCard
          label="Present Today"
          value={`${presentCount} / ${attendanceList.length || 12}`}
          icon={CheckCircle2}
          subText={`${lateCount} checked in late`}
        />
        <StatCard
          label="Pending Leaves"
          value={pendingLeaves.length}
          icon={Calendar}
          subText="Awaiting decision"
        />
        <StatCard
          label="Pending Adjustments"
          value={pendingAdjustments.length}
          icon={Clock}
          subText="Punch requests"
        />
        <StatCard
          label="Production Approvals"
          value={pendingProd.length}
          icon={Target}
          subText="Units verification"
        />
      </div>

      {/* Row 2: Attendance Donut & Overdue Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Attendance Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#E60076]" /> Today's Team Attendance
            </h3>
            <Link
              href="/supervisor-panel/attendance"
              className="text-xs text-[#E60076] font-semibold hover:underline flex items-center gap-1"
            >
              Full Log <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Visual Breakdown bar */}
          <div className="space-y-1.5">
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
              <div
                style={{ width: `${(presentCount / (attendanceList.length || 1)) * 100}%` }}
                className="bg-emerald-500 h-full"
                title="Present"
              />
              <div
                style={{ width: `${(lateCount / (attendanceList.length || 1)) * 100}%` }}
                className="bg-amber-500 h-full"
                title="Late"
              />
              <div
                style={{ width: `${(absentCount / (attendanceList.length || 1)) * 100}%` }}
                className="bg-rose-500 h-full"
                title="Absent"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Present ({presentCount})
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" /> Late ({lateCount})
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Absent ({absentCount})
              </span>
            </div>
          </div>

          {/* Members flagged late or absent today */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Exceptions Today
            </p>
            {attendanceList
              .filter((a) => a.status === "LATE" || a.status === "ABSENT")
              .slice(0, 3)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40"
                >
                  <div>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.employeeName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {item.status === "LATE" ? `Punch: ${item.punchIn}` : "No punch recorded"}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
          </div>
        </div>

        {/* Tasks Overview */}
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#E60076]" /> Sprint Tasks Overview
            </h3>
            <Link
              href="/supervisor-panel/tasks"
              className="text-xs text-[#E60076] font-semibold hover:underline flex items-center gap-1"
            >
              Task Board <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-slate-400 font-medium">To Do</span>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {tasksList.filter((t) => t.status === "TODO").length}
              </p>
            </div>
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 rounded-xl">
              <span className="text-blue-600 font-medium">In Progress</span>
              <p className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-0.5">
                {tasksList.filter((t) => t.status === "IN_PROGRESS").length}
              </p>
            </div>
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl">
              <span className="text-emerald-600 font-medium">Done</span>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mt-0.5">
                {tasksList.filter((t) => t.status === "DONE").length}
              </p>
            </div>
          </div>

          {/* Overdue Tasks Alert List */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-rose-500 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" /> Overdue Deliverables ({overdueTasks.length})
            </p>
            {overdueTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between text-xs p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40"
              >
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {task.title}
                  </p>
                  <p className="text-[10px] text-slate-400">Assigned: {task.assignedToName}</p>
                </div>
                <span className="text-[10px] font-bold text-rose-600 shrink-0">Due {task.dueDate}</span>
              </div>
            ))}
            {overdueTasks.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-2">All tasks within scheduled timelines.</p>
            )}
          </div>
        </div>

        {/* Upcoming Appraisal Meetings & Training */}
        <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#E60076]" /> Appraisal Meetings
            </h3>
            <Link
              href="/supervisor-panel/kpis"
              className="text-xs text-[#E60076] font-semibold hover:underline flex items-center gap-1"
            >
              KPIs & Appraisals <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {meetings.slice(0, 3).map((m) => (
              <div
                key={m.id}
                className="border border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{m.employeeName}</span>
                  <StatusBadge status={m.status} />
                </div>
                <p className="text-slate-500 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-pink-600" /> {m.dateTime}
                </p>
                <p className="text-slate-400 text-[11px] truncate">{m.location}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Pending Approvals Queue */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Pending Authorization Requests
            </h3>
            <p className="text-xs text-slate-500">
              Quickly review leave applications and attendance punch adjustments from your team.
            </p>
          </div>
          <Link href="/supervisor-panel/approvals">
            <Button variant="outline" size="sm" className="text-xs">
              View Full Approvals Inbox
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Leaves Pending */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Leave Requests ({pendingLeaves.length})
            </span>
            {pendingLeaves.slice(0, 3).map((leave) => (
              <div
                key={leave.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{leave.employeeName}</p>
                  <p className="text-[11px] text-slate-400">
                    {leave.type} · {leave.fromDate} to {leave.toDate} ({leave.days}d)
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">"{leave.reason}"</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      decideLeaveMutation.mutate({
                        id: leave.id,
                        decision: "APPROVED",
                        comment: "Approved from dashboard",
                      })
                    }
                    className="h-7 w-7 p-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                    title="Approve"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      decideLeaveMutation.mutate({
                        id: leave.id,
                        decision: "REJECTED",
                        comment: "Declined from dashboard",
                      })
                    }
                    className="h-7 w-7 p-0 text-rose-600 hover:border-rose-300 rounded-lg"
                    title="Reject"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {pendingLeaves.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                No leave requests pending.
              </p>
            )}
          </div>

          {/* Adjustments Pending */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Attendance Adjustments ({pendingAdjustments.length})
            </span>
            {pendingAdjustments.slice(0, 3).map((adj) => (
              <div
                key={adj.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{adj.employeeName}</p>
                  <p className="text-[11px] text-slate-400">
                    {adj.date} · Requested: {adj.requestedPunchIn} - {adj.requestedPunchOut}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 italic mt-0.5">"{adj.reason}"</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      decideAdjMutation.mutate({
                        id: adj.id,
                        decision: "APPROVED",
                        comment: "Approved from dashboard",
                      })
                    }
                    className="h-7 w-7 p-0 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                    title="Approve"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      decideAdjMutation.mutate({
                        id: adj.id,
                        decision: "REJECTED",
                        comment: "Rejected from dashboard",
                      })
                    }
                    className="h-7 w-7 p-0 text-rose-600 hover:border-rose-300 rounded-lg"
                    title="Reject"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {pendingAdjustments.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                No attendance adjustments pending.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
