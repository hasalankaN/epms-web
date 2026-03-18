"use client";

import React, { useState } from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { FilterChip } from "@/components/admin-panel/dashboard/overview/students-courses/shared/FilterChip";

const filterOptions = [
  { label: "Last 7 days", value: 7 },
  { label: "Last 30 days", value: 30 },
  { label: "Last 90 days", value: 90 },
];

export function FinanceFilterRow() {
  const [selectedFilter, setSelectedFilter] = useState(30);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedLabel = filterOptions.find(opt => opt.value === selectedFilter)?.label || "Last 30 days";

  return (
    <div className="mt-4 flex w-full items-center gap-2 md:gap-3">
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
  );
}
