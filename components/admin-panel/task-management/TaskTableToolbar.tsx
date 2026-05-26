"use client";

import React, { useState, useCallback } from "react";

import { Search, MoreHorizontal, X, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import type { BulkActionItem } from "@/components/common/dropdowns/BulkActionDropdown";
import { BulkActionDropdown } from "@/components/common/dropdowns/BulkActionDropdown";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { AddTaskPanel } from "@/components/admin-panel/task-management/modals/AddTaskPanel";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

// ===== TASK-SPECIFIC FILTER DATA =====
const taskFilterCategories: FilterCategory[] = [
  {
    key: "date",
    label: "By Date",
    type: "dateRange",
  },
  {
    key: "status",
    label: "By Task Status",
    type: "chips",
    items: [
      { key: "COMPLETED", label: "Completed" },
      { key: "PENDING", label: "Pending" },
    ],
  },
  {
    key: "type",
    label: "By Task Type",
    type: "chips",
    items: [
      { key: "STAFF", label: "Staff" },
      { key: "BATCH", label: "Batch" },
    ],
  },
];

// ===== TYPES =====
interface BulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onDelete: () => void;
}

interface TaskTableToolbarProps {
  bulkActions: BulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeFilters: FilterSelections;
  onFiltersChange: (filters: FilterSelections) => void;
}

// ===== COMPONENT =====
export function TaskTableToolbar({
  bulkActions,
  selectedCount,
  totalCount,
  searchValue,
  onSearchChange,
  activeFilters,
  onFiltersChange,
}: TaskTableToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  const taskBulkActionsWithHandlers: BulkActionItem[] = [
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
    onFiltersChange(selections);
  }, [onFiltersChange]);

  const handleClearFilters = useCallback(() => {
    onFiltersChange({});
  }, [onFiltersChange]);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+): Full layout ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          {/* Left: Bulk Action + Search */}
          <div className="flex items-center gap-4">
            <BulkActionDropdown items={taskBulkActionsWithHandlers} />

            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by task name"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right: Filter + New Task */}
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
            <button onClick={() => setIsAddPanelOpen(true)} className={cn(BUTTON_STYLES.primary.md, "whitespace-nowrap", buttonTextStyles, "text-white")}>
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>
        </div>

        {/* ===== TABLET (md-lg): Bulk Action + Search left, Filter + New Task right ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          {/* Left: Bulk Action + Search*/}
          <div className="flex items-center gap-3 flex-1">
            <BulkActionDropdown items={taskBulkActionsWithHandlers} className="min-w-[110px]" />

            <div className="relative w-full max-w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right: Filter + New Task */}
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
            <button onClick={() => setIsAddPanelOpen(true)} className={cn(BUTTON_STYLES.primary.md, "whitespace-nowrap", buttonTextStyles, "text-white")}>
              <Plus className="h-4 w-4" />
              New Task
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
              placeholder="Search by task name"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4"
              )}
            />
          </div>

          {/* Action buttons row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B]")}
                  title="Clear Filters"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <FilterModalTrigger
                onClick={() => setFilterModalOpen(true)}
                iconOnly
                className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
              />

              {/* More Actions Dropdown (Bulk Delete) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button title="More Actions" className={cn(BUTTON_STYLES.outline.md, "px-3")}>
                    <MoreHorizontal className="h-4 w-4 text-[#0F172B]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[160px]">
                  <DropdownMenuItem
                    onClick={bulkActions.onSelectAll}
                    className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]"
                  >
                    Select All
                  </DropdownMenuItem>
                  {hasSelection && (
                    <DropdownMenuItem
                      onClick={bulkActions.onClear}
                      className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]"
                    >
                      Clear Selection
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={() => hasSelection && setDeleteModalOpen(true)}
                    className={cn(
                      "cursor-pointer focus:bg-red-50",
                      hasSelection ? "text-red-600 hover:bg-red-50 focus:text-red-600" : "text-[#90A1B9] pointer-events-none"
                    )}
                  >
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* New Task — icon on small mobile, text on wider */}
            <button title="New Task" onClick={() => setIsAddPanelOpen(true)} className={cn(BUTTON_STYLES.primary.md, "whitespace-nowrap", "text-white flex items-center gap-2")}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline text-[14px] font-semibold">New Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={taskFilterCategories}
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
        description={`Are you sure you want to delete ${selectedCount} selected task(s)? This action cannot be undone.`}
      />

      <AddTaskPanel
        isOpen={isAddPanelOpen}
        onClose={() => setIsAddPanelOpen(false)}
      />
    </>
  );
}
