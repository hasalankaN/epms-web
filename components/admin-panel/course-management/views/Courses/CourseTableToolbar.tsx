"use client";

import React, { useState, useCallback } from "react";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";

import { Input } from "@/components/ui/input";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";

// ===== COURSE-SPECIFIC FILTER DATA (for FilterModal) =====

const courseFilterCategories: FilterCategory[] = [
  { 
    key: "category", 
    label: "By Course Category", 
    type: "chips",
    items: [
      { key: "category1", label: "Category 1" },
      { key: "businessStudies", label: "Business Studies" },
      { key: "category2", label: "Category 2" },
    ],
  },
  { 
    key: "language", 
    label: "By Language", 
    type: "chips",
    items: [
      { key: "english", label: "English" },
      { key: "sinhala", label: "Sinhala" },
      { key: "tamil", label: "Tamil" },
    ],
  },
  { 
    key: "lecturer", 
    label: "By Lecturer", 
    type: "chips",
    items: [
      { key: "mrRuwan", label: "Mr. Ruwan" },
      { key: "missAkarshani", label: "Miss. Akarshani" },
      { key: "mrsTheja", label: "Mrs. Theja" },
      { key: "mrSaadh", label: "Mr. Saadh" },
    ],
  },
  { 
    key: "staff", 
    label: "By Staff", 
    type: "chips",
    items: [
      { key: "kalpa", label: "Kalpa" },
      { key: "supun", label: "Supun" },
      { key: "ruwini", label: "Ruwini" },
      { key: "maneesha", label: "Maneesha" },
    ],
  },
  { 
    key: "status", 
    label: "By Course Status", 
    type: "chips",
    items: [
      { key: "active", label: "Active" },
      { key: "inactive", label: "Inactive" },
    ],
  },
];

// ===== COMPONENT =====

export function CourseTableToolbar() {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterSelections>({});

  // Check if there are any active filters
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    console.log("Applied filters:", selections);
    setActiveFilters(selections);

    // TODO: Implement actual filtering logic
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});

    // TODO: Clear actual filters
  }, []);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+): Search and Filter layout ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          {/* Left: Search */}
          <div className="flex items-center gap-4">
            <div className="relative w-[440px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search By Course Name, Lecturer or Course Category"
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
                onClick={handleClearFilters}
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
            <div className="relative w-[280px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search By Course Name..."
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
                onClick={handleClearFilters}
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

        {/* ===== MOBILE (<md): Search full width, filter button ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          {/* Search - Full width */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search By Course Name, Lecturer or Course Category"
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4"
              )}
            />
          </div>

          {/* Action buttons row: Filter */}
          <div className="flex items-center gap-3">
            {/* Filter (icon only) */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
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
              aria-label="Filter courses"
            />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={courseFilterCategories}
        onApply={handleApplyFilters}
        initialSelections={activeFilters}
      />
    </>
  );
}
