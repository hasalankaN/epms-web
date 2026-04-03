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
import type { ExportItem } from "@/components/common/dropdowns/ExportDropdown";
import { ExportDropdown } from "@/components/common/dropdowns/ExportDropdown";
import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";
import { useGetBranches } from "@/hooks/api/branches/useGetBranches";
import { useGetLecturers } from "@/hooks/api/lecturers/useGetLecturers";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

const batchExportItems: ExportItem[] = [
  { key: "csv", label: "Export CSV", icon: (() => <i className="file-csv h-4 w-4" />) as any, onClick: () => console.log("Export CSV") },
];

const BATCH_TYPES = [
  "Workshop", "Certificate", "Diploma", "HND", "Degree", "School", "University", "Exam Prep"
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
    multiSelect: false,
    items: BATCH_TYPES.map(t => ({ key: t, label: t })),
  },
  { 
    key: "level", 
    label: "Batch Level", 
    type: "chips",
    multiSelect: false,
    items: [
      { key: "BEGINNER", label: "Beginner" },
      { key: "INTERMEDIATE", label: "Intermediate" },
      { key: "ADVANCED", label: "Advanced" },
      { key: "GENERAL", label: "General" },
    ],
  },
  { 
    key: "status", 
    label: "Batch Status", 
    type: "chips",
    multiSelect: false,
    items: [
      { key: "Active", label: "Active" },
      { key: "Upcoming", label: "Upcoming" },
      { key: "Completed", label: "Completed" },
      { key: "Inactive", label: "Inactive" },
    ],
  },
  { 
    key: "category", 
    label: "Batch Category", 
    type: "chips",
    multiSelect: false,
    items: [
      { key: "Online", label: "Online" },
      { key: "Offline", label: "Offline" },
    ],
  },
  { 
    key: "payment_type", 
    label: "Batch Payment", 
    type: "chips",
    multiSelect: false,
    items: [
      { key: "Paid", label: "Paid" },
      { key: "Free", label: "Free" },
    ],
  },
  { 
    key: "branch_id", 
    label: "By Branches", 
    type: "chips",
    multiSelect: false,
    items: [], // Populated dynamically
  },
  { 
    key: "lecturer_id", 
    label: "Lecturer", 
    type: "chips",
    multiSelect: false,
    items: [], // Populated dynamically
  },
];

interface BulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onSendSMS: () => void;
  onSendEmail: () => void;
}

interface BatchTableToolbarProps {
  bulkActions: BulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: Record<string, string | null>) => void;
  onClearFilters: () => void;
  activeUrlFilters: {
    category?: string;
    type?: string;
    status?: string;
    branch_id?: string;
    payment_type?: string;
    level?: string;
    lecturer_id?: string;
    start_date_from?: string;
    start_date_to?: string;
  };
}

export function BatchTableToolbar({ 
  bulkActions, 
  selectedCount, 
  totalCount,
  search,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
  activeUrlFilters,
}: BatchTableToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Fetch branches and lecturers dynamically for the filter modal
  const { data: branchesData } = useGetBranches({ size: 100 });
  const { data: lecturersData } = useGetLecturers({ size: 100 });

  const categories = useMemo(() => {
    const updatedCategories = [...batchFilterCategories];
    
    // Update branches
    const branchCategoryIndex = updatedCategories.findIndex(c => c.key === "branch_id");

    if (branchCategoryIndex !== -1 && branchesData?.results) {
      updatedCategories[branchCategoryIndex] = {
        ...updatedCategories[branchCategoryIndex],
        items: branchesData.results.map(b => ({
          key: b.id,
          label: b.name,
        })),
      };
    }

    // Update lecturers
    const lecturerCategoryIndex = updatedCategories.findIndex(c => c.key === "lecturer_id");

    if (lecturerCategoryIndex !== -1 && lecturersData?.results) {
      updatedCategories[lecturerCategoryIndex] = {
        ...updatedCategories[lecturerCategoryIndex],
        items: lecturersData.results.map(l => ({
          key: l.user_id,
          label: `${l.first_name} ${l.last_name}`,
        })),
      };
    }
    
    return updatedCategories;
  }, [branchesData, lecturersData]);

  const initialSelections = useMemo(() => {
    const selections: FilterSelections = {};

    if (activeUrlFilters.category) selections.category = activeUrlFilters.category.split(",");
    if (activeUrlFilters.type) selections.type = activeUrlFilters.type.split(",");
    if (activeUrlFilters.status) selections.status = activeUrlFilters.status.split(",");
    if (activeUrlFilters.branch_id) selections.branch_id = activeUrlFilters.branch_id.split(",");
    if (activeUrlFilters.payment_type) selections.payment_type = activeUrlFilters.payment_type.split(",");
    if (activeUrlFilters.level) selections.level = activeUrlFilters.level.split(",");
    if (activeUrlFilters.lecturer_id) selections.lecturer_id = activeUrlFilters.lecturer_id.split(",");

    if (activeUrlFilters.start_date_from || activeUrlFilters.start_date_to) {
      selections.date = {
        start: activeUrlFilters.start_date_from ? new Date(activeUrlFilters.start_date_from) : null,
        end: activeUrlFilters.start_date_to ? new Date(activeUrlFilters.start_date_to) : null,
      };
    }

    return selections;
  }, [activeUrlFilters]);

  const hasActiveFilters = Object.values(activeUrlFilters).some(v => v !== undefined && v !== "");
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
  ];

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    const updates: Record<string, string | null> = {
      category: null,
      type: null,
      status: null,
      branch_id: null,
      payment_type: null,
      level: null,
      lecturer_id: null,
      start_date_from: null,
      start_date_to: null,
    };

    if (selections.category && Array.isArray(selections.category) && selections.category.length > 0) updates.category = selections.category.join(",");
    if (selections.type && Array.isArray(selections.type) && selections.type.length > 0) updates.type = selections.type.join(",");
    if (selections.status && Array.isArray(selections.status) && selections.status.length > 0) updates.status = selections.status.join(",");
    if (selections.branch_id && Array.isArray(selections.branch_id) && selections.branch_id.length > 0) updates.branch_id = selections.branch_id.join(",");
    if (selections.payment_type && Array.isArray(selections.payment_type) && selections.payment_type.length > 0) updates.payment_type = selections.payment_type.join(",");
    if (selections.level && Array.isArray(selections.level) && selections.level.length > 0) updates.level = selections.level.join(",");
    if (selections.lecturer_id && Array.isArray(selections.lecturer_id) && selections.lecturer_id.length > 0) updates.lecturer_id = selections.lecturer_id.join(",");

    if (selections.date && !Array.isArray(selections.date)) {
      if (selections.date.start) {
        const d = selections.date.start;

        updates.start_date_from = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }

      if (selections.date.end) {
        const d = selections.date.end;

        updates.start_date_to = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
            <BulkActionDropdown items={batchBulkActionsWithHandlers} />

            <div className="relative w-[450px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by Batch Name, ID, Category, Lecturer Name"
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

          {/* Right: Filter + Export Dropdown */}
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
                title="Clear Filters"
                type="button"
                onClick={onClearFilters}
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

            {/* More Actions Dropdown (Export) */}
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
        categories={categories}
        onApply={handleApplyFilters}
        initialSelections={initialSelections}
      />
    </>
  );
}
