"use client";

import React, { useCallback, useState, useEffect } from "react";

import { Search, X, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";

import type { FilterCategory } from "@/components/common/dropdowns/FilterDropdown";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";

// ===== FILTER DATA =====

const branchTypeFilter: FilterCategory = {
  key: "branch_type",
  label: "Branch Type",
  items: [
    { key: "MAIN", label: "Main" },
    { key: "DEVOTIONAL", label: "Devotional" },
    { key: "CITY", label: "City" },
  ],
};

// ===== TYPES =====

interface BranchToolbarProps {
  onAddBranch: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  branchType: string | null;
  onBranchTypeChange: (value: string | null) => void;
}

// ===== COMPONENT =====

export function BranchToolbar({ 
  onAddBranch, 
  search: externalSearch, 
  onSearchChange, 
  branchType, 
  onBranchTypeChange 
}: BranchToolbarProps) {
  const [localSearch, setLocalSearch] = useState(externalSearch);
  const hasActiveFilters = branchType !== null;

  // Sync internal state with external search (e.g., when clearing filters)
  useEffect(() => {
    setLocalSearch(externalSearch);
  }, [externalSearch]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== externalSearch) {
        onSearchChange(localSearch);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [localSearch, externalSearch, onSearchChange]);

  const handleFilterSelect = useCallback((_categoryKey: string, _itemKey: string, itemLabel: string) => {
    // We map back from label "Type 1" to "TYPE_1" or just use itemKey if they match
    // Based on FilterDropdown usage, it passes the itemLabel as value to the hook usually
    // Let's use itemKey for the actual filter value
    const keyMap: Record<string, string> = {
      "Main": "MAIN",
      "Devotional": "DEVOTIONAL",
      "City": "CITY",
    };

    onBranchTypeChange(keyMap[itemLabel] || itemLabel);
  }, [onBranchTypeChange]);

  const handleClearFilters = useCallback(() => {
    onBranchTypeChange(null);
  }, [onBranchTypeChange]);

  return (
    <div className="flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+) ===== */}
      <div className="hidden w-full items-center justify-between gap-4 lg:flex">
        {/* Left: FilterDropdown + Search */}
        <div className="flex items-center gap-3">
          <FilterDropdown
            categories={[branchTypeFilter]}
            onFilterSelect={handleFilterSelect}
            label="Branch Type"
            value={branchType ? (branchType.charAt(0) + branchType.slice(1).toLowerCase()).replace("_", " ") : null}
          />
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search by branch name"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
            />
          </div>
        </div>

        {/* Right: Clear + New Branch */}
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
          <button
            onClick={onAddBranch}
            className={cn(BUTTON_STYLES.primary.md, "text-sm font-semibold text-white px-3 md:px-4")}
          >
            <span>New Branch</span>
          </button>
        </div>
      </div>

      {/* ===== TABLET (md-lg) ===== */}
      <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
        {/* Left */}
        <div className="flex items-center gap-3">
          <FilterDropdown
            categories={[branchTypeFilter]}
            onFilterSelect={handleFilterSelect}
            label="Branch Type"
            value={branchType ? (branchType.charAt(0) + branchType.slice(1).toLowerCase()).replace("_", " ") : null}
          />
          <div className="relative w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
            />
          </div>
        </div>

        {/* Right */}
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
          <button
            onClick={onAddBranch}
            className={cn(BUTTON_STYLES.primary.md, "text-sm font-semibold text-white px-3")}
          >
            <Plus className="h-5 w-5" />
            <span>New Branch</span>
          </button>
        </div>
      </div>

      {/* ===== MOBILE (<md) ===== */}
      <div className="flex w-full flex-col gap-3 md:hidden">
        {/* Search full width */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search by branch name"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
          />
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
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
            <div className="shrink-0">
              <FilterDropdown
                categories={[branchTypeFilter]}
                onFilterSelect={handleFilterSelect}
                label="Branch Type"
                value={branchType ? (branchType.charAt(0) + branchType.slice(1).toLowerCase()).replace("_", " ") : null}
              />
            </div>
          </div>
          <button
            title="New Branch"
            type="button"
            onClick={onAddBranch}
            className={cn(BUTTON_STYLES.primary.md, "text-sm font-semibold text-white px-3 shrink-0")}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
