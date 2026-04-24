"use client";

import React, { useMemo } from "react";

import { format } from "date-fns";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

import type { OverviewGraph, OverviewSummary } from "@/hooks/api/finances/useGetFinanceOverview";

interface ChartPoint {
  date: string;
  displayDate: string;
  value: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm">
        <p className="mb-2 text-xs font-semibold text-[#1D293D]">{payload[0].payload.date}</p>
        <div className="flex items-center gap-2">
          <div className="h-[10px] w-[3px] rounded-sm bg-[#EC4899]" />
          <p className="text-xs font-medium text-[#64748B]">Revenue</p>
          <p className="text-xs font-semibold text-[#0F172B]">
            {Number(payload[0].value).toLocaleString("en-LK")} LKR
          </p>
        </div>
      </div>
    );
  }

  
return null;
};

interface RevenueGrowthChartProps {
  graph?: OverviewGraph;
  summary?: OverviewSummary;
  isLoading?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export function RevenueGrowthChart({ graph, summary, isLoading, dateFrom, dateTo }: RevenueGrowthChartProps) {
  const data = useMemo<ChartPoint[]>(() => {
    if (!graph?.series?.length) return [];
    
return graph.series.map((s) => {
      const d = new Date(s.period);
      const isMonth = graph.group_by === "MONTH";

      
return {
        date: format(d, isMonth ? "MMM yyyy" : "yyyy-MM-dd"),
        displayDate: format(d, isMonth ? "MMM yy" : "MMM d"),
        value: Number(s.total ?? 0),
      };
    });
  }, [graph]);

  const totalRevenue = summary?.total_payments
    ? `LKR ${Number(summary.total_payments).toLocaleString("en-LK", { minimumFractionDigits: 0 })}`
    : "LKR 0";

  const periodLabel = dateFrom && dateTo
    ? `${format(new Date(dateFrom), "d MMM yyyy")} – ${format(new Date(dateTo), "d MMM yyyy")}`
    : "All time";

  return (
    <div className="mt-6 flex w-full flex-col overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-white">
      <div className="flex flex-col md:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-[4px] border-b-[0.895px] border-[#E2E8F0] p-[24px]">
          <h3 className="font-inter text-[18px] font-semibold leading-[30px] text-[#111827]">Revenue Growth</h3>
          <p className="font-inter text-[12px] font-normal leading-[16px] text-[#6B7280]">{periodLabel}</p>
        </div>
        <div className="flex flex-col items-start gap-[4px] border-b-[0.895px] border-[#E2E8F0] bg-[#F8FAFC] px-[28px] py-[21px] md:min-w-[280px] md:border-l-[0.895px]">
          <p className="font-inter text-[12px] font-medium leading-[16px] text-[#374151]">Revenue Calculated</p>
          {isLoading ? (
            <div className="h-9 w-48 animate-pulse rounded bg-slate-200" />
          ) : (
            <p className="font-inter text-[32px] font-semibold leading-[38px] text-[#111827]">{totalRevenue}</p>
          )}
        </div>
      </div>

      <div className="flex w-full flex-col p-[24px]">
        {isLoading ? (
          <div className="h-[350px] w-full animate-pulse rounded bg-slate-100" />
        ) : data.length === 0 ? (
          <div className="flex h-[350px] items-center justify-center text-sm text-[#90A1B9]">No data for the selected period</div>
        ) : (
          <div className="h-[350px] w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
            <div className="h-full min-w-[800px] md:min-w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#E2E8F0" strokeWidth={0.895} />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EC4899" />
                      <stop offset="50%" stopColor="#F472B6" />
                      <stop offset="100%" stopColor="#FBCFE8" />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="displayDate" axisLine={false} tickLine={false}
                    tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }} interval="preserveStartEnd" dy={10} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F1F5F9" }} />
                  <Bar dataKey="value" fill="url(#barGradient)" radius={[2, 2, 0, 0]} maxBarSize={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
