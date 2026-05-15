"use client";

import React from "react";

import type { EnrollmentStatusItem } from "@/hooks/api/dashboard/useGetDashboardOverview";

import { CommonPieChart } from "../../../shared/charts/CommonPieChart";

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: "#E11D9F",
  HOLD: "#F472B6",
  NO_RESPONSE: "#FBCFE8",
  DROPPED: "#F9A8D4",
  ACTIVE: "#F5D0FE",
  PENDING: "#DDA0DD",
};

const DEFAULT_COLORS = [
  "#E11D9F",
  "#F472B6",
  "#FBCFE8",
  "#F9A8D4",
  "#F5D0FE",
  "#DDA0DD",
];

interface EnrollmentPieChartProps {
  className?: string;
  enrollmentByStatus?: EnrollmentStatusItem[];
}

export function EnrollmentPieChart({
  className,
  enrollmentByStatus,
}: EnrollmentPieChartProps) {
  const now = new Date();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const startMonth = monthNames[0];
  const currentMonth = monthNames[now.getMonth()];
  const currentYear = now.getFullYear();
  const dateRange = `${startMonth} - ${currentMonth} ${currentYear}`;

  const data = enrollmentByStatus?.length
    ? enrollmentByStatus.map((item, i) => ({
        name:
          item.status.charAt(0).toUpperCase() +
          item.status.slice(1).toLowerCase().replace("_", " "),
        value: item.count,
        color:
          STATUS_COLORS[item.status] ??
          DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      }))
    : [];

  return (
    <CommonPieChart
      title="Number of Enrollments"
      dateRange={dateRange}
      data={data}
      className={className}
    />
  );
}
