"use client";

import React, { useState, useCallback } from "react";

import { Search, MoreHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";

import { Input } from "@/components/ui/input";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

// ===== COURSE-SPECIFIC FILTER DATA =====

const courseStudentFilterCategories: FilterCategory[] = [
  { 
    key: "date", 
    label: "By Date", 
    type: "dateRange",
  },
  { 
    key: "certificateStatus", 
    label: "By Certificate Status", 
    type: "chips",
    items: [
      { key: "issued", label: "Issued" },
      { key: "notIssued", label: "Not Issued" },
    ],
  },
  { 
    key: "paymentStatus", 
    label: "By Payment Status", 
    type: "chips",
    items: [
      { key: "paid", label: "Paid" },
      { key: "pending", label: "Pending" },
    ],
  },
  { 
    key: "paymentType", 
    label: "By Payment Type", 
    type: "chips",
    items: [
      { key: "complete", label: "Complete" },
      { key: "installment", label: "Installment" },
    ],
  },
  { 
    key: "studentStatus", 
    label: "By Student Status", 
    type: "chips",
    items: [
      { key: "active", label: "Active" },
      { key: "hold", label: "Hold" },
      { key: "dropped", label: "Dropped" },
    ],
  },
  { 
    key: "gender", 
    label: "By Gender", 
    type: "chips",
    items: [
      { key: "male", label: "Male" },
      { key: "female", label: "Female" },
    ],
  },
  { 
    key: "district", 
    label: "By District", 
    type: "chips",
    items: [
      { key: "negombo", label: "Negombo" },
      { key: "anuradhapura", label: "Anuradhapura" },
      { key: "galle", label: "Galle" },
    ],
  },
];

// ===== COMPONENT =====

export function CourseStudentToolbar() {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterSelections>({});

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    console.log("Applied filters:", selections);
    setActiveFilters(selections);
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+): Search left, Filter + Export CSV right ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          {/* Left: Search (full width since no bulk action) */}
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-[480px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by student name, Student ID or Phone Number"
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right: Filter + CSV */}
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
          {/* Left: Search */}
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-full max-w-[320px]">
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
            <button className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}>
              <i className="file-csv h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* ===== MOBILE (<md): Search full width, action buttons row ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          {/* Search - Full width */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search by student name, Student ID or Phone Number"
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

            {/* More Actions Dropdown (CSV only) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button title="More Actions" className={cn(BUTTON_STYLES.outline.md, "px-3")}>
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
        categories={courseStudentFilterCategories}
        onApply={handleApplyFilters}
        initialSelections={activeFilters}
      />
    </>
  );
}
