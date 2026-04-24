"use client";

import React, { useState } from "react";

import { MoreHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

interface AnalyticsTopBarProps {
  onDateChange?: (start: Date | null, end: Date | null) => void;
  onExport?: () => void;
}

export function AnalyticsTopBar({ onDateChange, onExport }: AnalyticsTopBarProps) {
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  const hasActiveFilters = dateRange.start !== null || dateRange.end !== null;

  const handleDateApply = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
    onDateChange?.(start, end);
  };

  const handleClearFilters = () => {
    setDateRange({ start: null, end: null });
    onDateChange?.(null, null);
  };

  const clearFiltersButton = hasActiveFilters && (
    <button
      title="Clear filters"
      type="button"
      onClick={handleClearFilters}
      className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
    >
      <X className="h-4 w-4" />
      <span className="hidden sm:inline">Clear All</span>
    </button>
  );

  const dateFilter = (
    <DateRangeFilter
      placeholder="Date"
      onApply={handleDateApply}
      initialRange={{
        from: dateRange.start ?? undefined,
        to: dateRange.end ?? undefined,
      }}
      align="end"
    />
  );

  return (
    <div className="flex w-full flex-col">
      {/* ===== DESKTOP (md+) ===== */}
      <div className="hidden w-full items-center justify-end gap-3 md:flex">
        {clearFiltersButton}
        {dateFilter}
        <button
          className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}
          onClick={onExport}
        >
          <i className="file-csv h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* ===== MOBILE (<md) ===== */}
      <div className="flex w-full items-center justify-end gap-2 md:hidden overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {hasActiveFilters && (
          <button
            title="Clear filters"
            type="button"
            onClick={handleClearFilters}
            className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] shrink-0")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="shrink-0">{dateFilter}</div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(BUTTON_STYLES.outline.md, "px-3 shrink-0")}
              aria-label="More actions"
              title="More actions"
            >
              <MoreHorizontal className="h-4 w-4 text-[#0F172B]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px]">
            <DropdownMenuItem onClick={onExport} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
              <i className="file-csv mr-2 h-4 w-4" />
              Export CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
