"use client";

import React from "react";

import { AreaChart, Area, ResponsiveContainer, ReferenceLine, Tooltip } from "recharts";

import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  chartColor?: string;
  chartData?: number[];
  className?: string;
}

// Default dummy data for sparkline
const defaultChartData = [35, 28, 32, 22, 30, 18, 25, 20, 35, 15, 28];

export function MetricCard({
  title,
  value,
  chartColor = "#F59E0B",
  chartData = defaultChartData,
  className,
}: MetricCardProps) {
  // Transform array to chart data format
  const data = chartData.map((val, idx) => ({ value: val, index: idx }));

  return (
    <div
      className={cn(
        "flex flex-col items-start rounded-[8px] border border-[#E2E8F0] bg-white pt-2 px-1 pb-1 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
        className
      )}
    >
      {/* Upper section with dashed border */}
      <div className="flex w-full items-start justify-between border-b border-dashed border-[#E2E8F0] pb-1">
        <div className="flex flex-col pl-2">
          {/* Title - no gap to value */}
          <span className="font-sans text-[12px] font-normal leading-[16px] text-[#314158]">
            {title}
          </span>
          {/* Value */}
          <span className="font-sans text-[18px] font-semibold leading-[30px] text-[#020618]">
            {value}
          </span>
        </div>
        {/* All chip */}
        <div className="flex h-4 items-center gap-1 rounded-[40px] bg-[#F1F5F9] px-2 py-0.5 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
          <span className="font-sans text-[10px] font-normal leading-[16px] text-black">
            All
          </span>
        </div>
      </div>

      {/* Lower section with chart */}
      <div className="flex w-full flex-col items-end pt-1">
        {/* Last 7d chip */}
        <div className="flex h-4 items-center gap-1 rounded-[40px] bg-[#F1F5F9] px-2 py-0.5 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
          <span className="font-sans text-[10px] font-normal leading-[16px] text-black">
            Last 7d
          </span>
        </div>

        {/* Recharts Sparkline */}
        <div className="relative mt-2 h-[50px] w-full">
          <ResponsiveContainer width="100%" height={50} debounce={1}>
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={chartColor} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <ReferenceLine y={25} stroke="#94A3B8" strokeDasharray="3 3" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
                itemStyle={{ color: "#1D293D", fontSize: "12px", fontWeight: 500 }}
                formatter={(value: any) => [value, "Value"]}
                labelStyle={{ display: "none" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#gradient-${title.replace(/\s+/g, '')})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
