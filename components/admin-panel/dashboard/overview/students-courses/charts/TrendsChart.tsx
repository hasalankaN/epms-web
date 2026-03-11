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

interface TrendsChartProps {
  title?: string;
  className?: string;
}

const filterOptions = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
  { label: "Last 180 days", value: 180 },
];

// Dummy data for the trends chart
const trendData = [
  { month: "Jan", Leads: 30, Enrollments: 45, Orders: 20, Income: 60 },
  { month: "Feb", Leads: 50, Enrollments: 35, Orders: 40, Income: 75 },
  { month: "Mar", Leads: 35, Enrollments: 55, Orders: 30, Income: 50 },
  { month: "Apr", Leads: 60, Enrollments: 40, Orders: 50, Income: 85 },
  { month: "May", Leads: 45, Enrollments: 65, Orders: 35, Income: 70 },
  { month: "Jun", Leads: 55, Enrollments: 50, Orders: 45, Income: 90 },
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
}: TrendsChartProps) {
  const [selectedFilter, setSelectedFilter] = useState(180);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedLabel = filterOptions.find(opt => opt.value === selectedFilter)?.label || "Last 180 days";

  return (
    <div
      className={cn(
        "relative flex flex-1 flex-col items-center rounded-[8px] border border-[#E2E8F0] bg-transparent p-4 md:p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
        className
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
                isDropdownOpen && "rotate-180"
              )}
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-[140px] rounded-[8px] border border-[#E2E8F0] bg-white py-1 shadow-lg">
              {filterOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedFilter(option.value);
                    setIsDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left font-sans text-[12px] font-medium leading-[16px] transition-colors hover:bg-[#FDF2F8]",
                    selectedFilter === option.value
                      ? "bg-[#FDF2F8] text-[#F6339A]"
                      : "text-[#45556C]"
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
              selected={selectedFilter === option.value}
              onClick={() => setSelectedFilter(option.value)}
            />
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative mt-4 md:mt-6 w-full h-[220px] md:h-[300px] md:flex-1 md:min-h-[250px]">
        <ResponsiveContainer width="100%" height={300} debounce={1}>
          <LineChart 
            data={trendData} 
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
