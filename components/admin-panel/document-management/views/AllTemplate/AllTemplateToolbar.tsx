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

import type { BulkActionItem } from "@/components/common/dropdowns/BulkActionDropdown";
import { BulkActionDropdown } from "@/components/common/dropdowns/BulkActionDropdown";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";

const docTemplateFilterCategories: FilterCategory[] = [
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
  {
    key: "status",
    label: "By Status",
    type: "chips",
    items: [
      { key: "active", label: "Active" },
      { key: "inactive", label: "Inactive" },
    ],
  },
];

interface BulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onIssue: () => void;
}

interface FilterChangeParams {
  search?: string;
  documentType?: string;
  isActive?: boolean;
}

interface AllTemplateToolbarProps {
  bulkActions: BulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
  search: string;
  onSearchChange: (val: string) => void;
  onFilterChange: (params: FilterChangeParams) => void;
}

export function AllTemplateToolbar({
  bulkActions,
  selectedCount,
  totalCount,
  search,
  onSearchChange,
  onFilterChange,
}: AllTemplateToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
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
      key: "issue",
      label: "Issue",
      onClick: bulkActions.onIssue,
      disabled: !hasSelection,
    },
  ];

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    setActiveFilters(selections);

    const docType = (selections.documentType as unknown) as string | undefined;
    const statusKey = (selections.status as unknown) as string | undefined;
    const isActive = statusKey === "active" ? true : statusKey === "inactive" ? false : undefined;

    onFilterChange({ documentType: docType, isActive });
  }, [onFilterChange]);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    onFilterChange({});
  }, [onFilterChange]);

  const searchInput = (placeholder: string, className?: string) => (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
      <Input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder}
        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
      />
    </div>
  );

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+) ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          <div className="flex items-center gap-4">
            <BulkActionDropdown items={bulkItems} />
            {searchInput("Search by document name", "w-[320px]")}
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button type="button" onClick={handleClearFilters} className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}>
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
            <FilterModalTrigger onClick={() => setFilterModalOpen(true)} label="Filter Option" className={cn(hasActiveFilters && BUTTON_STYLES.active.md)} />
          </div>
        </div>

        {/* ===== TABLET (md-lg) ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          <div className="flex items-center gap-3 flex-1">
            <BulkActionDropdown items={bulkItems} className="min-w-[110px]" />
            {searchInput("Search...", "w-full max-w-[260px]")}
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button type="button" onClick={handleClearFilters} className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}>
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
            <FilterModalTrigger onClick={() => setFilterModalOpen(true)} label="Filter" className={cn(hasActiveFilters && BUTTON_STYLES.active.md)} />
          </div>
        </div>

        {/* ===== MOBILE (<md) ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          {searchInput("Search by document name", "w-full")}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button title="Clear Filters" type="button" onClick={handleClearFilters} className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B]")}>
                <X className="h-4 w-4" />
              </button>
            )}
            <FilterModalTrigger onClick={() => setFilterModalOpen(true)} iconOnly className={cn(hasActiveFilters && BUTTON_STYLES.active.md)} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button title="More Options" className={cn(BUTTON_STYLES.outline.md, "px-3")}>
                  <MoreHorizontal className="h-4 w-4 text-[#0F172B]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[160px]">
                <DropdownMenuItem
                  onClick={isAllSelected ? bulkActions.onClear : bulkActions.onSelectAll}
                  className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]"
                >
                  {isAllSelected ? "Clear Selection" : "Select All"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={bulkActions.onIssue}
                  className={cn("cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]", !hasSelection && "text-[#90A1B9] pointer-events-none")}
                >
                  Issue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={docTemplateFilterCategories}
        onApply={handleApplyFilters}
        initialSelections={activeFilters}
      />
    </>
  );
}
