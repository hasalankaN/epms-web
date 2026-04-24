"use client";

import React from "react";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import type { FilterCategory } from "@/components/common/dropdowns/FilterDropdown";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";

interface ReportByCoursesSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
  extraFilter?: {
    type?: "dropdown" | "date";
    label: string;
    categories?: FilterCategory[];
    onSelect?: (category: string, item: string, label: string) => void;
    onDateApply?: (start: Date | null, end: Date | null) => void;
    onClear?: () => void;
    value: string | null;
  };
}

export function ReportByCoursesSearch({ search, onSearchChange, extraFilter }: ReportByCoursesSearchProps) {
  const hasActiveFilter = extraFilter && extraFilter.value !== null;

  const filterElement = extraFilter && (
    <div className="flex items-center gap-2 shrink-0">
      {hasActiveFilter && (
        <button
          title="clear filters"
          type="button"
          onClick={extraFilter.onClear}
          className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B] px-3")}
        >
          <X className="h-4 w-4" />
          <span className="hidden md:inline">Clear</span>
        </button>
      )}
      <div className="shrink-0">
        {extraFilter.type === "date" ? (
          <DateRangeFilter 
            placeholder={extraFilter.label}
            onApply={extraFilter.onDateApply}
            align="end"
          />
        ) : (
          <FilterDropdown
            categories={extraFilter.categories || []}
            onFilterSelect={extraFilter.onSelect || (() => {})}
            label={extraFilter.label}
            value={extraFilter.value}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-6 flex w-full flex-col gap-3">
      {/* ===== DESKTOP/TABLET (md+): Row Layout ===== */}
      <div className="hidden w-full items-center gap-3 md:flex">
        {filterElement}
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              AUTH_INPUT.base,
              AUTH_INPUT.placeholder,
              "w-full border border-[#E2E8F0] pl-10 pr-4"
            )}
          />
        </div>
      </div>

      {/* ===== MOBILE (<md): FinanceToolbar responsive pattern ===== */}
      <div className="flex w-full flex-col gap-3 md:hidden">
        {/* Search on top */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              AUTH_INPUT.base,
              AUTH_INPUT.placeholder,
              "w-full border border-[#E2E8F0] pl-10 pr-4"
            )}
          />
        </div>

        {/* Filters below (scrollable if needed) */}
        {filterElement && (
          <div className="flex items-center justify-end gap-2 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {filterElement}
          </div>
        )}
      </div>
    </div>
  );
}
