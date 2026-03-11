"use client";

import React from "react";

import { MetricCard } from "./MetricCard";
import { NetAmountCard } from "./NetAmountCard";

export function FinancialSummary() {
  const metrics = [
    { title: "Total Sales", value: "LKR 89,935", chartColor: "#3B82F6", chartData: [20, 35, 28, 45, 32, 40, 38, 50, 42, 55, 48] },
    { title: "Total Income", value: "LKR 109,935", chartColor: "#10B981", chartData: [15, 22, 30, 25, 35, 28, 40, 32, 45, 38, 50] },
    { title: "Total Expenses", value: "LKR 45,935", chartColor: "#F59E0B", chartData: [35, 28, 32, 22, 30, 18, 25, 20, 35, 15, 28] },
    { title: "Total Discounts", value: "LKR 9,000", chartColor: "#EF4444", chartData: [10, 18, 12, 22, 15, 20, 18, 25, 20, 28, 22] },
    { title: "Total Due", value: "LKR 55,000", chartColor: "#8B5CF6", chartData: [25, 30, 22, 35, 28, 40, 32, 38, 35, 45, 40] },
  ];

  return (
    <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {/* Metric Cards */}
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          chartColor={metric.chartColor}
          chartData={metric.chartData}
        />
      ))}

      {/* Net Amount Card */}
      <NetAmountCard value="LKR 199,900" />
    </div>
  );
}
