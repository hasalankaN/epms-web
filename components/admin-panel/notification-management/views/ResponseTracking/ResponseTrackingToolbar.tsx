"use client";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import type { FilterCategory } from "@/components/common/dropdowns/FilterDropdown";
import { HorizontalScrollContainer } from "@/components/common/HorizontalScrollContainer";

const statusCategories: FilterCategory[] = [
  {
    key: "status",
    label: "Status",
    items: [
      { key: "responded", label: "Responded" },
      { key: "pending", label: "Pending" },
      { key: "over-due", label: "Over Due" },
    ],
  },
];

interface ResponseTrackingToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusValue: string | null;
  onFilterSelect: (key: string, value: string, label: string) => void;
  onDateApply: (start: Date | null, end: Date | null) => void;
  onClearFilters?: () => void;
  fromDate?: Date;
  toDate?: Date;
}

export function ResponseTrackingToolbar({
  search,
  onSearchChange,
  statusValue,
  onFilterSelect,
  onDateApply,
  onClearFilters,
  fromDate,
  toDate,
}: ResponseTrackingToolbarProps) {
  const hasActiveFilters = !!(statusValue || fromDate || toDate);

  return (
    <div className="flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+): Full layout ===== */}
      <div className="hidden w-full items-center justify-between gap-4 lg:flex">
        {/* Left: Search */}
        <div className="relative w-[380px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search by student name or Lecturer name"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              AUTH_INPUT.base,
              AUTH_INPUT.placeholder,
              "w-full border border-[#E2E8F0] pl-10 pr-4"
            )}
          />
        </div>

        {/* Right: Filters */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
          <DateRangeFilter
            placeholder="Date"
            onApply={onDateApply}
            initialRange={fromDate || toDate ? { from: fromDate, to: toDate } : undefined}
          />
          <FilterDropdown
            categories={statusCategories}
            label="Status"
            value={statusValue}
            onFilterSelect={onFilterSelect}
          />
        </div>
      </div>

      {/* ===== TABLET (md-lg): Condensed layout ===== */}
      <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
        <div className="relative w-[280px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              AUTH_INPUT.base,
              AUTH_INPUT.placeholder,
              "w-full border border-[#E2E8F0] pl-10 pr-4"
            )}
          />
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
              aria-label="Clear filters"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <DateRangeFilter
            placeholder="Date"
            onApply={onDateApply}
            initialRange={fromDate || toDate ? { from: fromDate, to: toDate } : undefined}
          />
          <FilterDropdown
            categories={statusCategories}
            label="Status"
            value={statusValue}
            onFilterSelect={onFilterSelect}
          />
        </div>
      </div>

      {/* ===== MOBILE (<md): Search full width, action row below ===== */}
      <div className="flex w-full flex-col gap-3 md:hidden">
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

        <HorizontalScrollContainer className="w-full pb-2">
          <div className="flex min-w-max items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] shrink-0")}
                aria-label="Clear filters"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="shrink-0">
              <DateRangeFilter
                placeholder="Date"
                onApply={onDateApply}
                initialRange={fromDate || toDate ? { from: fromDate, to: toDate } : undefined}
              />
            </div>
            <div className="shrink-0">
              <FilterDropdown
                categories={statusCategories}
                label="Status"
                value={statusValue}
                onFilterSelect={onFilterSelect}
              />
            </div>
          </div>
        </HorizontalScrollContainer>
      </div>
    </div>
  );
}
