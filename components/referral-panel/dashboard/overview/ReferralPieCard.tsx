"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";

export interface PieData {
  name: string;
  value: number;
  color: string;
}

interface ReferralPieCardProps {
  title: string;
  dateRange: string;
  data: PieData[];
  className?: string;
}

export function ReferralPieCard({ title, dateRange, data, className }: ReferralPieCardProps) {
  return (
    <div className={cn(
      "flex flex-1 flex-col items-center rounded-lg border border-[#E2E8F0] bg-white shadow-sm transition-all hover:shadow-md",
      className
    )}>
      {/* Header */}
      <div className="flex w-full flex-col items-center gap-1 p-6 pb-4">
        <h3 className="font-sans text-[16px] font-medium leading-[24px] text-[#0F172B]">
          {title}
        </h3>
        <p className="font-sans text-[14px] font-normal leading-[20px] text-[#64748B]">
          {dateRange}
        </p>
      </div>

      {/* Chart */}
      <div className="relative flex h-[200px] w-full items-center justify-center">
        <div className="h-[200px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                }}
                itemStyle={{ color: "#1D293D", fontSize: "12px", fontWeight: 500 }}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={5}
                cornerRadius={10}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legends */}
      <div className="flex w-full flex-wrap items-center justify-center gap-x-[23px] gap-y-4 p-6 pt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="h-3 w-3 rounded-full" 
              style={{ backgroundColor: item.color }} 
            />
            <span className="font-sans text-[14px] font-medium leading-[20px] text-[#979699]">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
