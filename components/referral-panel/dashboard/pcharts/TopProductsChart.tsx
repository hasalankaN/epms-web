"use client";

import React from "react";

import { CommonPieChart } from "@/components/admin-panel/dashboard/shared/charts/CommonPieChart";

// Chart data with Gray/Blue color scheme
const productsData = [
  { name: "Product A", value: 28, color: "#334155" },
  { name: "Product B", value: 24, color: "#475569" },
  { name: "Product C", value: 20, color: "#64748B" },
  { name: "Product D", value: 14, color: "#94A3B8" },
  { name: "Product E", value: 10, color: "#CBD5E1" },
  { name: "Other", value: 4, color: "#E2E8F0" },
];

export function TopProductsChart() {
  return (
    <CommonPieChart
      title="Top 5 Products By Purchase"
      dateRange="From {month} - To {month} {Year}"
      data={productsData}
    />
  );
}
