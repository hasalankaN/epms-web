"use client";

import React, { useState, useCallback } from "react";

import { Search, MoreHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import type { ExportItem } from "@/components/common/dropdowns/ExportDropdown";
import { ExportDropdown } from "@/components/common/dropdowns/ExportDropdown";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

// ===== ENROLL-SPECIFIC FILTER DATA =====

const enrollExportItems: ExportItem[] = [
  { key: "csv", label: "Export CSV", icon: (() => <i className="file-csv h-4 w-4" />) as any, onClick: () => console.log("Export CSV") },
];

const enrollFilterCategories: FilterCategory[] = [
  { 
    key: "date", 
    label: "By Date", 
    type: "dateRange",
  },
  { 
    key: "type", 
    label: "Enrollment Type", 
    type: "chips",
    items: [
      { key: "direct", label: "Direct" },
      { key: "referral", label: "Referral" },
    ],
  },
  { 
    key: "status", 
    label: "Status", 
    type: "chips",
    items: [
      { key: "onGoing", label: "On Going" },
      { key: "pending", label: "Pending" },
      { key: "completed", label: "Completed" },
      { key: "hold", label: "Hold" },
      { key: "dropped", label: "Dropped" },
    ],
  },
  { 
    key: "scope", 
    label: "Batch or Course", 
    type: "chips",
    items: [
      { key: "course", label: "Course" },
      { key: "batch", label: "Batch" },
    ],
  },
];

export function EnrollTableToolbar() {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterSelections>({});

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    setActiveFilters(selections);
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+): Full layout ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          {/* Left: Search Bar only (no bulk dropdown) */}
          <div className="flex w-full items-center gap-4">
            <div className="relative w-full max-w-[450px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by Name, NIC, Phone Number"
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right: Filter + CSV (separate buttons) */}
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
            <button className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}>
              <i className="file-csv h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* ===== TABLET (md-lg): Search left, Filter + Export dropdown right ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          {/* Left: Search Bar */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-full max-w-[350px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search..."
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right: Filter + Export Dropdown */}
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
            <ExportDropdown items={enrollExportItems} />
          </div>
        </div>

        {/* ===== MOBILE (<md): Search full width, action buttons row ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          {/* Search - Full width */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search by Student Name, ID, Phone"
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4"
              )}
            />
          </div>

          {/* Action buttons row: Filter + More */}
          <div className="flex items-center gap-3">
            {/* Filter (icon only) */}
            {hasActiveFilters && (
              <button
                title="Clear Filters"
                type="button"
                onClick={handleClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <FilterModalTrigger
              onClick={() => setFilterModalOpen(true)}
              iconOnly
              className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
            />

            {/* More Actions Dropdown (CSV) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button title="More Options" className={cn(BUTTON_STYLES.outline.md, "px-3")}>
                  <MoreHorizontal className="h-4 w-4 text-[#0F172B]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[160px]">
                <DropdownMenuItem onClick={() => console.log("Export CSV")} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-csv mr-2 h-4 w-4" />
                  Export CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={enrollFilterCategories}
        onApply={handleApplyFilters}
        initialSelections={activeFilters}
      />
    </>
  );
}
