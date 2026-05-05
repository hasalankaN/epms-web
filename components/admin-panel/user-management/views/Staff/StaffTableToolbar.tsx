"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";

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
import { useGetBranches } from "@/hooks/api/branches/useGetBranches";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

// ===== STAFF-SPECIFIC FILTER DATA =====

const staffFilterCategories: FilterCategory[] = [
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
      { key: "INACTIVE", label: "Inactive" },
    ],
  },
  {
    key: "role",
    label: "By Role",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "MANAGER", label: "Manager" },
      { key: "MEMBER", label: "Staff" },
    ],
  },
  {
    key: "branches",
    label: "By Branches",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "colombo", label: "Colombo" },
      { key: "negombo", label: "Negombo" },
      { key: "anuradhapura", label: "Anuradhapura" },
      { key: "galle", label: "Galle" },
    ],
  },
];

// ===== TYPES =====

interface StaffBulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onSendSMS: () => void;
  onSendWhatsapp: () => void;
  onSendEmail: () => void;
}

interface StaffTableToolbarProps {
  bulkActions: StaffBulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: Record<string, string | null>) => void;
  onClearFilters: () => void;
  activeUrlFilters: {
    status?: string;
    salaryStatus?: string;
    branch_id?: string;
    role?: string;
    regDateFrom?: string;
    regDateTo?: string;
  };
}

// ===== COMPONENT =====

export function StaffTableToolbar({ 
  bulkActions, 
  selectedCount, 
  totalCount,
  search,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
  activeUrlFilters,
}: StaffTableToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Pagination for branches list (filter modal)
  const [branchPage, setBranchPage] = useState(1);
  const [allBranches, setAllBranches] = useState<any[]>([]);

  const { data: branchesData, isFetching: isFetchingBranches } = useGetBranches({ 
    page: branchPage, 
    size: 20 
  });

  // Accumulate branches when new pages are fetched
  useEffect(() => {
    if (branchesData?.results) {
      setAllBranches(prev => {
        const existingIds = new Set(prev.map(b => b.id));
        const newUnique = branchesData.results.filter(b => !existingIds.has(b.id));
        
        return [...prev, ...newUnique];
      });
    }
  }, [branchesData]);

  const handleShowMoreBranches = useCallback(() => {
    if (branchesData && !branchesData.isLastPage) {
      setBranchPage(prev => prev + 1);
    }
  }, [branchesData]);

  // Update categories with dynamic branches
  const categories = useMemo(() => {
    const updatedCategories = [...staffFilterCategories];
    const branchCategoryIndex = updatedCategories.findIndex(c => c.key === "branches");
    
    if (branchCategoryIndex !== -1) {
      updatedCategories[branchCategoryIndex] = {
        ...updatedCategories[branchCategoryIndex],
        items: allBranches.map(b => ({
          key: b.id,
          label: b.name,
        })),
        onShowMore: handleShowMoreBranches,
        hasMore: branchesData ? !branchesData.isLastPage : false,
        isLoading: isFetchingBranches,
      };
    }
    
    return updatedCategories;
  }, [allBranches, handleShowMoreBranches, branchesData, isFetchingBranches]);

  // Create an initialSelections object based on activeUrlFilters
  const initialSelections = useMemo(() => {
    const selections: FilterSelections = {};

    if (activeUrlFilters.status) {
      selections.status = activeUrlFilters.status.split(",");
    }

    if (activeUrlFilters.salaryStatus) {
      selections.salaryStatus = activeUrlFilters.salaryStatus.split(",");
    }

    if (activeUrlFilters.branch_id) {
      selections.branches = activeUrlFilters.branch_id.split(",");
    }

    if (activeUrlFilters.role) {
      selections.role = activeUrlFilters.role.split(",");
    }

    if (activeUrlFilters.regDateFrom || activeUrlFilters.regDateTo) {
      selections.date = {
        start: activeUrlFilters.regDateFrom ? new Date(activeUrlFilters.regDateFrom) : null,
        end: activeUrlFilters.regDateTo ? new Date(activeUrlFilters.regDateTo) : null,
      };
    }

    return selections;
  }, [activeUrlFilters]);

  const hasActiveFilters = 
    !!activeUrlFilters.status || 
    !!activeUrlFilters.salaryStatus || 
    !!activeUrlFilters.branch_id || 
    !!activeUrlFilters.role ||
    !!activeUrlFilters.regDateFrom ||
    !!activeUrlFilters.regDateTo;

  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  const staffBulkActionsWithHandlers: BulkActionItem[] = [
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

    const updates: Record<string, string | null> = {
      status: null,
      salaryStatus: null,
      branch_id: null,
      role: null,
      regDateFrom: null,
      regDateTo: null,
    };

    if (selections.status && Array.isArray(selections.status) && selections.status.length > 0) {
      updates.status = selections.status.join(",");
    }

    if (selections.salaryStatus && Array.isArray(selections.salaryStatus) && selections.salaryStatus.length > 0) {
      updates.salaryStatus = selections.salaryStatus.join(",");
    }

    if (selections.branches && Array.isArray(selections.branches) && selections.branches.length > 0) {
      updates.branch_id = selections.branches.join(",");
    }

    if (selections.role && Array.isArray(selections.role) && selections.role.length > 0) {
      updates.role = selections.role.join(",");
    }

    if (selections.date && !Array.isArray(selections.date)) {
      if (selections.date.start) {
        const d = selections.date.start;

        updates.regDateFrom = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }

      if (selections.date.end) {
        const d = selections.date.end;

        updates.regDateTo = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
            <BulkActionDropdown items={staffBulkActionsWithHandlers} />

            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by Name, NIC, Phone Number"
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

        {/* ===== TABLET (md-lg): Bulk Action + Search left, Filter + Export right ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          {/* Left: Bulk Action + Search */}
          <div className="flex items-center gap-3">
            <BulkActionDropdown items={staffBulkActionsWithHandlers} className="min-w-[110px]" />

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
            <button className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap px-3", buttonTextStyles)}>
              <i className="file-csv h-4 w-4" />
              Export CSV
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
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
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
              aria-label="Filter staff"
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
                <DropdownMenuItem onClick={() => console.log("Export CSV")} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                  <i className="file-csv mr-2 h-4 w-4" />
                  Export CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Action (icon only) */}
            <BulkActionDropdown items={staffBulkActionsWithHandlers} iconOnly triggerIcon={CheckSquare2} />
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
