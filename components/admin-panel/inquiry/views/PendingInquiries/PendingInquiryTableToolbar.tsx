"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { format } from "date-fns";
import { Search, MoreHorizontal, CheckSquare2, X } from "lucide-react";

import { HorizontalScrollContainer } from "@/components/common/HorizontalScrollContainer";

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
import { ExportDropdown } from "@/components/common/dropdowns/ExportDropdown";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

import { useDebounce } from "@/hooks/useDebounce";
import { useGetBranches } from "@/hooks/api/branches/useGetBranches";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";
import { useGetCourses } from "@/hooks/api/courses/useGetCourses";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";
import { DISTRICTS } from "@/lib/constants/districts";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";


// ===== TYPES =====

interface BulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onSendSMS: () => void;
  onSendWhatsapp: () => void;
  onSendEmail: () => void;
  onDelete: () => Promise<void>;
}

interface PendingInquiryTableToolbarProps {
  bulkActions: BulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
  onExportCSV: () => Promise<void>;
  isExportingCSV?: boolean;
  onExportPDF: () => Promise<void>;
  isExportingPDF?: boolean;
  isDeleting?: boolean;
}

// ===== COMPONENT =====

export function PendingInquiryTableToolbar({ bulkActions, selectedCount, totalCount, onExportCSV, isExportingCSV = false, onExportPDF, isExportingPDF = false, isDeleting = false }: PendingInquiryTableToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Initialize active filters from URL
  const [activeFilters, setActiveFilters] = useState<FilterSelections>(() => {
    const filters: FilterSelections = {};

    const getParam = (key: string, targetKey: string) => {
      const val = searchParams.get(key);

      if (val) filters[targetKey] = val.split(",");
    };

    getParam("assignee_user_id", "assignee");
    getParam("branch_id", "branches");
    getParam("district", "district");
    getParam("interest_id", "interest");
    getParam("source", "sources");
    getParam("priority_status", "priority");

    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    if (dateFrom && dateTo) {
      filters["date"] = { start: new Date(dateFrom), end: new Date(dateTo) };
    }

    const followFrom = searchParams.get("follow_up_from");
    const followTo = searchParams.get("follow_up_to");

    if (followFrom && followTo) {
      filters["followUp"] = { start: new Date(followFrom), end: new Date(followTo) };
    }

    return filters;
  });

  // Sync search input with URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }

    if (searchParams.get("search") !== (debouncedSearchTerm || null)) {
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    }
  }, [debouncedSearchTerm, router, pathname, searchParams]);

  // Sync internal state with URL filters when URL changes
  useEffect(() => {
    const filters: FilterSelections = {};

    const getParam = (key: string, targetKey: string) => {
      const val = searchParams.get(key);

      if (val) filters[targetKey] = val.split(",");
    };
    
    getParam("assignee_user_id", "assignee");
    getParam("branch_id", "branches");
    getParam("district", "district");
    getParam("interest_id", "interest");
    getParam("source", "sources");
    getParam("priority_status", "priority");

    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    if (dateFrom && dateTo) {
      filters["date"] = { start: new Date(dateFrom), end: new Date(dateTo) };
    }
    
    const followFrom = searchParams.get("follow_up_from");
    const followTo = searchParams.get("follow_up_to");

    if (followFrom && followTo) {
      filters["followUp"] = { start: new Date(followFrom), end: new Date(followTo) };
    }
    
    setActiveFilters(filters);
  }, [searchParams]);

  // Fetch options for filters
  const { data: branchesData } = useGetBranches({ size: 100 });
  const { data: staffData } = useGetStaff({ size: 100 });
  const { data: coursesData } = useGetCourses({ size: 100 });
  const { data: batchesData } = useGetBatches({ size: 100 });

  const dynamicCategories = useMemo<FilterCategory[]>(() => {
    return [
      { key: "date", label: "By Date", type: "dateRange" },
      {
        key: "assignee",
        label: "By Assignee",
        type: "chips",
        multiSelect: false,
        items: staffData?.results.map(s => ({ key: s.userId, label: `${s.firstName} ${s.lastName}` })) || [],
      },
      {
        key: "branches",
        label: "By Branches",
        type: "chips",
        multiSelect: false,
        items: branchesData?.results.map(b => ({ key: b.id, label: b.name })) || [],
      },
      {
        key: "district",
        label: "By District",
        type: "chips",
        multiSelect: false,
        items: DISTRICTS.map(d => ({ key: d.toLowerCase(), label: d })),
      },
      {
        key: "interest",
        label: "By Interest",
        type: "chips",
        multiSelect: false,
        items: [
          ...(coursesData?.results.map(c => ({ key: c.id, label: c.name })) || []),
          ...(batchesData?.results.map(b => ({ key: b.id, label: b.name })) || []),
        ],
      },
      {
        key: "sources",
        label: "By Sources",
        type: "chips",
        multiSelect: false,
        items: [
          { key: "WEB", label: "Web" },
          { key: "ADMIN", label: "By Admin" },
        ],
      },
      {
        key: "priority",
        label: "By Priority Status",
        type: "chips",
        multiSelect: false,
        items: [
          { key: "HOT", label: "Hot" },
          { key: "COLD", label: "Cold" },
        ],
      },
      { key: "followUp", label: "By Follow Up Date", type: "dateRange" },
    ];
  }, [staffData, branchesData, coursesData, batchesData]);

  // Check if there are any active filters
  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  // Build bulk action items with handlers from props
  const inquiryBulkActionsWithHandlers: BulkActionItem[] = [
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
      key: "delete",
      label: "Delete",
      variant: "danger",
      onClick: () => setDeleteModalOpen(true),
      disabled: !hasSelection,
    },
  ];

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    setActiveFilters(selections);

    const params = new URLSearchParams(searchParams.toString());

    const setOrDelete = (selKey: string, paramKey: string) => {
      const val = selections[selKey];

      if (Array.isArray(val) && val.length > 0) {
        params.set(paramKey, val.join(","));
      } else {
        params.delete(paramKey);
      }
    };

    setOrDelete("assignee", "assignee_user_id");
    setOrDelete("branches", "branch_id");
    setOrDelete("district", "district");
    setOrDelete("interest", "interest_id");
    setOrDelete("sources", "source");
    setOrDelete("priority", "priority_status");

    const dateVal = selections["date"] as { start: Date | null; end: Date | null };

    if (dateVal && dateVal.start) {
      params.set("date_from", format(dateVal.start, "yyyy-MM-dd"));
      params.set("date_to", format(dateVal.end || dateVal.start, "yyyy-MM-dd"));
    } else {
      params.delete("date_from");
      params.delete("date_to");
    }

    const followVal = selections["followUp"] as { start: Date | null; end: Date | null };

    if (followVal && followVal.start) {
      params.set("follow_up_from", format(followVal.start, "yyyy-MM-dd"));
      params.set("follow_up_to", format(followVal.end || followVal.start, "yyyy-MM-dd"));
    } else {
      params.delete("follow_up_from");
      params.delete("follow_up_to");
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});

    const params = new URLSearchParams(searchParams.toString());

    params.delete("assignee_user_id");
    params.delete("branch_id");
    params.delete("district");
    params.delete("interest_id");
    params.delete("source");
    params.delete("priority_status");
    params.delete("date_from");
    params.delete("date_to");
    params.delete("follow_up_from");
    params.delete("follow_up_to");

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+): Full layout ===== */}
        <HorizontalScrollContainer className="w-full pb-1" containerClassName="hidden lg:block">
          <div className="flex min-w-max items-center justify-between gap-4">
            {/* Left: Bulk Action + Search */}
            <div className="flex items-center gap-4">
              <BulkActionDropdown items={inquiryBulkActionsWithHandlers} />

              <div className="relative w-[320px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
                <Input
                  type="text"
                  placeholder="Search by Name, NIC, Phone Number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              <button
                className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}
                onClick={onExportPDF}
                disabled={isExportingPDF}
              >
                <i className="file-pdf h-4 w-4" />
                {isExportingPDF ? "Printing..." : "Print PDF"}
              </button>
              <button
                className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}
                onClick={onExportCSV}
                disabled={isExportingCSV}
              >
                <i className="file-csv h-4 w-4" />
                {isExportingCSV ? "Exporting..." : "Export CSV"}
              </button>
            </div>
          </div>
        </HorizontalScrollContainer>

        {/* ===== TABLET (md-lg): Bulk Action + Search left, Filter + Export dropdown right ===== */}
        <HorizontalScrollContainer className="w-full pb-1" containerClassName="hidden md:flex lg:hidden">
          <div className="flex min-w-max items-center justify-between gap-4">
            {/* Left: Bulk Action + Search */}
            <div className="flex items-center gap-3">
              <BulkActionDropdown items={inquiryBulkActionsWithHandlers} className="min-w-[110px]" />

              <div className="relative w-[200px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              <ExportDropdown
                items={[
                  { key: "pdf", label: isExportingPDF ? "Printing..." : "Print PDF", icon: (() => <i className="file-pdf h-4 w-4" />) as any, onClick: onExportPDF },
                  { key: "csv", label: isExportingCSV ? "Exporting..." : "Export CSV", icon: (() => <i className="file-csv h-4 w-4" />) as any, onClick: onExportCSV },
                ]}
              />
            </div>
          </div>
        </HorizontalScrollContainer>

        {/* ===== MOBILE (<md): Search full width, action buttons row ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          {/* Search - Full width */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search by Name, NIC, Phone Number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4"
              )}
            />
          </div>

          {/* Action buttons row: Filter + More + Bulk */}
          <div className="flex items-center gap-3">
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
                <DropdownMenuItem onClick={onExportPDF} disabled={isExportingPDF} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-pdf mr-2 h-4 w-4" />
                  {isExportingPDF ? "Printing..." : "Print PDF"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportCSV} disabled={isExportingCSV} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-csv mr-2 h-4 w-4" />
                  {isExportingCSV ? "Exporting..." : "Export CSV"}
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
        categories={dynamicCategories}
        onApply={handleApplyFilters}
        initialSelections={activeFilters}
        multiSelect={false}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={async () => {
          await bulkActions.onDelete();
          setDeleteModalOpen(false);
        }}
        isDeleting={isDeleting}
        title="Confirm Bulk Deletion"
        description={`Are you sure you want to delete ${selectedCount} selected enquiries? This action cannot be undone.`}
      />
    </>
  );
}
