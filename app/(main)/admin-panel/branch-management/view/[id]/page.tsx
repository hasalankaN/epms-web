"use client";

import React, { useState, useCallback } from "react";

import { useParams } from "next/navigation";

import { FileText, X } from "lucide-react";

import { BackButton } from "@/components/common/BackButton";

import { BUTTON_STYLES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";

import { BranchDetailsView } from "@/components/admin-panel/branch-management/view/BranchDetailsView";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";

const dateFilterCategories: FilterCategory[] = [
  { 
    key: "date", 
    label: "By Date", 
    type: "dateRange",
  },
];

export default function ViewBranchPage() {
  const params = useParams();
  const id = params.id as string;

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
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between px-4 pt-6 md:px-6">
        <BackButton 
            href="/admin-panel/branch-management" 
            label="Go to Branch Management" 
        />
        
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <>
              {/* Desktop Clear */}
              <button
                type="button"
                onClick={handleClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B] hidden sm:flex")}
              >
                <X className="h-4 w-4" />
                Clear
              </button>
              {/* Mobile Clear (Icon Only) */}
              <button
                type="button"
                onClick={handleClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] sm:hidden")}
                aria-label="Clear filters"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Desktop Filter */}
          <div className="hidden sm:block">
            <FilterModalTrigger
              onClick={() => setFilterModalOpen(true)}
              label="Filter Option"
              className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
            />
          </div>
          {/* Mobile Filter (Icon Only) */}
          <div className="sm:hidden">
            <FilterModalTrigger
              onClick={() => setFilterModalOpen(true)}
              iconOnly
              className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
            />
          </div>

          <button className={BUTTON_STYLES.primary.responsive}>
             <FileText className="h-5 w-5 sm:hidden" />
             <span className="hidden sm:inline">Generate Report</span>
          </button>
        </div>
      </div>

      <div className="pb-10">
        <BranchDetailsView branchId={id} />
      </div>

      {/* Shared Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={dateFilterCategories}
        onApply={handleApplyFilters}
        initialSelections={activeFilters}
      />
    </div>
  );
}
