import React from "react";
import { adminStats } from "../../../data/adminDashboardData";
import { MetricCard } from "./MetricCard";
import { QuickActions } from "./QuickActions";

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
        {adminStats.map((stat, idx) => (
          <MetricCard key={idx} stat={stat} />
        ))}
      </div>

      {/* Quick Action & Info Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickActions />
      </div>
    </div>
  );
}

export default AdminDashboard;