"use client";

import React, { useState, useCallback } from "react";

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
import type { ExportItem } from "@/components/common/dropdowns/ExportDropdown";
import { ExportDropdown } from "@/components/common/dropdowns/ExportDropdown";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

// ===== BATCH-SPECIFIC FILTER DATA =====

const batchExportItems: ExportItem[] = [
  { key: "csv", label: "Export CSV", icon: (() => <i className="file-csv h-4 w-4" />) as any, onClick: () => console.log("Export CSV") },
];

const batchFilterCategories: FilterCategory[] = [
  { 
    key: "date", 
    label: "By Date", 
    type: "dateRange",
  },
  { 
    key: "type", 
    label: "Batch Type", 
    type: "chips",
    items: [
      { key: "diploma", label: "Diploma" },
      { key: "hnd", label: "HND" },
      { key: "degree", label: "Degree" },
    ],
  },
  { 
    key: "level", 
    label: "Batch Level", 
    type: "chips",
    items: [
      { key: "beginner", label: "Beginner" },
      { key: "advanced", label: "Advanced" },
    ],
  },
  { 
    key: "status", 
    label: "Batch Status", 
    type: "chips",
    items: [
      { key: "active", label: "Active" },
      { key: "upcoming", label: "Upcoming" },
      { key: "completed", label: "Completed" },
      { key: "inactive", label: "Inactive" },
    ],
  },
  { 
    key: "category", 
    label: "Batch Category", 
    type: "chips",
    items: [
      { key: "online", label: "Online" },
      { key: "onSite", label: "On-Site" },
      { key: "hybrid", label: "Hybrid" },
    ],
  },
  { 
    key: "payment", 
    label: "Batch Payment", 
    type: "chips",
    items: [
      { key: "paid", label: "Paid" },
      { key: "free", label: "Free" },
    ],
  },
  { 
    key: "branches", 
    label: "By Branches", 
    type: "chips",
    items: [
      { key: "main", label: "Main" },
      { key: "negombo", label: "Negombo" },
      { key: "anuradhapura", label: "Anuradhapura" },
      { key: "galle", label: "Galle" },
    ],
  },
  { 
    key: "lecturer", 
    label: "Lecturer", 
    type: "chips",
    items: [
      { key: "mrRuwan", label: "Mr. Ruwan" },
      { key: "missAkarshani", label: "Miss. Akarshani" },
      { key: "mrsTheja", label: "Mrs. Theja" },
      { key: "mrSaadh", label: "Mr. Saadh" },
    ],
  },
];

// batchExportItems removed as unused

// ===== TYPES =====

interface BulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onSendSMS: () => void;
  onSendEmail: () => void;
  onDelete: () => void;
}

interface BatchTableToolbarProps {
  bulkActions?: BulkActionsHandlers; // Optional for now until fully integrated
  selectedCount?: number;
  totalCount?: number;
}

// ===== COMPONENT =====

export function BatchTableToolbar({ 
  bulkActions = {
    onSelectAll: () => console.log("Select All"),
    onClear: () => console.log("Clear"),
    onSendSMS: () => console.log("SMS"),
    onSendEmail: () => console.log("Email"),
    onDelete: () => console.log("Delete"),
  }, 
  selectedCount = 0, 
  totalCount = 0 
}: BatchTableToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterSelections>({});

  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  const batchBulkActionsWithHandlers: BulkActionItem[] = [
    { 
      key: isAllSelected ? "clear" : "selectAll", 
      label: isAllSelected ? "Clear Selection" : "Select All", 
      onClick: isAllSelected ? bulkActions.onClear : bulkActions.onSelectAll 
    },
    { 
      key: "sendSMS", 
      label: "Send SMS", 
      onClick: bulkActions.onSendSMS,
      disabled: !hasSelection 
    },
    { 
      key: "sendEmail", 
      label: "Send Email", 
      onClick: bulkActions.onSendEmail,
      disabled: !hasSelection 
    },
    { 
      key: "delete", 
      label: "Delete", 
      variant: "danger", 
      onClick: () => setDeleteModalOpen(true),
      disabled: !hasSelection 
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
            <BulkActionDropdown items={batchBulkActionsWithHandlers} />

            <div className="relative w-[450px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by Batch Name, ID, Category, Lecturer Name"
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  "w-full border border-[#E2E8F0] pl-10 pr-4"
                )}
              />
            </div>
          </div>

          {/* Right: Filter + PDF + CSV (separate buttons) */}
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

        {/* ===== TABLET (md-lg): Bulk Action + Search left, Filter + Export dropdown right ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          {/* Left: Bulk Action + Search */}
          <div className="flex items-center gap-3">
            <BulkActionDropdown items={batchBulkActionsWithHandlers} className="min-w-[110px]" />

            <div className="relative w-[200px]">
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
            <ExportDropdown items={batchExportItems} />
          </div>
        </div>

        {/* ===== MOBILE (<md): Search full width, action buttons row ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          {/* Search - Full width */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search by Batch Name, ID, Category, Lecturer Name"
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4"
              )}
            />
          </div>

          {/* Action buttons row: Filter + More + Bulk */}
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

            {/* More Actions Dropdown (PDF/CSV) */}
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

            {/* Bulk Action (icon only) */}
            <BulkActionDropdown items={batchBulkActionsWithHandlers} iconOnly triggerIcon={CheckSquare2} />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={batchFilterCategories}
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
        description={`Are you sure you want to delete ${selectedCount} selected batches? This action cannot be undone.`}
      />
    </>
  );
}
