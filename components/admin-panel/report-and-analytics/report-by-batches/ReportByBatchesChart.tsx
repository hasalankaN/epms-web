"use client";

import React, { useMemo } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const generateDummyData = () => {
  const data = [];
  const start = new Date(2025, 3, 1); // April 1st, 2025

  for (let i = 0; i < 91; i++) {
    const current = new Date(start);

    current.setDate(start.getDate() + i);

    const value = Math.floor(Math.random() * 500000) + 100000;

    const month = current.getMonth();
    const d = current.getDate();
    let displayDate = "";

    if (month === 3 && [1, 4, 9, 15, 21, 27].includes(d)) displayDate = `Apr ${d}`;
    if (month === 4 && [3, 9, 15, 21, 27].includes(d)) displayDate = `May ${d}`;
    if (month === 5 && [2, 7, 12, 18, 24, 30].includes(d)) displayDate = `Jun ${d}`;

    data.push({
      date: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`,
      displayDate,
      value,
    });
  }

  return data;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm">
        <p className="mb-2 text-xs font-semibold text-[#1D293D]">
          {payload[0].payload.date}
        </p>
        <div className="flex items-center gap-2">
          <div className="h-[10px] w-[3px] rounded-sm bg-[#EC4899]" />
          <p className="text-xs font-medium text-[#64748B]">Batch Revenue</p>
          <p className="text-xs font-semibold text-[#0F172B]">
            {payload[0].value.toLocaleString()} LKR
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export function ReportByBatchesChart() {
  const data = useMemo(() => generateDummyData(), []);

  return (
    <div className="mt-6 flex w-full flex-col overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-white">

      {/* Chart */}
      <div className="flex w-full flex-col p-[24px]">
        <div className="h-[350px] w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
          <div className="h-full min-w-[800px] md:min-w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid
                  vertical={false}
                  stroke="#E2E8F0"
                  strokeWidth={0.895}
                />
                <defs>
                  <linearGradient id="batchBarGradient" x1="0" y1="0" x2="0" y2="1">
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
                  interval={0}
                  dy={10}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#F1F5F9" }}
                />
                <Bar
                  dataKey="value"
                  fill="url(#batchBarGradient)"
                  radius={[2, 2, 0, 0]}
                  maxBarSize={8}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
