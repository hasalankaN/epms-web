"use client";

import React, { useCallback, useState } from "react";

import { Search, X, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";

import { Input } from "@/components/ui/input";
import type { FilterCategory } from "@/components/common/dropdowns/FilterDropdown";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusFilterCategory: FilterCategory = {
  key: "status",
  label: "Profit or Loss Status",
  items: [
    { key: "Profited", label: "Profited" },
    { key: "Loss", label: "Loss" },
  ],
};

interface ProfitLossToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string | null;
  onStatusFilterChange: (status: string | null) => void;
  onClearFilters: () => void;
}

export function ProfitLossToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onClearFilters,
}: ProfitLossToolbarProps) {
  const [hasDateFilter, setHasDateFilter] = useState(false);
  const [clearKey, setClearKey] = useState(0);

  const hasActiveFilters = hasDateFilter || statusFilter !== null || search !== "";

  const handleClearAll = useCallback(() => {
    onClearFilters();
    setHasDateFilter(false);
    setClearKey((k) => k + 1);
  }, [onClearFilters]);

  const handleFilterSelect = useCallback(
    (categoryKey: string, itemKey: string) => {
      if (categoryKey === "status") {
        onStatusFilterChange(itemKey);
      }
    },
    [onStatusFilterChange]
  );

  const dateFilter = (
    <DateRangeFilter
      key={clearKey}
      placeholder="By Date"
      onApply={(start, end) => setHasDateFilter(start !== null || end !== null)}
    />
  );

  return (
    <div className="mt-4 flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+) ===== */}
      <div className="hidden w-full items-center justify-between gap-4 lg:flex">
        <div className="relative w-[320px]">
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
              title="clear filters"
              type="button"
              onClick={handleClearAll}
              className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
            >
              <X className="h-4 w-4" />
              Clear All
            </button>
          )}

          {dateFilter}

          <FilterDropdown
            categories={[statusFilterCategory]}
            onFilterSelect={handleFilterSelect}
            label="Profit or Loss Status"
            value={statusFilterCategory.items.find(i => i.key === statusFilter)?.label || null}
          />

          <button
            className={cn(
              BUTTON_STYLES.outline.md,
              "gap-[8px] whitespace-nowrap text-[14px] font-semibold leading-[20px] text-[#0F172B]"
            )}
          >
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
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
            />
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                title="clear filters"
                type="button"
                onClick={handleClearAll}
                className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {dateFilter}

            <FilterDropdown
              categories={[statusFilterCategory]}
              onFilterSelect={handleFilterSelect}
              label="Status"
              value={statusFilterCategory.items.find(i => i.key === statusFilter)?.label || null}
            />

            <button
              className={cn(
                BUTTON_STYLES.outline.md,
                "gap-[8px] whitespace-nowrap text-[14px] font-semibold leading-[20px] text-[#0F172B] px-3"
              )}
            >
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
            placeholder="Search..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
          />
        </div>

        <div className="flex items-center justify-between gap-2 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div className="flex items-center gap-2 flex-1 justify-end">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearAll}
                className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] shrink-0")}
                title="Clear Filters"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <div className="shrink-0">{dateFilter}</div>

            <div className="shrink-0">
              <FilterDropdown
                categories={[statusFilterCategory]}
                onFilterSelect={handleFilterSelect}
                label="Status"
                value={statusFilterCategory.items.find(i => i.key === statusFilter)?.label || null}
              />
            </div>

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
                <DropdownMenuItem onClick={() => console.log("Export CSV")} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-csv mr-2 h-4 w-4" />
                  Export CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
