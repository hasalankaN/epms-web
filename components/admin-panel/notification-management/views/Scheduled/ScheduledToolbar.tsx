"use client";

import { useCallback, useMemo } from "react";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";

const scheduledFilterCategories: FilterCategory[] = [
  {
    key: "scheduledOn",
    label: "Scheduled On",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "today", label: "Today" },
      { key: "this-week", label: "This Week" },
      { key: "this-month", label: "This Month" },
      { key: "last-month", label: "Last Month" },
    ],
  },
  {
    key: "scheduledFor",
    label: "Scheduled For",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "today", label: "Today" },
      { key: "this-week", label: "This Week" },
      { key: "this-month", label: "This Month" },
      { key: "next-month", label: "Next Month" },
    ],
  },
  {
    key: "channel",
    label: "Channels",
    type: "chips",
    multiSelect: true,
    items: [
      { key: "sms", label: "SMS" },
      { key: "email", label: "Email" },
      { key: "push", label: "Push" },
    ],
  },
  {
    key: "recipient",
    label: "Recipients",
    type: "chips",
    multiSelect: true,
    items: [
      { key: "all-users", label: "All Users" },
      { key: "students", label: "Students" },
      { key: "staff", label: "Staff" },
      { key: "lecturers", label: "Lecturers" },
      { key: "batches", label: "Batches" },
      { key: "courses", label: "Courses" },
      { key: "referrals", label: "Referrals" },
    ],
  },
];

interface ScheduledToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  isFilterModalOpen: boolean;
  onFilterModalOpenChange: (open: boolean) => void;
  activeFilters: FilterSelections;
  onApplyFilters: (filters: Record<string, string | null>) => void;
  onClearFilters: () => void;
}

export function ScheduledToolbar({
  search,
  onSearchChange,
  isFilterModalOpen,
  onFilterModalOpenChange,
  activeFilters,
  onApplyFilters,
  onClearFilters,
}: ScheduledToolbarProps) {
  const hasActiveFilters = useMemo(() => {
    return Object.values(activeFilters).some((v) => {
      if (Array.isArray(v)) return v.length > 0;

      return v !== null && v !== undefined;
    });
  }, [activeFilters]);

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    const updates: Record<string, string | null> = {
      scheduledOn: (selections.scheduledOn as unknown as string) || null,
      scheduledFor: (selections.scheduledFor as unknown as string) || null,
      channel: (selections.channel as unknown as string[])?.join(",") || null,
      recipient: (selections.recipient as unknown as string[])?.join(",") || null,
    };

    onApplyFilters(updates);
    onFilterModalOpenChange(false);
  }, [onApplyFilters, onFilterModalOpenChange]);

  return (
    <div className="flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+): Full layout ===== */}
      <div className="hidden w-full items-center justify-between gap-4 lg:flex">
        {/* Left: Search */}
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
      <div className="hidden w-full flex-col gap-3 md:flex lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-[240px]">
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
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <FilterModalTrigger
            onClick={() => onFilterModalOpenChange(true)}
            label="Filter Option"
            className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
          />
        </div>
      </div>

      {/* ===== MOBILE (<md): Search full width, scrollable filters below ===== */}
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
        categories={scheduledFilterCategories}
        onApply={handleApplyFilters}
        initialSelections={activeFilters}
      />
    </div>
  );
}
