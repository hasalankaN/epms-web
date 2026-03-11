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
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";
import { IssueCertificateModal } from "@/components/common/IssueCertificateModal";
import { IssueDocumentModal } from "@/components/common/IssueDocumentModal";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

// ===== STUDENT-SPECIFIC FILTER DATA =====

const studentFilterCategories: FilterCategory[] = [
  {
    key: "date",
    label: "By Date",
    type: "dateRange",
  },
  {
    key: "studentStatus",
    label: "By Student Status",
    type: "chips",
    items: [
      { key: "active", label: "Active" },
      { key: "inactive", label: "Inactive" },
    ],
  },
  {
    key: "certificateStatus",
    label: "By Certificate Status",
    type: "chips",
    items: [
      { key: "pending", label: "Pending" },
      { key: "completed", label: "Completed" },
    ],
  },
  {
    key: "paymentStatus",
    label: "By Payment Status",
    type: "chips",
    items: [
      { key: "pending", label: "Pending" },
      { key: "completed", label: "Completed" },
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
];

// ===== TYPES =====

interface StudentBulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onSendSMS: () => void;
  onSendWhatsapp: () => void;
  onSendEmail: () => void;
  onIssueCertificate: () => void;
  onIssueDocument: () => void;
}

interface StudentTableToolbarProps {
  bulkActions: StudentBulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
}

// ===== COMPONENT =====

export function StudentTableToolbar({ bulkActions, selectedCount, totalCount }: StudentTableToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterSelections>({});
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);

  // Check if there are any active filters
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  // Build bulk action items with handlers from props
  const studentBulkActionsWithHandlers: BulkActionItem[] = [
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
    {
      key: "issueCertificate",
      label: "Issue Certificate",
      onClick: () => setCertificateModalOpen(true),
      disabled: !hasSelection,
    },
    {
      key: "issueDocument",
      label: "Issue Document",
      onClick: () => setDocumentModalOpen(true),
      disabled: !hasSelection,
    },
  ];

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    console.log("Applied filters:", selections);
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
            <BulkActionDropdown items={studentBulkActionsWithHandlers} />

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

          {/* Right: Filter + Import + Export CSV */}
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
              <i className="file-arrow-up h-4 w-4" />
              Import
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
            <BulkActionDropdown items={studentBulkActionsWithHandlers} className="min-w-[110px]" />

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

          {/* Right: Filter + More */}
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
            {/* More Actions Dropdown (Import/Export) */}
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
              <DropdownMenuContent align="end" className="min-w-[160px]">
                <DropdownMenuItem onClick={() => console.log("Import")} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-import mr-2 h-4 w-4" />
                  Import
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Export CSV")} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-csv mr-2 h-4 w-4" />
                  Export CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              aria-label="Filter students"
            />

            {/* More Actions Dropdown (Import/Export) */}
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
                <DropdownMenuItem onClick={() => console.log("Import")} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-import mr-2 h-4 w-4" />
                  Import
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Export CSV")} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-csv mr-2 h-4 w-4" />
                  Export CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Action (icon only) */}
            <BulkActionDropdown items={studentBulkActionsWithHandlers} iconOnly triggerIcon={CheckSquare2} />
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={studentFilterCategories}
        onApply={handleApplyFilters}
        initialSelections={activeFilters}
      />

      {/* Issue Certificate Modal */}
      <IssueCertificateModal
        open={certificateModalOpen}
        onOpenChange={setCertificateModalOpen}
      />

      {/* Issue Document Modal */}
      <IssueDocumentModal
        open={documentModalOpen}
        onOpenChange={setDocumentModalOpen}
      />
    </>
  );
}
