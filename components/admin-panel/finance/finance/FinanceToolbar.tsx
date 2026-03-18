"use client";

import React, { useState, useCallback } from "react";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

export function FinanceToolbar() {
  const [hasDateFilter, setHasDateFilter] = useState(false);
  const [clearKey, setClearKey] = useState(0);

  const hasActiveFilters = hasDateFilter;

  const handleClearFilters = useCallback(() => {
    setHasDateFilter(false);
    setClearKey((k) => k + 1);
  }, []);

  const dateFilter = (
    <DateRangeFilter
      key={clearKey}
      placeholder="By Date"
      onApply={(start, end) => setHasDateFilter(start !== null || end !== null)}
    />
  );

  return (
    <div className="mt-4 flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+): Full layout ===== */}
      <div className="hidden w-full items-center justify-between gap-4 lg:flex">
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search by Reference ID or Name"
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
          />
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              title="clear filters"
              type="button"
              onClick={handleClearFilters}
              className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
            >
              <X className="h-4 w-4" />
              Clear All
            </button>
          )}

          {dateFilter}

          <button className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}>
            <i className="file-csv h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ===== TABLET (md-lg) ===== */}
      <div className="hidden w-full flex-col gap-4 md:flex lg:hidden">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search..."
              className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
            />
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                title="clear filters"
                type="button"
                onClick={handleClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {dateFilter}

            <button className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap px-3", buttonTextStyles)}>
              <i className="file-csv h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* ===== MOBILE (<md) ===== */}
      <div className="flex w-full flex-col gap-3 md:hidden">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search by ID or Name"
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] shrink-0")}
              title="Clear Filters"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="shrink-0">{dateFilter}</div>

          <div className="shrink-0">
            <button className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap px-3", buttonTextStyles)}>
              <i className="file-csv h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
