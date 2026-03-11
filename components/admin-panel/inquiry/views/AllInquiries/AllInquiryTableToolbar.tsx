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

// ===== INQUIRY-SPECIFIC FILTER DATA (for FilterModal) =====

const inquiryFilterCategories: FilterCategory[] = [
  { 
    key: "date", 
    label: "By Date", 
    type: "dateRange",
  },
  { 
    key: "assignee", 
    label: "By Assignee", 
    type: "chips",
    items: [
      { key: "kalpa", label: "Kalpa" },
      { key: "supun", label: "Supun" },
      { key: "ruwini", label: "Ruwini" },
      { key: "maneesha", label: "Maneesha" },
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
    key: "district", 
    label: "By District", 
    type: "chips",
    items: [
      { key: "colombo", label: "Colombo" },
      { key: "negombo", label: "Negombo" },
      { key: "anuradhapura", label: "Anuradhapura" },
      { key: "galle", label: "Galle" },
    ],
  },
  { 
    key: "interest", 
    label: "By Interest", 
    type: "chips",
    items: [
      { key: "digitalMarketing", label: "Digital Marketing" },
      { key: "uiux", label: "UI UX" },
      { key: "korean", label: "Korean" },
      { key: "englishLang", label: "English Lang." },
      { key: "mathematics", label: "Mathematics" },
    ],
  },
  { 
    key: "status", 
    label: "By Status", 
    type: "chips",
    items: [
      { key: "noResponse", label: "No Response" },
      { key: "completed", label: "Completed" },
      { key: "pending", label: "Pending" },
      { key: "inProgress", label: "In Progress" },
    ],
  },
  { 
    key: "sources", 
    label: "By Sources", 
    type: "chips",
    items: [
      { key: "web", label: "Web" },
      { key: "byAdmin", label: "By Admin" },
    ],
  },
  { 
    key: "followUp", 
    label: "By Follow Up Date", 
    type: "dateRange",
  },
];

const inquiryExportItems: ExportItem[] = [
  { key: "pdf", label: "Print PDF", icon: (() => <i className="file-pdf h-4 w-4" />) as any, onClick: () => console.log("Print PDF") },
  { key: "csv", label: "Export CSV", icon: (() => <i className="file-csv h-4 w-4" />) as any, onClick: () => console.log("Export CSV") },
];

// ===== TYPES =====

interface BulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onSendSMS: () => void;
  onSendWhatsapp: () => void;
  onSendEmail: () => void;
  onDelete: () => void;
}

interface AllInquiryTableToolbarProps {
  bulkActions: BulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
}

// ===== COMPONENT =====

export function AllInquiryTableToolbar({ bulkActions, selectedCount, totalCount }: AllInquiryTableToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterSelections>({});

  // Check if there are any active filters
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  // Build bulk action items with handlers from props
  const inquiryBulkActionsWithHandlers: BulkActionItem[] = [
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
      key: "sendWhatsapp", 
      label: "Send Whatsapp", 
      onClick: bulkActions.onSendWhatsapp,
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
      onClick: () => setDeleteModalOpen(true), // Intercept provided onDelete logic
      disabled: !hasSelection 
    },
  ];

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    console.log("Applied filters:", selections);
    setActiveFilters(selections);

    // TODO: Implement actual filtering logic
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});

    // TODO: Clear actual filters
  }, []);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+): Full layout ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          {/* Left: Bulk Action + Search */}
          <div className="flex items-center gap-4">
            <BulkActionDropdown items={inquiryBulkActionsWithHandlers} />

            <div className="relative w-[320px]">
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
              <i className="file-pdf h-4 w-4" />
              Print PDF
            </button>
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
            <BulkActionDropdown items={inquiryBulkActionsWithHandlers} className="min-w-[110px]" />

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
            <ExportDropdown items={inquiryExportItems} />
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

          {/* Action buttons row: Filter + More + Bulk */}
          <div className="flex items-center gap-3">
            {/* Filter (icon only) */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
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
              aria-label="Filter inquiries"
            />

            {/* More Actions Dropdown (PDF/CSV) */}
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
                <DropdownMenuItem onClick={() => console.log("Print PDF")} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-pdf mr-2 h-4 w-4" />
                  Print PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Export CSV")} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-csv mr-2 h-4 w-4" />
                  Export CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Action (icon only) */}
            <BulkActionDropdown items={inquiryBulkActionsWithHandlers} iconOnly triggerIcon={CheckSquare2} />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={inquiryFilterCategories}
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
        description={`Are you sure you want to delete ${selectedCount} selected enquiries? This action cannot be undone.`}
      />
    </>
  );
}
