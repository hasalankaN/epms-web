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

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface CommonPieChartProps {
  title?: string;
  dateRange?: string;
  data: PieChartData[];
  className?: string;
  showTotal?: boolean;
}

// Custom label component for external labels with lines
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderCustomLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, name, value } = props;
  const RADIAN = Math.PI / 180;

  // Dot position - ON the chart edge
  const dotX = cx + outerRadius * Math.cos(-midAngle * RADIAN);
  const dotY = cy + outerRadius * Math.sin(-midAngle * RADIAN);

  // Line extends radially outward from dot (following the slice angle)
  const lineLength = 30;
  const lineEndX = cx + (outerRadius + lineLength) * Math.cos(-midAngle * RADIAN);
  const lineEndY = cy + (outerRadius + lineLength) * Math.sin(-midAngle * RADIAN);

  // Text position - slightly beyond line end
  const textRadius = outerRadius + lineLength + 8;
  const textX = cx + textRadius * Math.cos(-midAngle * RADIAN);
  const textY = cy + textRadius * Math.sin(-midAngle * RADIAN);

  // Text anchor based on position
  const isRightSide = textX > cx;
  const textAnchor = isRightSide ? "start" : "end";

  return (
    <g>
      {/* Dot on the chart edge */}
      <circle cx={dotX} cy={dotY} r={4} fill="#0F172B" />

      {/* Line extending radially outward */}
      <line
        x1={dotX}
        y1={dotY}
        x2={lineEndX}
        y2={lineEndY}
        stroke="#0F172B"
        strokeWidth={1}
      />

      {/* Legend name */}
      <text
        x={textX}
        y={textY - 6}
        textAnchor={textAnchor}
        fill="#0F172B"
        className="font-sans text-[12px] font-medium"
      >
        {name}
      </text>

      {/* Count value */}
      <text
        x={textX}
        y={textY + 10}
        textAnchor={textAnchor}
        fill="#64748B"
        className="font-sans text-[12px] font-normal"
      >
        {value}
      </text>
    </g>
  );
};

export function CommonPieChart({
  title,
  dateRange,
  data,
  className,
  showTotal = true,
}: CommonPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center min-w-0 rounded-[8px] border border-[#E2E8F0] bg-transparent p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
        className
      )}
    >
      {/* Title */}
      {title && (
        <h3 className="self-stretch text-center font-sans text-[16px] font-semibold leading-[24px] text-[#0F172B]">
          {title}
        </h3>
      )}
      {/* Date range */}
      {dateRange && (
        <p className="self-stretch text-center font-sans text-[14px] font-normal leading-[20px] text-[#90A1B9]">
          {dateRange}
        </p>
      )}

      {/* Pie Chart */}
      <div className="relative mt-6 h-[300px] w-full min-h-[300px]">
        {/* Center label */}
        {showTotal && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
            <p className="font-sans text-[14px] font-medium text-[#314158]">Total</p>
            <p className="font-sans text-[16px] font-semibold text-[#0F172B]">{total}</p>
          </div>
        )}

        <ResponsiveContainer width="100%" height={300} debounce={1}>
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
              itemStyle={{ color: "#1D293D", fontSize: "12px", fontWeight: 500 }}
              formatter={(value: any) => [`${value}`, "Count"]}
            />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
