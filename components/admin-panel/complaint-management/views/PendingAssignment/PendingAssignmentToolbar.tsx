"use client";

import React, { useState, useCallback } from "react";

import { Search, X } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";
import type { FilterCategory } from "@/components/common/dropdowns/FilterDropdown";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";

// ===== FILTER DATA =====

const complainTypeFilter: FilterCategory = {
  key: "type",
  label: "Complain Type",
  items: [
    { key: "REQUEST", label: "Request" },
    { key: "COMPLAINT", label: "Complaint" },
  ],
};

// ===== TYPES =====

interface PendingAssignmentToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: Record<string, string | null>) => void;
  onClearFilters: () => void;
  activeUrlFilters: {
    type?: string;
    date_start?: string;
    date_end?: string;
  };
}

// ===== COMPONENT =====

export function PendingAssignmentToolbar({
  search,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
  activeUrlFilters,
}: PendingAssignmentToolbarProps) {
  const [clearKey, setClearKey] = useState(0);

  const hasActiveFilters = !!activeUrlFilters.type || !!activeUrlFilters.date_start || !!activeUrlFilters.date_end;

  const handleClearFilters = useCallback(() => {
    onClearFilters();
    setClearKey((k) => k + 1);
  }, [onClearFilters]);

  const handleFilterSelect = useCallback((key: string, _itemKey: string) => {
    // We expect "REQUEST" or "COMPLAINT" as keys but previous logic used label?
    // Let's use _itemKey which should be REQUEST/COMPLAINT
    onApplyFilters({ [key]: _itemKey });
  }, [onApplyFilters]);

  const handleDateApply = useCallback((start: Date | null, end: Date | null) => {
    onApplyFilters({
      date_start: start ? format(start, "yyyy-MM-dd") : null,
      date_end: end ? format(end, "yyyy-MM-dd") : null,
    });
  }, [onApplyFilters]);

  // Sync clearKey if external clear happens? 
  // Probably better to just rely on props stability.

  const dateFilter = (
    <DateRangeFilter
      key={clearKey}
      placeholder="Pick a date"
      initialRange={{
        from: activeUrlFilters.date_start ? new Date(activeUrlFilters.date_start) : undefined,
        to: activeUrlFilters.date_end ? new Date(activeUrlFilters.date_end) : undefined,
      }}
      onApply={handleDateApply}
    />
  );

  return (
    <div className="flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+) ===== */}
      <div className="hidden w-full items-center justify-between gap-4 lg:flex">
        {/* Left: Search */}
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search by ID"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
          />
        </div>

        {/* Right: Filters */}
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
            >
              <X className="h-4 w-4" />
              Clear All
            </button>
          )}
          {dateFilter}
          <FilterDropdown
            categories={[complainTypeFilter]}
            onFilterSelect={handleFilterSelect}
            label="Complain Type"
            value={activeUrlFilters.type ? (activeUrlFilters.type === "REQUEST" ? "Request" : "Complaint") : null}
          />
        </div>
      </div>

      {/* ===== TABLET (md–lg) ===== */}
      <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
        <div className="relative w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
          />
        </div>

        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
             title="Clear Filters"
              type="button"
              onClick={handleClearFilters}
              className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {dateFilter}
          <FilterDropdown
            categories={[complainTypeFilter]}
            onFilterSelect={handleFilterSelect}
            label="Complain Type"
            value={activeUrlFilters.type ? (activeUrlFilters.type === "REQUEST" ? "Request" : "Complaint") : null}
          />
        </div>
      </div>

      {/* ===== MOBILE (<md) ===== */}
      <div className="flex w-full flex-col gap-3 md:hidden">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search by ID"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {hasActiveFilters && (
            <button
              title="Clear Filters"
              type="button"
              onClick={handleClearFilters}
              className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] shrink-0")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="shrink-0">{dateFilter}</div>
          <div className="shrink-0">
            <FilterDropdown
              categories={[complainTypeFilter]}
              onFilterSelect={handleFilterSelect}
              label="Complain Type"
              value={activeUrlFilters.type ? (activeUrlFilters.type === "REQUEST" ? "Request" : "Complaint") : null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
