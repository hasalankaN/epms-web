"use client";

import React, { useState, useCallback, useMemo } from "react";

import { Search, CheckSquare2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";
import type { BulkActionItem } from "@/components/common/dropdowns/BulkActionDropdown";
import { BulkActionDropdown } from "@/components/common/dropdowns/BulkActionDropdown";
import type { FilterCategory as DropdownFilterCategory } from "@/components/common/dropdowns/FilterDropdown";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";

// ===== COMPLAINT-SPECIFIC FILTER DATA =====

const complainStatusFilter: DropdownFilterCategory = {
  key: "status",
  label: "Complain Status",
  items: [
    { key: "PENDING", label: "Pending" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "COMPLETED", label: "Completed" },
  ],
};


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
  search: string;
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: Record<string, string | null>) => void;
  onClearFilters: () => void;
  activeUrlFilters: {
    status?: string;
    type?: string;
    assignee?: string;
    date_start?: string;
    date_end?: string;
  };
}

// ===== COMPONENT =====

export function AllComplaintToolbar({
  bulkActions,
  selectedCount,
  totalCount,
  search,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
  activeUrlFilters,
}: AllComplaintToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch staff list for assignee filter
  const { data: staffData } = useGetStaff({ page: 1, size: 100 });

  const staffItems = useMemo(() => {
    return (staffData?.results || []).map((staff) => ({
      key: staff.userId,
      label: `${staff.firstName} ${staff.lastName}`,
    }));
  }, [staffData]);

  const modalCategories = useMemo((): FilterCategory[] => {
    return [
      {
        key: "date",
        label: "By Date",
        type: "dateRange",
      },
      {
        key: "type",
        label: "By Complain Type",
        type: "chips",
        multiSelect: false,
        items: [
          { key: "REQUEST", label: "Request" },
          { key: "COMPLAINT", label: "Complaint" },
        ],
      },
      {
        key: "assignee",
        label: "By Assignee",
        type: "chips",
        multiSelect: false,
        items: staffItems,
      },
    ];
  }, [staffItems]);

  const initialSelections = useMemo(() => {
    const selections: FilterSelections = {};

    if (activeUrlFilters.assignee) {
      selections.assignee = activeUrlFilters.assignee.split(",");
    }

    if (activeUrlFilters.type) {
      selections.type = activeUrlFilters.type.split(",");
    }

    if (activeUrlFilters.date_start || activeUrlFilters.date_end) {
      selections.date = {
        start: activeUrlFilters.date_start ? new Date(activeUrlFilters.date_start) : null,
        end: activeUrlFilters.date_end ? new Date(activeUrlFilters.date_end) : null,
      };
    }

    return selections;
  }, [activeUrlFilters]);

  const isModalActive = 
    !!activeUrlFilters.type || 
    !!activeUrlFilters.assignee || 
    !!activeUrlFilters.date_start || 
    !!activeUrlFilters.date_end;

  const isAnyFilterActive = isModalActive || !!activeUrlFilters.status;

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

  const handleFilterSelect = useCallback((categoryKey: string, itemKey: string) => {
    onApplyFilters({ [categoryKey]: itemKey });
  }, [onApplyFilters]);

  const handleApplyModalFilters = useCallback((selections: FilterSelections) => {
    const updates: Record<string, string | null> = {
      assignee: null,
      type: null,
      date_start: null,
      date_end: null,
    };

    if (selections.assignee && Array.isArray(selections.assignee) && selections.assignee.length > 0) {
      updates.assignee = selections.assignee[0];
    }

    if (selections.type && Array.isArray(selections.type) && selections.type.length > 0) {
      updates.type = selections.type[0];
    }

    if (selections.date && !Array.isArray(selections.date)) {
      if (selections.date.start) {
        const d = selections.date.start;

        updates.date_start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }

      if (selections.date.end) {
        const d = selections.date.end;

        updates.date_end = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }
    }

    onApplyFilters(updates);
  }, [onApplyFilters]);

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
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
              />
            </div>
          </div>

          {/* Right: Filters */}
          <div className="flex items-center gap-3">
            {isAnyFilterActive && (
              <button
                type="button"
                onClick={onClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
                Clear All
              </button>
            )}
            <FilterDropdown
              categories={[complainStatusFilter]}
              onFilterSelect={handleFilterSelect}
              label="Complain Status"
              value={complainStatusFilter.items.find(i => i.key === activeUrlFilters.status)?.label || null}
            />
            <FilterModalTrigger
              onClick={() => setFilterModalOpen(true)}
              label="Filter Option"
              className={cn(isModalActive && BUTTON_STYLES.active.md)}
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
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAnyFilterActive && (
              <button
                title="Clear Filters"
                type="button"
                onClick={onClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <FilterDropdown
              categories={[complainStatusFilter]}
              onFilterSelect={handleFilterSelect}
              label="Status"
              value={complainStatusFilter.items.find(i => i.key === activeUrlFilters.status)?.label || null}
            />
            <FilterModalTrigger
              onClick={() => setFilterModalOpen(true)}
              label="Filter"
              className={cn(isModalActive && BUTTON_STYLES.active.md)}
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
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {isAnyFilterActive && (
              <button
                title="Clear Filters"
                type="button"
                onClick={onClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] shrink-0")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            <div className="shrink-0">
              <FilterDropdown
                categories={[complainStatusFilter]}
                onFilterSelect={handleFilterSelect}
                label="Status"
                value={complainStatusFilter.items.find(i => i.key === activeUrlFilters.status)?.label || null}
              />
            </div>

            <div className="shrink-0">
              <FilterModalTrigger
                onClick={() => setFilterModalOpen(true)}
                iconOnly
                className={cn(isModalActive && BUTTON_STYLES.active.md)}
                aria-label="Filter complaints"
              />
            </div>

            <div className="shrink-0">
              <BulkActionDropdown items={bulkActionItems} iconOnly triggerIcon={CheckSquare2} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={modalCategories}
        onApply={handleApplyModalFilters}
        initialSelections={initialSelections}
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
