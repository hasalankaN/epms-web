"use client";

import React from "react";

import type { DashboardFinancialSummary } from "@/hooks/api/dashboard/useGetDashboardOverview";

import { MetricCard } from "./MetricCard";
import { NetAmountCard } from "./NetAmountCard";

interface FinancialSummaryProps {
  financialSummary?: DashboardFinancialSummary;
}

function fmt(value: number): string {
  return `LKR ${value.toLocaleString("en-LK", { minimumFractionDigits: 0 })}`;
}

export function FinancialSummary({ financialSummary }: FinancialSummaryProps) {
  const metrics = [
    {
      title: "Total Sales",
      value: financialSummary ? fmt(financialSummary.totalSales) : "LKR 0",
      chartColor: "#3B82F6",
      chartData: financialSummary?.salesSeries?.length
        ? financialSummary.salesSeries
        : [20, 35, 28, 45, 32, 40, 38, 50, 42, 55, 48],
    },
    {
      title: "Total Income",
      value: financialSummary ? fmt(financialSummary.totalIncome) : "LKR 0",
      chartColor: "#10B981",
      chartData: financialSummary?.incomeSeries?.length
        ? financialSummary.incomeSeries
        : [15, 22, 30, 25, 35, 28, 40, 32, 45, 38, 50],
    },
    {
      title: "Total Expenses",
      value: financialSummary ? fmt(financialSummary.totalExpenses) : "LKR 0",
      chartColor: "#F59E0B",
      chartData: financialSummary?.expensesSeries ?? [],
    },
    {
      title: "Total Discounts",
      value: financialSummary ? fmt(financialSummary.totalDiscounts) : "LKR 0",
      chartColor: "#EF4444",
      chartData: financialSummary?.discountsSeries ?? [],
    },
    {
      title: "Total Due",
      value: financialSummary ? fmt(financialSummary.totalDue) : "LKR 0",
      chartColor: "#8B5CF6",
      chartData: financialSummary?.dueSeries ?? [],
    },
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
      <NetAmountCard
        value={financialSummary ? fmt(financialSummary.netAmount) : "LKR 0"}
      />
    </div>
  );
}
