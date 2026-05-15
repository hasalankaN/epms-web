"use client";

import React, { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { FilterChip } from "../shared/FilterChip";

import type { TrendDataPoint } from "@/hooks/api/dashboard/useGetDashboardOverview";

interface TrendsChartProps {
  title?: string;
  className?: string;
  trendData?: TrendDataPoint[];
  selectedDays?: number;
  onFilterChange?: (days: number) => void;
}

const filterOptions = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
  { label: "Last 180 days", value: 180 },
];

const lineColors = {
  Leads: "#22C55E", // Green
  Enrollments: "#F97316", // Orange
  Orders: "#EC4899", // Pink
  Income: "#EAB308", // Yellow
};

export function TrendsChart({
  title = "Trends Graphs",
  className,
  trendData,
  selectedDays = 180,
  onFilterChange,
}: TrendsChartProps) {
  const chartData = trendData ?? [];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedLabel =
    filterOptions.find((opt) => opt.value === selectedDays)?.label ||
    "Last 180 days";

  const handleSelect = (value: number) => {
    onFilterChange?.(value);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col items-center rounded-[8px] border border-[#E2E8F0] bg-transparent p-4 md:p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
        className,
      )}
    >
      {/* Title */}
      <h3 className="self-stretch text-center font-sans text-[14px] md:text-[16px] font-semibold leading-[20px] md:leading-[24px] text-[#0F172B]">
        {title}
      </h3>

      {/* Filter - Dropdown on mobile, Chips on desktop */}
      <div className="mt-2 flex w-full items-center justify-center gap-2 md:gap-3">
        <div className="flex items-center gap-2">
          <i className="filter-icon h-4 w-4 stroke-[#1D293D] stroke-[1.5]" />
          <span className="font-sans text-[12px] font-medium text-[#1D293D]">
            Filter By
          </span>
        </div>

        {/* Mobile/Tablet Dropdown */}
        <div className="relative lg:hidden">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center gap-2 rounded-[42px] border-[0.5px] border-[#F6339A] bg-gradient-to-bl from-[#F8FAFC] to-[#FFCFEA] px-3 py-2 font-sans text-[12px] font-medium leading-[16px] text-[#F6339A] shadow-[4px_4px_10px_0_rgba(2,17,36,0.05)]"
          >
            {selectedLabel}
            <ChevronDown
              className={cn(
                "h-3 w-3 stroke-[#F6339A] stroke-2 transition-transform",
                isDropdownOpen && "rotate-180",
              )}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-[140px] rounded-[8px] border border-[#E2E8F0] bg-white py-1 shadow-lg">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "w-full px-3 py-2 text-left font-sans text-[12px] font-medium leading-[16px] transition-colors hover:bg-[#FDF2F8]",
                    selectedDays === option.value
                      ? "bg-[#FDF2F8] text-[#F6339A]"
                      : "text-[#45556C]",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Chips */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          {filterOptions.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              selected={selectedDays === option.value}
              onClick={() => handleSelect(option.value)}
            />
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-4 md:mt-6 w-full h-[220px] md:h-[300px] md:flex-1 md:min-h-[250px]">
        <ResponsiveContainer width="100%" height={300} debounce={1}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="Leads"
              stroke={lineColors.Leads}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Enrollments"
              stroke={lineColors.Enrollments}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Orders"
              stroke={lineColors.Orders}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Income"
              stroke={lineColors.Income}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
