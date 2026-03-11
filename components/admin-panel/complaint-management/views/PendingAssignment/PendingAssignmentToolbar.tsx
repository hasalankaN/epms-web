"use client";

import React, { useState, useCallback } from "react";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";
import type { FilterCategory } from "@/components/common/dropdowns/FilterDropdown";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";

// ===== FILTER DATA =====

const complainTypeFilter: FilterCategory = {
  key: "complainType",
  label: "Complain Type",
  items: [
    { key: "request", label: "Request" },
    { key: "complaint", label: "Complaint" },
  ],
};

// ===== COMPONENT =====

export function PendingAssignmentToolbar() {
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [hasDateFilter, setHasDateFilter] = useState(false);
  const [clearKey, setClearKey] = useState(0);

  const hasActiveFilters = hasDateFilter || typeFilter !== null;

  const handleClearFilters = useCallback(() => {
    setTypeFilter(null);
    setHasDateFilter(false);
    setClearKey((k) => k + 1);
  }, []);

  const handleFilterSelect = useCallback((_categoryKey: string, _itemKey: string, itemLabel: string) => {
    setTypeFilter(itemLabel);
  }, []);

  const dateFilter = (
    <DateRangeFilter
      key={clearKey}
      placeholder="Pick a date"
      onApply={(start, end) => setHasDateFilter(start !== null || end !== null)}
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
            value={typeFilter}
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
            value={typeFilter}
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
              value={typeFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
