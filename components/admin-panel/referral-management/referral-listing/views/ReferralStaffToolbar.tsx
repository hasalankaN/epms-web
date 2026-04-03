"use client";

import React, { useState, useCallback, useMemo } from "react";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";

import { Input } from "@/components/ui/input";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";
import { DISTRICTS } from "@/lib/constants/districts";

const referralFilterCategories: FilterCategory[] = [
  {
    key: "district",
    label: "District",
    type: "chips",
    multiSelect: false,
    items: DISTRICTS.map((d) => ({ key: d, label: d })),
  },
  {
    key: "status",
    label: "Status",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "ACTIVE", label: "Active" },
      { key: "INACTIVE", label: "Inactive" },
    ],
  },
];

interface ReferralStaffToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: Record<string, string | null>) => void;
  onClearFilters: () => void;
  activeUrlFilters: {
    status?: string;
    district?: string;
  };
}

export function ReferralStaffToolbar({
  search,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
  activeUrlFilters,
}: ReferralStaffToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const initialSelections = useMemo(() => {
    const selections: FilterSelections = {};

    if (activeUrlFilters.status) {
      selections.status = [activeUrlFilters.status];
    }

    if (activeUrlFilters.district) {
      selections.district = [activeUrlFilters.district];
    }

    return selections;
  }, [activeUrlFilters]);

  const hasActiveFilters = !!activeUrlFilters.status || !!activeUrlFilters.district || !!search;

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    const updates: Record<string, string | null> = {
      status: null,
      district: null,
    };

    if (selections.status && Array.isArray(selections.status) && selections.status.length > 0) {
      updates.status = selections.status[0] as string;
    }

    if (selections.district && Array.isArray(selections.district) && selections.district.length > 0) {
      updates.district = selections.district[0] as string;
    }

    onApplyFilters(updates);
    setFilterModalOpen(false);
  }, [onApplyFilters]);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+): Full layout ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          {/* Left: Search */}
          <div className="flex items-center gap-4">
            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by name"
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

          {/* Right: Filter */}
          <div className="flex items-center gap-3">
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
              onClick={() => setFilterModalOpen(true)}
              label="Filter Option"
              className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
            />
          </div>
        </div>

        {/* ===== TABLET (md-lg): Search left, Filter right ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          {/* Left: Search */}
          <div className="flex items-center gap-3">
            <div className="relative w-[200px]">
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
          </div>

          {/* Right: Filter */}
          <div className="flex items-center gap-3">
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
              onClick={() => setFilterModalOpen(true)}
              label="Filter"
              className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
            />
          </div>
        </div>

        {/* ===== MOBILE (<md): Search full width, action buttons row ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          {/* Search - Full width */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4"
              )}
            />
          </div>

          {/* Action buttons row */}
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B]")}
                aria-label="Clear filters"
                title="Clear filters"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <FilterModalTrigger
              onClick={() => setFilterModalOpen(true)}
              iconOnly
              className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
              aria-label="Filter"
            />
          </div>
        </div>
      </div>

      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={referralFilterCategories}
        initialSelections={initialSelections}
        onApply={handleApplyFilters}
      />
    </>
  );
}
