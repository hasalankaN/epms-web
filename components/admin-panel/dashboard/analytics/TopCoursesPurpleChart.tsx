"use client";

import React from "react";

import type { AnalyticsChartItem } from "@/hooks/api/dashboard/useGetDashboardAnalytics";
import { CommonPieChart } from "../shared/charts/CommonPieChart";

// Purple color palette
const PURPLE_COLORS = [
  "#7C3AED",
  "#8B5CF6",
  "#A78BFA",
  "#C4B5FD",
  "#DDD6FE",
  "#EDE9FE",
];

interface Props {
  data?: AnalyticsChartItem[];
  dateRange?: string;
}

export function TopCoursesPurpleChart({ data, dateRange }: Props) {
  const chartData = data?.length
    ? data.map((item, i) => ({
        name: item.name,
        value: item.value,
        color: PURPLE_COLORS[i % PURPLE_COLORS.length],
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
