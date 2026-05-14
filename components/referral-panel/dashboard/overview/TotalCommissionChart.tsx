"use client";

import React, { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { FilterChip } from "@/components/admin-panel/dashboard/overview/students-courses/shared/FilterChip";

const filterOptions = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
  { label: "Last 180 days", value: 180 },
];

const data = [
  { name: "Jan", courses: 2500, batches: 2300, products: 1300 },
  { name: "Feb", courses: 3000, batches: 2800, products: 1800 },
  { name: "Mar", courses: 2000, batches: 2200, products: 1100 },
  { name: "Apr", courses: 1700, batches: 3000, products: 500 },
  { name: "May", courses: 2700, batches: 2400, products: 1500 },
  { name: "Jun", courses: 2400, batches: 2400, products: 1200 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex w-[195px] flex-col gap-[6px] rounded-[0.375rem] border border-[#E5E7EB] bg-white p-[6px_10px] shadow-[2px_2px_12px_0_rgba(2,17,36,0.08)]">
        <p className="font-sans text-[12px] font-medium leading-[16px] text-[#111827]">
          {label === "Jan" ? "2025-01-28" : 
           label === "Feb" ? "2025-02-28" :
           label === "Mar" ? "2025-03-28" :
           label === "Apr" ? "2025-04-28" :
           label === "May" ? "2025-05-28" : "2025-06-28"}
        </p>
        <div className="flex flex-col gap-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="h-[11px] w-[4px] rounded-[0.125rem]" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-sans text-[12px] font-normal leading-[16px] text-[#6B7280]">
                  {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}
                </span>
              </div>
              <span className="font-sans text-[12px] font-medium leading-[16px] text-[#111827]">
                {entry.value.toLocaleString()} LKR
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return null;
};

export function TotalCommissionChart() {
  const [selectedFilter, setSelectedFilter] = useState(180);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedLabel = filterOptions.find(opt => opt.value === selectedFilter)?.label || "Last 180 days";

  return (
    <div className="flex w-full flex-col rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3">
          <h3 className="font-sans text-[14px] font-medium leading-[20px] text-[#0F172B] sm:text-[16px] sm:leading-[24px]">
            Total Commissions
          </h3>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <i className="filter-icon h-4 w-4 stroke-[#1D293D]" />
              <span className="font-sans text-[11px] font-medium text-[#1D293D] sm:text-[12px]">
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
                  className="w-auto min-w-[90px] px-3"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Metrics */}
        <div className="flex flex-wrap items-center gap-4 border-t border-[#F1F5F9] pt-4 lg:border-t-0 lg:pt-0">
          <div className="flex min-w-[100px] flex-col">
            <span className="font-sans text-[11px] font-medium leading-[14px] text-[#90A1B9] sm:text-[12px] sm:leading-[16px]">
              Total
            </span>
            <span className="font-sans text-[16px] font-semibold leading-[24px] text-[#E60076] sm:text-[18px] sm:leading-[30px]">
              LKR XX,XXX
            </span>
          </div>
          
          <div className="hidden h-8 w-[1px] bg-[#E2E8F0] md:block" />
          
          <div className="grid flex-1 grid-cols-3 gap-4 sm:flex sm:items-center sm:gap-6">
            <div className="flex flex-col">
              <span className="font-sans text-[11px] font-medium leading-[14px] text-[#90A1B9] sm:text-[12px] sm:leading-[16px]">
                Courses
              </span>
              <span className="font-sans text-[14px] font-semibold leading-[20px] text-[#1D293D] sm:text-[18px] sm:leading-[30px]">
                X,XXX
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-[11px] font-medium leading-[14px] text-[#90A1B9] sm:text-[12px] sm:leading-[16px]">
                Batches
              </span>
              <span className="font-sans text-[14px] font-semibold leading-[20px] text-[#1D293D] sm:text-[18px] sm:leading-[30px]">
                X,XXX
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-sans text-[11px] font-medium leading-[14px] text-[#90A1B9] sm:text-[12px] sm:leading-[16px]">
                Product
              </span>
              <span className="font-sans text-[14px] font-semibold leading-[20px] text-[#1D293D] sm:text-[18px] sm:leading-[30px]">
                X,XXX
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Part */}
      <div className="mt-6 flex h-[280px] w-full flex-col sm:mt-8 sm:h-[352px]">
        <div className="h-[220px] w-full sm:h-[270px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid vertical={false} stroke="#E2E8F0" strokeWidth={1} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94A3B8", fontSize: 10 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#94A3B8", fontSize: 10 }}
                tickFormatter={(value) => `${value / 1000}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="courses"
                stroke="#16A34A"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#16A34A", stroke: "#fff", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="batches"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#F59E0B", stroke: "#fff", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="products"
                stroke="#2563EB"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#2563EB", stroke: "#fff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legends */}
        <div className="mt-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-2 pt-4 sm:pb-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#16A34A] sm:h-3 sm:w-3" />
            <span className="font-sans text-[12px] font-medium leading-[16px] text-[#979699] sm:text-[14px] sm:leading-[20px]">
              Courses
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#F59E0B] sm:h-3 sm:w-3" />
            <span className="font-sans text-[12px] font-medium leading-[16px] text-[#979699] sm:text-[14px] sm:leading-[20px]">
              Batches
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#2563EB] sm:h-3 sm:w-3" />
            <span className="font-sans text-[12px] font-medium leading-[16px] text-[#979699] sm:text-[14px] sm:leading-[20px]">
              Products
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
