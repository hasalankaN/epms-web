"use client";

import React from "react";

import type { AnalyticsChartItem } from "@/hooks/api/dashboard/useGetDashboardAnalytics";
import { CommonPieChart } from "../shared/charts/CommonPieChart";

// Pink color palette for batches
const BATCH_COLORS = [
  "#E11D9F",
  "#F472B6",
  "#F9A8D4",
  "#FBCFE8",
  "#F5D0FE",
  "#DDA0DD",
];

interface Props {
  data?: AnalyticsChartItem[];
  dateRange?: string;
}

export function TopBatchesChart({ data, dateRange }: Props) {
  const chartData = data?.length
    ? data.map((item, i) => ({
        name: item.name,
        value: item.value,
        color: BATCH_COLORS[i % BATCH_COLORS.length],
      }))
    : [];

  return (
    <CommonPieChart
      title="Top 5 Batches by Enrollment"
      dateRange={dateRange ?? ""}
      data={chartData}
    />
  );
}
