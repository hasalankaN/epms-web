"use client";

import React from "react";

import type { DashboardTodayStats } from "@/hooks/api/dashboard/useGetDashboardOverview";

import { StatCard } from "./StatCard";

interface OverviewStatsProps {
  todayStats?: DashboardTodayStats;
}

function formatCurrency(value: number): string {
  return `LKR ${value.toLocaleString("en-LK", { minimumFractionDigits: 0 })}`;
}

export function OverviewStats({ todayStats }: OverviewStatsProps) {
  const mkTrend = (dod: number | undefined) =>
    dod !== undefined
      ? { value: Math.abs(dod), isPositive: dod >= 0 }
      : undefined;

  const stats = [
    {
      title: "Today's Inquiries",
      value: todayStats ? String(todayStats.inquiries) : "—",
      trend: mkTrend(todayStats?.inquiriesDod),
    },
    {
      title: "Today's Stu. Enrollments",
      value: todayStats ? String(todayStats.enrollments) : "—",
      trend: mkTrend(todayStats?.enrollmentsDod),
    },
    {
      title: "Today's Orders",
      value: todayStats ? String(todayStats.orders).padStart(2, "0") : "—",
      trend: mkTrend(todayStats?.ordersDod),
    },
    {
      title: "Today's Sales",
      value: todayStats ? String(todayStats.sales.toFixed(0)) : "—",
      trend: mkTrend(todayStats?.salesDod),
    },
    {
      title: "Today's Income",
      value: todayStats ? formatCurrency(todayStats.income) : "—",
      trend: mkTrend(todayStats?.incomeDod),
    },
    {
      title: "Cash In Hand",
      value: todayStats
        ? formatCurrency(todayStats.income + todayStats.sales)
        : "—",
      showDoD: false,
      valueClassName: "text-[#E60076]",
      className: "py-9",
    },
  ];

  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop: Flex layout with dividers */}
      <div className="hidden h-[126px] items-center justify-between lg:flex">
        {stats.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <StatCard
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
              showDoD={stat.showDoD}
              valueClassName={stat.valueClassName}
              className={`flex-1 ${stat.className || ""}`}
            />
            {/* Show divider if not the last item */}
            {index < stats.length - 1 && (
              <div className="h-[calc(100%-24px)] w-px self-center bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tablet: 3 columns, 2 rows */}
      <div className="hidden grid-cols-3 md:grid lg:hidden">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`
              ${index % 3 !== 0 ? "border-l border-[#E2E8F0]" : ""}
              ${index >= 3 ? "border-t border-[#E2E8F0]" : ""}
            `}
          >
            <div className="my-3">
              <StatCard
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
                showDoD={stat.showDoD}
                valueClassName={stat.valueClassName}
                className={stat.className}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: 2 columns, 3 rows */}
      <div className="grid grid-cols-2 md:hidden">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className={`
              ${index % 2 !== 0 ? "border-l border-[#E2E8F0]" : ""}
              ${index >= 2 ? "border-t border-[#E2E8F0]" : ""}
            `}
          >
            <div className="my-3">
              <StatCard
                title={stat.title}
                value={stat.value}
                trend={stat.trend}
                showDoD={stat.showDoD}
                valueClassName={stat.valueClassName}
                className={stat.className}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
