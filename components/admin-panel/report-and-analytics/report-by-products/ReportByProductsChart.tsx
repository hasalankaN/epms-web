"use client";

import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";

import type { ProductChartPoint } from "@/hooks/api/finances/useGetProductWiseReport";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {

    return (
      <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm">
        <p className="mb-2 text-xs font-semibold text-[#1D293D]">
          {payload[0].payload.displayDate}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-[10px] w-[3px] rounded-sm bg-[#EC4899]" />
          <p className="text-xs font-medium text-[#64748B]">Product Sales</p>
          <p className="text-xs font-semibold text-[#0F172B]">
            LKR {Number(payload[0].value).toLocaleString("en-LK", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    );
  }
  
  return null;
};

interface ReportByProductsChartProps {
  graphData?: ProductChartPoint[];
  isLoading?: boolean;
}

export function ReportByProductsChart({ graphData, isLoading }: ReportByProductsChartProps) {
  const chartData = (graphData ?? []).map((p) => ({
    date: p.period,
    displayDate: (() => {
      try {
        return format(new Date(p.period), "MMM d");
      } catch {
        return p.period;
      }
    })(),
    value: parseFloat(p.value ?? "0"),
  }));

  return (
    <div className="mt-6 flex w-full flex-col overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-white">
      <div className="flex w-full flex-col p-[24px]">
        <div className="h-[350px] w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
          <div className="h-full min-w-[800px] md:min-w-full">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-[#94A3B8]">
                No data for selected period
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" strokeWidth={0.895} />
                  <defs>
                    <linearGradient id="productBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EC4899" />
                      <stop offset="50%" stopColor="#F472B6" />
                      <stop offset="100%" stopColor="#FBCFE8" />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="displayDate"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }}
                    interval="preserveStartEnd"
                    dy={10}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F1F5F9" }} />
                  <Bar dataKey="value" fill="url(#productBarGradient)" radius={[2, 2, 0, 0]} maxBarSize={8} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
