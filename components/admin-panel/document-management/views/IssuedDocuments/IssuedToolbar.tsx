"use client";

/* eslint-disable padding-line-between-statements */

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

import type { BulkActionItem } from "@/components/common/dropdowns/BulkActionDropdown";
import { BulkActionDropdown } from "@/components/common/dropdowns/BulkActionDropdown";
import type {
  FilterCategory,
  FilterSelections,
} from "@/components/common/filters/FilterModal";
import {
  FilterModal,
  FilterModalTrigger,
} from "@/components/common/filters/FilterModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

const buttonTextStyles =
  "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

const issuedDocFilterCategories: FilterCategory[] = [
  {
    key: "date",
    label: "By Date",
    type: "dateRange",
  },
  {
    key: "documentType",
    label: "By Document Type",
    type: "chips",
    items: [
      { key: "TRANSCRIPT", label: "Transcript" },
      { key: "ENVELOPE_LETTER", label: "Envelope Letter" },
      { key: "ID", label: "ID" },
      { key: "ENROLLMENT_LETTER", label: "Enrollment Letter" },
      { key: "APPLICATION_FORM", label: "Application Form" },
      { key: "OTHER", label: "Other" },
    ],
  },
];

interface BulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onDelete: () => void;
}

interface FilterChangeParams {
  documentType?: string;
  issuedFrom?: string;
  issuedTo?: string;
}

interface IssuedToolbarProps {
  bulkActions: BulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
  search: string;
  onSearchChange: (val: string) => void;
  onFilterChange: (params: FilterChangeParams) => void;
  isBulkDeleting?: boolean;
}

export function IssuedToolbar({
  bulkActions,
  selectedCount,
  totalCount,
  search,
  onSearchChange,
  onFilterChange,
  isBulkDeleting = false,
}: IssuedToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterSelections>({});

  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  const bulkItems: BulkActionItem[] = [
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

  const handleApplyFilters = useCallback(
    (selections: FilterSelections) => {
      setActiveFilters(selections);

      const docType = Array.isArray(selections.documentType)
        ? (selections.documentType[0] as string)
        : undefined;
      const dateFrom = (selections.date as any)?.from
        ? new Date((selections.date as any).from).toISOString().split("T")[0]
        : undefined;
      const dateTo = (selections.date as any)?.to
        ? new Date((selections.date as any).to).toISOString().split("T")[0]
        : undefined;

      onFilterChange({
        documentType: docType,
        issuedFrom: dateFrom,
        issuedTo: dateTo,
      });
    },
    [onFilterChange],
  );

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    onFilterChange({
      documentType: undefined,
      issuedFrom: undefined,
      issuedTo: undefined,
    });
  }, [onFilterChange]);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+) ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          <div className="flex items-center gap-4">
            <BulkActionDropdown items={bulkItems} />
            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by document name"
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4",
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className={cn(
                  BUTTON_STYLES.outline.md,
                  "border-dashed text-[#64748B] hover:text-[#0F172B]",
                )}
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
            <button
              className={cn(
                BUTTON_STYLES.outline.md,
                "whitespace-nowrap",
                buttonTextStyles,
              )}
            >
              Export
            </button>
          </div>
        </div>

        {/* ===== TABLET (md-lg) ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          <div className="flex items-center gap-3 flex-1">
            <BulkActionDropdown items={bulkItems} className="min-w-[110px]" />
            <div className="relative w-full max-w-[260px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search..."
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4",
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className={cn(
                  BUTTON_STYLES.outline.md,
                  "border-dashed text-[#64748B] hover:text-[#0F172B]",
                )}
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
            <button
              className={cn(
                BUTTON_STYLES.outline.md,
                "whitespace-nowrap",
                buttonTextStyles,
              )}
            >
              Export
            </button>
          </div>
        </div>

        {/* ===== MOBILE (<md) ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by document name"
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4",
              )}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  title="Clear Filters"
                  type="button"
                  onClick={handleClearFilters}
                  className={cn(
                    BUTTON_STYLES.outline.md,
                    "px-3 border-dashed text-[#64748B] hover:text-[#0F172B]",
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <FilterModalTrigger
                onClick={() => setFilterModalOpen(true)}
                iconOnly
                className={cn(hasActiveFilters && BUTTON_STYLES.active.md)}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    title="More Options"
                    className={cn(BUTTON_STYLES.outline.md, "px-3")}
                  >
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
                      hasSelection
                        ? "text-red-600 hover:bg-red-50 focus:text-red-600"
                        : "text-[#90A1B9] pointer-events-none",
                    )}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <button
              className={cn(
                BUTTON_STYLES.outline.md,
                "whitespace-nowrap",
                buttonTextStyles,
              )}
            >
              Export
            </button>
          </div>
        </div>
      </div>

      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={issuedDocFilterCategories}
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
        description={`Are you sure you want to delete ${selectedCount} selected record(s)? This action cannot be undone.`}
        isDeleting={isBulkDeleting}
      />
    </>
  );
}
