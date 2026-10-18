import React from "react";

import { Users, UserPlus, CalendarCheck, Award, ArrowUpRight } from "lucide-react";

export default function HRDashboardPage() {
  const stats = [
    { title: "Total Employees", value: "248", change: "+5 this month", icon: Users, color: "from-blue-600 to-cyan-600" },
    { title: "Onboarding In-Progress", value: "6", change: "2 finalizing", icon: UserPlus, color: "from-indigo-600 to-blue-600" },
    { title: "Leaves Pending Review", value: "14", change: "Requires action", icon: CalendarCheck, color: "from-amber-600 to-orange-600" },
    { title: "Quarterly Appraisals", value: "88%", change: "On schedule", icon: Award, color: "from-emerald-600 to-teal-600" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          HR Management Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Workforce overview, employee lifecycle, leaves, and appraisal management.
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
                <div className={`p-2.5 rounded-lg bg-gradient-to-tr ${stat.color} text-white shadow-sm`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="mt-1 flex items-center text-xs text-slate-500">
                  <span className="text-emerald-600 font-medium">{stat.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Human Resources Management Hub
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Access employee records, payroll policies, and organization review cycles.
          </p>
          <div className="mt-6 space-y-3">
            {[
              { title: "Employee Directory", desc: "View full employee rosters, contracts, and profiles", href: "/hr-panel/employees" },
              { title: "Leave & Attendance Tracking", desc: "Review organization-wide attendance records and leave applications", href: "/hr-panel/attendance" },
              { title: "Performance Review Cycles", desc: "Track 360 evaluations, quarterly reviews, and ratings", href: "/hr-panel/reviews" },
            ].map((action, i) => (
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
            HR Notifications
          </h2>
          <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100 text-blue-900 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-300">
              <p className="font-semibold">Q3 Appraisals Open</p>
              <p className="text-[11px] mt-0.5 opacity-90">All supervisors have been notified to submit ratings.</p>
            </div>
            <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-100 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-300">
              <p className="font-semibold">Upcoming Public Holiday</p>
              <p className="text-[11px] mt-0.5 opacity-90">Calendar updated in the attendance module.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
