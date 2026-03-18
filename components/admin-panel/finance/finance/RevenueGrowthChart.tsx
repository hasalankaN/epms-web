"use client";

import React, { useMemo } from "react";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const generateDummyData = () => {
  const data = [];
  const start = new Date(2025, 3, 1); // April 1st, 2025

  for (let i = 0; i < 91; i++) {
    const current = new Date(start);

    current.setDate(start.getDate() + i);

    const value = Math.floor(Math.random() * 500000) + 100000;
    
    const month = current.getMonth(); // 3 = Apr, 4 = May, 5 = Jun
    const d = current.getDate();
    let displayDate = "";
    
    // Exact labels from user screenshot
    if (month === 3 && [1, 4, 9, 15, 21, 27].includes(d)) displayDate = `Apr ${d}`;
    if (month === 4 && [3, 9, 15, 21, 27].includes(d)) displayDate = `May ${d}`;
    if (month === 5 && [2, 7, 12, 18, 24, 30].includes(d)) displayDate = `Jun ${d}`;

    data.push({
      date: `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`,
      displayDate,
      value
    });
  }

  return data;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm">
        <p className="mb-2 text-xs font-semibold text-[#1D293D]">{payload[0].payload.date}</p>
        <div className="flex items-center gap-2">
          <div className="h-[10px] w-[3px] rounded-sm bg-[#EC4899]" />
          <p className="text-xs font-medium text-[#64748B]">Day Revenue</p>
          <p className="text-xs font-semibold text-[#0F172B]">
            {payload[0].value.toLocaleString()} LKR
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export function RevenueGrowthChart() {
  const data = useMemo(() => generateDummyData(), []);

  return (
    <div className="mt-6 flex w-full flex-col overflow-hidden rounded-[8px] border border-[#E2E8F0] bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row">
        {/* Header Left (Revenue Growth) */}
        <div className="flex flex-1 flex-col justify-center gap-[4px] border-b-[0.895px] border-[#E2E8F0] p-[24px]">
          <h3 className="font-inter text-[18px] font-semibold leading-[30px] text-[#111827]">
            Revenue Growth
          </h3>
          <p className="font-inter text-[12px] font-normal leading-[16px] text-[#6B7280]">
            1st April - 30th June, 2025
          </p>
        </div>
        {/* Header Right (Revenue Calculated) */}
        <div className="flex flex-col items-start gap-[4px] border-b-[0.895px] border-[#E2E8F0] bg-[#F8FAFC] px-[28.641px] py-[21.48px] md:min-w-[280px] md:border-l-[0.895px]">
          <p className="font-inter text-[12px] font-medium leading-[16px] text-[#374151]">
            Revenue Calculated
          </p>
          <p className="font-inter text-[32px] font-semibold leading-[38px] text-[#111827]">
            LKR 159,800,582
          </p>
        </div>
      </div>
      
      {/* Chart */}
      <div className="flex w-full flex-col p-[24px]">
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
                <XAxis 
                  dataKey="displayDate" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "#64748B", fontSize: 11, fontWeight: 500 }} 
                  interval={0}
                  dy={10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F1F5F9' }} />
                <Bar 
                  dataKey="value" 
                  fill="url(#barGradient)" 
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
