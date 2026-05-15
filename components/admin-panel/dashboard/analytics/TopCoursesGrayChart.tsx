"use client";

import React from "react";

import type { AnalyticsChartItem } from "@/hooks/api/dashboard/useGetDashboardAnalytics";
import { CommonPieChart } from "../shared/charts/CommonPieChart";

// Gray/Blue color palette
const GRAY_COLORS = [
  "#334155",
  "#475569",
  "#64748B",
  "#94A3B8",
  "#CBD5E1",
  "#E2E8F0",
];

interface Props {
  data?: AnalyticsChartItem[];
  dateRange?: string;
}

export function TopCoursesGrayChart({ data, dateRange }: Props) {
  const chartData = data?.length
    ? data.map((item, i) => ({
        name: item.name,
        value: item.value,
        color: GRAY_COLORS[i % GRAY_COLORS.length],
      }))
    : [];

  return (
    <CommonPieChart
      title="Top 5 Courses by Enrollment"
      dateRange={dateRange ?? ""}
      data={chartData}
    />
  );
}
