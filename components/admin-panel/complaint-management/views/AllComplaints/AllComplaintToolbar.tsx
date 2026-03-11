"use client";

import React, { useState, useCallback } from "react";

import { Search, CheckSquare2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";
import type { BulkActionItem } from "@/components/common/dropdowns/BulkActionDropdown";
import { BulkActionDropdown } from "@/components/common/dropdowns/BulkActionDropdown";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

// ===== COMPLAINT-SPECIFIC FILTER DATA =====

const complaintFilterCategories: FilterCategory[] = [
  {
    key: "date",
    label: "By Date",
    type: "dateRange",
  },
  {
    key: "complainType",
    label: "By Complain Type",
    type: "chips",
    items: [
      { key: "request", label: "Request" },
      { key: "complaint", label: "Complaint" },
    ],
  },
  {
    key: "assignee",
    label: "By Assignee",
    type: "chips",
    items: [
      { key: "staff1", label: "Staff Member 1" },
      { key: "staff2", label: "Staff Member 2" },
      { key: "staff3", label: "Staff Member 3" },
      { key: "staff4", label: "Staff Member 4" },
    ],
  },
  {
    key: "complainStatus",
    label: "By Complain Status",
    type: "chips",
    items: [
      { key: "inProgress", label: "In Progress" },
      { key: "pending", label: "Pending" },
      { key: "completed", label: "Completed" },
    ],
  },
];

// ===== TYPES =====

interface BulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onDelete: () => void;
}

interface AllComplaintToolbarProps {
  bulkActions: BulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
}

// ===== COMPONENT =====

export function AllComplaintToolbar({ bulkActions, selectedCount, totalCount }: AllComplaintToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterSelections>({});

  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  const bulkActionItems: BulkActionItem[] = [
    {
      key: isAllSelected ? "clear" : "selectAll",
      label: isAllSelected ? "Clear Selection" : "Select All",
      onClick: isAllSelected ? bulkActions.onClear : bulkActions.onSelectAll,
    },
    {
      key: "delete",
      label: "Delete",
      variant: "danger",
      onClick: () => setDeleteModalOpen(true),
      disabled: !hasSelection,
    },
  ];

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
          {/* Left: Bulk Action + Search */}
          <div className="flex items-center gap-4">
            <BulkActionDropdown items={bulkActionItems} />
            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by ID"
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
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

        {/* ===== TABLET (md–lg) ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          <div className="flex items-center gap-3">
            <BulkActionDropdown items={bulkActionItems} className="min-w-[110px]" />
            <div className="relative w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search..."
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
              />
            </div>
          </div>

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
            <FilterModalTrigger
              onClick={() => setFilterModalOpen(true)}
              label="Filter"
              className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
            />
          </div>
        </div>

        {/* ===== MOBILE (<md) ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search by ID"
              className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
            />
          </div>

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
              aria-label="Filter complaints"
            />

            <BulkActionDropdown items={bulkActionItems} iconOnly triggerIcon={CheckSquare2} />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={complaintFilterCategories}
        onApply={handleApplyFilters}
        initialSelections={activeFilters}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          bulkActions.onDelete();
          setDeleteModalOpen(false);
        }}
        title="Confirm Bulk Deletion"
        description={`Are you sure you want to delete ${selectedCount} selected complaint(s)? This action cannot be undone.`}
      />
    </>
  );
}
