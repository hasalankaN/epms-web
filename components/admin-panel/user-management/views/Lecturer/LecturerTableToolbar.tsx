"use client";

import React, { useState, useCallback, useMemo } from "react";

import { Search, MoreHorizontal, CheckSquare2, X } from "lucide-react";

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

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

// ===== LECTURER-SPECIFIC FILTER DATA =====

const lecturerFilterCategories: FilterCategory[] = [
  {
    key: "date",
    label: "By Date",
    type: "dateRange",
  },
  {
    key: "salaryStatus",
    label: "By Salary Status",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "OVER_DUE", label: "Over Due" },
      { key: "PENDING", label: "Pending" },
      { key: "PAID", label: "Paid" },
    ],
  },
  {
    key: "status",
    label: "By Status",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "ACTIVE", label: "Active" },
      { key: "SUSPENDED", label: "Suspended" },
    ],
  },
];

// ===== TYPES =====

interface LecturerBulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onSendSMS: () => void;
  onSendWhatsapp: () => void;
  onSendEmail: () => void;
}

interface LecturerTableToolbarProps {
  bulkActions: LecturerBulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: Record<string, string | null>) => void;
  onClearFilters: () => void;
  onExportCSV: () => void;
  isExporting?: boolean;
  activeUrlFilters: {
    status?: string;
    salaryStatus?: string;
    from?: string;
    to?: string;
  };
}

// ===== COMPONENT =====

export function LecturerTableToolbar({ 
  bulkActions, 
  selectedCount, 
  totalCount,
  search,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
  onExportCSV,
  isExporting = false,
  activeUrlFilters,
}: LecturerTableToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  
  // Create an initialSelections object based on activeUrlFilters for the FilterModal
  const initialSelections = useMemo(() => {
    const selections: FilterSelections = {};

    if (activeUrlFilters.status) {
      selections.status = activeUrlFilters.status.split(",");
    }

    if (activeUrlFilters.salaryStatus) {
      selections.salaryStatus = activeUrlFilters.salaryStatus.split(",");
    }

    if (activeUrlFilters.from || activeUrlFilters.to) {
      selections.date = {
        start: activeUrlFilters.from ? new Date(activeUrlFilters.from) : null,
        end: activeUrlFilters.to ? new Date(activeUrlFilters.to) : null,
      };
    }

    return selections;
  }, [activeUrlFilters]);

  // Use the activeUrlFilters to track hasActiveFilters
  const hasActiveFilters = 
    !!activeUrlFilters.status || 
    !!activeUrlFilters.salaryStatus || 
    !!activeUrlFilters.from || 
    !!activeUrlFilters.to;

  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  const lecturerBulkActionsWithHandlers: BulkActionItem[] = [
    {
      key: isAllSelected ? "clear" : "selectAll",
      label: isAllSelected ? "Clear Selection" : "Select All",
      onClick: isAllSelected ? bulkActions.onClear : bulkActions.onSelectAll,
    },
    {
      key: "sendSMS",
      label: "Send SMS",
      onClick: bulkActions.onSendSMS,
      disabled: !hasSelection,
    },
    {
      key: "sendWhatsapp",
      label: "Send Whatsapp",
      onClick: bulkActions.onSendWhatsapp,
      disabled: !hasSelection,
    },
    {
      key: "sendEmail",
      label: "Send Email",
      onClick: bulkActions.onSendEmail,
      disabled: !hasSelection,
    },
  ];

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    console.log("Applied filters:", selections);

    // Convert FilterSelections to URL parameters
    const updates: Record<string, string | null> = {
      status: null,
      salaryStatus: null,
      from: null,
      to: null,
    };

    if (selections.status && Array.isArray(selections.status) && selections.status.length > 0) {
      updates.status = selections.status.join(",");
    }

    if (selections.salaryStatus && Array.isArray(selections.salaryStatus) && selections.salaryStatus.length > 0) {
      updates.salaryStatus = selections.salaryStatus.join(",");
    }

    if (selections.date && !Array.isArray(selections.date)) {
      if (selections.date.start) {
        updates.from = selections.date.start.toISOString();
      }

      if (selections.date.end) {
        updates.to = selections.date.end.toISOString();
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
            <BulkActionDropdown items={lecturerBulkActionsWithHandlers} />

            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by Name, Email, Phone Number"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right: Filter + Export CSV */}
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
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
            <button
              className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}
              onClick={onExportCSV}
              disabled={isExporting}
            >
              <i className="file-csv h-4 w-4" />
              {isExporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>

        {/* ===== TABLET (md-lg): Bulk Action + Search left, Filter + Export right ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          {/* Left: Bulk Action + Search */}
          <div className="flex items-center gap-3">
            <BulkActionDropdown items={lecturerBulkActionsWithHandlers} className="min-w-[110px]" />

            <div className="relative w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right: Filter + Export */}
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
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
            <button
              className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap px-3", buttonTextStyles)}
              onClick={onExportCSV}
              disabled={isExporting}
            >
              <i className="file-csv h-4 w-4" />
              {isExporting ? "Exporting..." : "Export CSV"}
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
              placeholder="Search by Name, NIC, Phone Number"
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
                type="button"
                onClick={onClearFilters}
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
              aria-label="Filter lecturers"
            />

            {/* More Actions Dropdown (Export) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(BUTTON_STYLES.outline.md, "px-3")}
                  aria-label="More actions"
                  title="More actions"
                >
                  <MoreHorizontal className="h-4 w-4 text-[#0F172B]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-[160px]">
                <DropdownMenuItem onClick={onExportCSV} disabled={isExporting} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-csv mr-2 h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export CSV"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Action (icon only) */}
            <BulkActionDropdown items={lecturerBulkActionsWithHandlers} iconOnly triggerIcon={CheckSquare2} />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={lecturerFilterCategories}
        onApply={handleApplyFilters}
        initialSelections={initialSelections}
      />
    </>
  );
}
