"use client";

import { useCallback, useMemo } from "react";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";

const statusCategories: FilterCategory[] = [
  {
    key: "date",
    label: "By Date",
    type: "dateRange",
  },
  {
    key: "status",
    label: "Status",
    type: "chips",
    multiSelect: false,
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
  isFilterModalOpen: boolean;
  onFilterModalOpenChange: (open: boolean) => void;
  activeFilters: FilterSelections;
  onApplyFilters: (filters: Record<string, string | null>) => void;
  onClearFilters: () => void;
}

export function ResponseTrackingToolbar({
  search,
  onSearchChange,
  isFilterModalOpen,
  onFilterModalOpenChange,
  activeFilters,
  onApplyFilters,
  onClearFilters,
}: ResponseTrackingToolbarProps) {
  const hasActiveFilters = useMemo(() => {
    return Object.values(activeFilters).some((v) => {
      if (Array.isArray(v)) return v.length > 0;
      if (v && typeof v === "object" && "start" in v) return !!(v.start || v.end);

      return v !== null && v !== undefined;
    });
  }, [activeFilters]);

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    const updates: Record<string, string | null> = {
      status: (selections.status as unknown as string) || null,
      from: null,
      to: null,
    };

    if (selections.date && !Array.isArray(selections.date)) {
      if (selections.date.start) updates.from = selections.date.start.toISOString();
      if (selections.date.end) updates.to = selections.date.end.toISOString();
    }

    onApplyFilters(updates);
    onFilterModalOpenChange(false);
  }, [onApplyFilters, onFilterModalOpenChange]);

  return (
    <div className="flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+): Full layout ===== */}
      <div className="hidden w-full items-center justify-between gap-4 lg:flex">
        {/* Left: Search */}
        <div className="relative w-[380px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search student or Lecturer name"
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
          <FilterModalTrigger
            onClick={() => onFilterModalOpenChange(true)}
            label="Filter Option"
            className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
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
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <FilterModalTrigger
            onClick={() => onFilterModalOpenChange(true)}
            label="Filter Option"
            className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
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

        <div className="flex items-center gap-2">
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
          <FilterModalTrigger
            onClick={() => onFilterModalOpenChange(true)}
            label="Filter"
            className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
          />
        </div>
      </div>

      <FilterModal
        open={isFilterModalOpen}
        onOpenChange={onFilterModalOpenChange}
        categories={statusCategories}
        onApply={handleApplyFilters}
        initialSelections={activeFilters}
      />
    </div>
  );
}
