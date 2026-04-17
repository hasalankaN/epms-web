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
import { IssueCertificateModal } from "@/components/common/IssueCertificateModal";
import { IssueDocumentModal } from "@/components/common/IssueDocumentModal";

import { DISTRICTS } from "@/lib/constants/districts";

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
    multiSelect: false,
    items: [
      { key: "ACTIVE", label: "Active" },
      { key: "INACTIVE", label: "Inactive" },
    ],
  },
  {
    key: "certificateStatus",
    label: "By Certificate Status",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "PENDING", label: "Pending" },
      { key: "HAS_CERTIFICATE", label: "Completed" },
    ],
  },
  {
    key: "paymentStatus",
    label: "By Payment Status",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "PENDING", label: "Pending" },
      { key: "PARTIALLY_PAID", label: "Partially Paid" },
      { key: "PAID", label: "Completed" },
    ],
  },
  {
    key: "district",
    label: "By District",
    type: "chips",
    multiSelect: false,
    items: DISTRICTS.map((d) => ({ key: d, label: d })),
  },
];

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
  search: string;
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: Record<string, string | null>) => void;
  onClearFilters: () => void;
  activeUrlFilters: {
    district?: string;
    studentStatus?: string;
    paymentStatus?: string;
    certificateStatus?: string;
    from?: string;
    to?: string;
  };
  onExportCSV: () => void;
  isExporting?: boolean;
}

// ===== COMPONENT =====

export function StudentTableToolbar({ 
  bulkActions, 
  selectedCount, 
  totalCount,
  search,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
  activeUrlFilters,
  onExportCSV,
  isExporting = false,
}: StudentTableToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);

  // Create an initialSelections object based on activeUrlFilters for the FilterModal
  const initialSelections = useMemo(() => {
    const selections: FilterSelections = {};

    if (activeUrlFilters.studentStatus) {
      selections.studentStatus = activeUrlFilters.studentStatus.toUpperCase().split(",");
    }

    if (activeUrlFilters.paymentStatus) {
      selections.paymentStatus = activeUrlFilters.paymentStatus.toUpperCase().split(",");
    }

    if (activeUrlFilters.certificateStatus) {
      selections.certificateStatus = activeUrlFilters.certificateStatus.toUpperCase().split(",");
    }

    if (activeUrlFilters.district) {
      selections.district = activeUrlFilters.district.split(",");
    }

    if (activeUrlFilters.from || activeUrlFilters.to) {
      selections.date = {
        start: activeUrlFilters.from ? new Date(activeUrlFilters.from) : null,
        end: activeUrlFilters.to ? new Date(activeUrlFilters.to) : null,
      };
    }

    return selections;
  }, [activeUrlFilters]);

  // Check if there are any active filters
  const hasActiveFilters = 
    !!activeUrlFilters.district || 
    !!activeUrlFilters.studentStatus || 
    !!activeUrlFilters.paymentStatus || 
    !!activeUrlFilters.certificateStatus || 
    !!activeUrlFilters.from || 
    !!activeUrlFilters.to;

  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  // Build bulk action items
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
    const updates: Record<string, string | null> = {
      district: null,
      studentStatus: null,
      paymentStatus: null,
      certificateStatus: null,
      from: null,
      to: null,
    };

    if (selections.studentStatus && Array.isArray(selections.studentStatus) && selections.studentStatus.length > 0) {
      updates.studentStatus = selections.studentStatus.join(",").toLowerCase();
    }

    if (selections.paymentStatus && Array.isArray(selections.paymentStatus) && selections.paymentStatus.length > 0) {
      updates.paymentStatus = selections.paymentStatus.join(",").toLowerCase();
    }

    if (selections.certificateStatus && Array.isArray(selections.certificateStatus) && selections.certificateStatus.length > 0) {
      updates.certificateStatus = selections.certificateStatus.join(",").toLowerCase();
    }

    if (selections.district && Array.isArray(selections.district) && selections.district.length > 0) {
      updates.district = selections.district.join(",");
    }

    if (selections.date && !Array.isArray(selections.date)) {
      if (selections.date.start) updates.from = selections.date.start.toISOString();
      if (selections.date.end) updates.to = selections.date.end.toISOString();
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
            <BulkActionDropdown items={studentBulkActionsWithHandlers} />

            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by Name, NIC, Student ID"
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

          {/* Right: Filter + Import + Export CSV */}
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
            <button className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}>
              <i className="file-arrow-up h-4 w-4" />
              Import
            </button>
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

          {/* Right: Filter + More actions */}
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
                <DropdownMenuItem onClick={onExportCSV} disabled={isExporting} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-csv mr-2 h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export CSV"}
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

          {/* Action buttons row: Filter + More + Bulk */}
          <div className="flex items-center gap-3">
            {/* Filter (icon only) */}
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
                <DropdownMenuItem onClick={onExportCSV} disabled={isExporting} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-csv mr-2 h-4 w-4" />
                  {isExporting ? "Exporting..." : "Export CSV"}
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
        initialSelections={initialSelections}
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
