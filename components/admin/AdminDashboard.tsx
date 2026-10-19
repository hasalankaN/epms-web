import React from "react";

import {
  Users,
  Shield,
  Building2,
  Activity,
  ArrowUpRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "248",
    change: "+12% this month",
    icon: Users,
    color: "from-blue-600 to-indigo-600",
  },
  {
    title: "Active Roles",
    value: "4",
    change: "Admin, HR, Sup, Emp",
    icon: Shield,
    color: "from-purple-600 to-violet-600",
  },
  {
    title: "Departments",
    value: "8",
    change: "All operational",
    icon: Building2,
    color: "from-emerald-600 to-teal-600",
  },
  {
    title: "System Health",
    value: "99.9%",
    change: "Optimal uptime",
    icon: Activity,
    color: "from-amber-600 to-orange-600",
  },
];

const quickActions = [
  {
    title: "Manage System Users",
    desc: "Create, invite, or adjust roles across departments",
    href: "/admin-panel/users",
  },
  {
    title: "Configure Roles & Privileges",
    desc: "Fine-tune access controls for HR, Supervisors, and Employees",
    href: "/admin-panel/departments",
  },
  {
    title: "Review System Audit Logs",
    desc: "Track security events and login sessions",
    href: "/admin-panel/audit-logs",
  },
];

export function AdminDashboard() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          System overview, user privileges, and EPMS infrastructure controls.
        </p>
      </div>

      {/* Metric Cards */}
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
                  <span className="text-emerald-600 font-medium inline-flex items-center">
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action & Info Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            System Administration Quickstart
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            This EPMS project is ready for building your custom administrative
            views.
          </p>
          <div className="mt-6 space-y-3">
            {quickActions.map((action, i) => (
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
            Active EPMS Environment
          </h2>
          <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Framework</span>
              <span className="font-medium">Next.js 15 (App Router)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Session Cookie</span>
              <span className="font-medium font-mono text-[11px]">
                epms-session
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Supported Roles</span>
              <span className="font-medium">ADMIN, HR, SUPERVISOR, EMPLOYEE</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Status</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
                Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
