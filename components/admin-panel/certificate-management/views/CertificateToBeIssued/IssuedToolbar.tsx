"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { Search, X, CheckSquare2, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";

import type { BulkActionItem } from "@/components/common/dropdowns/BulkActionDropdown";
import { BulkActionDropdown } from "@/components/common/dropdowns/BulkActionDropdown";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetCourses } from "@/hooks/api/courses/useGetCourses";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";


interface BulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onDelete: () => void;
}

interface IssuedToolbarProps {
  bulkActions: BulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
  onExportPDF: () => Promise<void>;
  isExportingPDF?: boolean;
}

export function IssuedToolbar({ 
  bulkActions, 
  selectedCount, 
  totalCount,
  onExportPDF,
  isExportingPDF = false
}: IssuedToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Search state
  const currentSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(currentSearch);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

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

  // Options for filters
  const { data: coursesData } = useGetCourses({ size: 100 });
  const { data: batchesData } = useGetBatches({ size: 100 });

  // Initialize active filters from URL
  const [activeFilters, setActiveFilters] = useState<FilterSelections>(() => {
    const filters: FilterSelections = {};

    const getParam = (key: string, targetKey: string) => {
      const val = searchParams.get(key);

      if (val) filters[targetKey] = val.split(",");
    };

    getParam("batch_id", "courseBatch");
    getParam("course_id", "courseBatch");
    getParam("status", "status");
    getParam("certificate_type", "type");

    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    if (dateFrom && dateTo) {
      filters["date"] = { start: new Date(dateFrom), end: new Date(dateTo) };
    }

    return filters;
  });

  const dynamicCategories = useMemo<FilterCategory[]>(() => [
    {
      key: "date",
      label: "By Date",
      type: "dateRange",
    },
    {
      key: "courseBatch",
      label: "By Course / Batch Name",
      type: "chips",
      items: [
        ...(coursesData?.results.map(c => ({ key: c.id, label: c.name })) || []),
        ...(batchesData?.results.map(b => ({ key: b.id, label: b.name })) || []),
      ],
    },
    {
      key: "status",
      label: "By Issued Status",
      type: "chips",
      items: [
        { key: "PENDING", label: "Pending" },
        { key: "IN_PROGRESS", label: "In Progress" },
        { key: "DELIVERED", label: "Delivered" },
        { key: "DOWNLOADED", label: "Downloaded" },
      ],
    },
    {
      key: "type",
      label: "By Certificate Type",
      type: "chips",
      items: [
        { key: "FREE", label: "Free" },
        { key: "PAID", label: "Paid" },
      ],
    },
  ], [coursesData, batchesData]);

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

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    setActiveFilters(selections);
    
    const params = new URLSearchParams(searchParams.toString());
    
    // Status and Type
    const setOrDelete = (selKey: string, paramKey: string) => {
      const val = selections[selKey];

      if (Array.isArray(val) && val.length > 0) {
        params.set(paramKey, val.join(","));
      } else {
        params.delete(paramKey);
      }
    };

    setOrDelete("status", "status");
    setOrDelete("type", "certificate_type");

    // Course/Batch (We need to distinguish if it's a course or a batch ID)
    const courseBatchVal = selections["courseBatch"];

    if (Array.isArray(courseBatchVal) && courseBatchVal.length > 0) {
      const firstId = courseBatchVal[0];
      const isCourse = coursesData?.results.some(c => c.id === firstId);

      if (isCourse) {
        params.set("course_id", firstId);
        params.delete("batch_id");
      } else {
        params.set("batch_id", firstId);
        params.delete("course_id");
      }
    } else {
      params.delete("course_id");
      params.delete("batch_id");
    }

    // Date
    const dateVal = selections["date"] as { start: Date | null; end: Date | null };

    if (dateVal && dateVal.start && dateVal.end) {
      params.set("date_from", dateVal.start.toISOString());
      params.set("date_to", dateVal.end.toISOString());
    } else {
      params.delete("date_from");
      params.delete("date_to");
    }

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams, coursesData]);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    
    const params = new URLSearchParams(searchParams.toString());

    params.delete("status");
    params.delete("certificate_type");
    params.delete("course_id");
    params.delete("batch_id");
    params.delete("date_from");
    params.delete("date_to");

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

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
                placeholder="Search by student or certificate name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button type="button" onClick={handleClearFilters} className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}>
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
            <FilterModalTrigger onClick={() => setFilterModalOpen(true)} label="Filter" className={cn(hasActiveFilters && BUTTON_STYLES.active.md)} />
            <button
              type="button"
              onClick={onExportPDF}
              disabled={isExportingPDF}
              className={cn(
                BUTTON_STYLES.outline.md,
                "whitespace-nowrap text-[14px] font-semibold leading-[20px] text-[#0F172B]"
              )}
            >
              <i className="file-pdf h-4 w-4" />
              {isExportingPDF ? "Exporting..." : "Export PDF"}
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
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button type="button" onClick={handleClearFilters} className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}>
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
            <FilterModalTrigger onClick={() => setFilterModalOpen(true)} label="Filter" className={cn(hasActiveFilters && BUTTON_STYLES.active.md)} />
            <button
              type="button"
              onClick={onExportPDF}
              disabled={isExportingPDF}
              className={cn(
                BUTTON_STYLES.outline.md,
                "whitespace-nowrap text-[14px] font-semibold leading-[20px] text-[#0F172B]"
              )}
            >
              <i className="file-pdf h-4 w-4" />
              {isExportingPDF ? "Exporting..." : "Export PDF"}
            </button>
          </div>
        </div>

        {/* ===== MOBILE (<md) ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
            />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button title="Clear Filters" type="button" onClick={handleClearFilters} className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B]")}>
                  <X className="h-4 w-4" />
                </button>
              )}
              <FilterModalTrigger onClick={() => setFilterModalOpen(true)} iconOnly className={cn(hasActiveFilters && BUTTON_STYLES.active.md)} />
              <BulkActionDropdown items={bulkItems} iconOnly triggerIcon={CheckSquare2} />
            </div>
            {/* More Actions Dropdown (PDF) */}
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
                  {isExportingPDF ? "Printing..." : "Export PDF"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

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
        onConfirm={() => { bulkActions.onDelete(); setDeleteModalOpen(false); }}
        title="Confirm Bulk Deletion"
        description={`Are you sure you want to delete ${selectedCount} selected record(s)? This action cannot be undone.`}
      />
    </>
  );
}
