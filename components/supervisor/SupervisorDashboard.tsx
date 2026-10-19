import React from "react";

import {
  Users,
  CheckCircle2,
  Clock,
  Target,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    title: "Team Members",
    value: "12",
    change: "Direct reports",
    icon: Users,
    color: "from-blue-600 to-indigo-600",
  },
  {
    title: "Active Tasks",
    value: "38",
    change: "4 due today",
    icon: Clock,
    color: "from-amber-600 to-orange-600",
  },
  {
    title: "Completed Tasks",
    value: "142",
    change: "+18 this week",
    icon: CheckCircle2,
    color: "from-emerald-600 to-teal-600",
  },
  {
    title: "Team KPI Achievement",
    value: "92%",
    change: "+4% vs target",
    icon: Target,
    color: "from-purple-600 to-violet-600",
  },
];

const supervisorQuickActions = [
  {
    title: "Team Management",
    desc: "View members, track individual capacity, and view contact info",
    href: "/supervisor-panel/team",
  },
  {
    title: "Task & Goal Delegation",
    desc: "Assign deliverables with deadlines and KPI weightings",
    href: "/supervisor-panel/tasks",
  },
  {
    title: "Appraisals & Performance Ratings",
    desc: "Score team members for current quarterly evaluation cycle",
    href: "/supervisor-panel/kpis",
  },
];

export function SupervisorDashboard() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Supervisor Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Team performance tracking, task distribution, and subordinate appraisal
          assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;

          return (
            <div
              key={idx}
              className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.title}
                </span>
                <div
                  className={`p-2.5 rounded-lg bg-gradient-to-tr ${stat.color} text-white shadow-sm`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="mt-1 flex items-center text-xs text-slate-500">
                  <span className="text-emerald-600 font-medium">
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Supervisory Operations
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your direct team&apos;s assignments, evaluate goals, and
            approve pending leave requests.
          </p>
          <div className="mt-6 space-y-3">
            {supervisorQuickActions.map((action, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-100 transition-colors dark:border-slate-800/80 dark:bg-slate-800/30 dark:hover:bg-slate-800/60"
              >
                <div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {action.desc}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Pending Actions
          </h2>
          <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                3 Leave Requests
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Awaiting supervisor recommendation.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                2 Overdue Deliverables
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Follow up required on Project Alpha milestones.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupervisorDashboard;
