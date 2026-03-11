"use client";

import React, { useState, useCallback } from "react";

import { Search, CheckSquare2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";

import { Input } from "@/components/ui/input";
import type { BulkActionItem } from "@/components/common/dropdowns/BulkActionDropdown";
import { BulkActionDropdown } from "@/components/common/dropdowns/BulkActionDropdown";
import type { FilterCategory } from "@/components/common/dropdowns/FilterDropdown";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

// ===== FILTER DATA =====

const stockStatusFilter: FilterCategory = {
  key: "stockStatus",
  label: "Stock Status",
  items: [
    { key: "IN_STOCK", label: "In Stock" },
    { key: "OUT_OF_STOCK", label: "Out of Stock" },
    { key: "LOW_STOCK", label: "Low Stock" },
  ],
};

const productTypeFilter: FilterCategory = {
  key: "productType",
  label: "Product Type",
  items: [
    { key: "DIGITAL", label: "Digital" },
    { key: "DELIVERY", label: "Delivery" },
  ],
};

// ===== TYPES =====

interface BulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

interface ProductListToolbarProps {
  bulkActions: BulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  typeFilter: string | null;
  stockFilter: string | null;
  onFilterChange: (key: string, value: string | null) => void;
  onClearFilters: () => void;
}

// ===== COMPONENT =====

export function ProductListToolbar({
  bulkActions,
  selectedCount,
  totalCount,
  search,
  onSearchChange,
  typeFilter,
  stockFilter,
  onFilterChange,
  onClearFilters,
}: ProductListToolbarProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  const hasActiveFilters = stockFilter !== null || typeFilter !== null;

  // Build bulk action items
  const bulkActionItems: BulkActionItem[] = [
    {
      key: isAllSelected ? "clear" : "selectAll",
      label: isAllSelected ? "Clear Selection" : "Select All",
      onClick: isAllSelected ? bulkActions.onClear : bulkActions.onSelectAll,
    },
    {
      key: "archive",
      label: "Archive",
      onClick: bulkActions.onArchive,
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

  const handleFilterSelect = useCallback((categoryKey: string, itemKey: string) => {
    if (categoryKey === "stockStatus") {
      onFilterChange("stockStatus", itemKey);
    } else if (categoryKey === "productType") {
      onFilterChange("type", itemKey);
    }
  }, [onFilterChange]);

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+): Full layout ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          {/* Left: Bulk Action + Search */}
          <div className="flex items-center gap-4">
            <BulkActionDropdown items={bulkActionItems} />

            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by Product Name, SKU"
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

          {/* Right: Filters + Add Button */}
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
                Clear All
              </button>
            )}
            <FilterDropdown
              categories={[stockStatusFilter]}
              onFilterSelect={handleFilterSelect}
              label="Stock Status"
              value={stockStatusFilter.items.find(i => i.key === stockFilter)?.label || null}
            />
            <FilterDropdown
              categories={[productTypeFilter]}
              onFilterSelect={handleFilterSelect}
              label="Product Type"
              value={productTypeFilter.items.find(i => i.key === typeFilter)?.label || null}
            />
          </div>
        </div>

        {/* ===== TABLET (md-lg): Bulk + Search left, filters + Add right ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          {/* Left: Bulk Action + Search */}
          <div className="flex items-center gap-3">
            <BulkActionDropdown items={bulkActionItems} className="min-w-[110px]" />

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

          {/* Right: Filters + Add */}
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                title="clear-filters"
                type="button"
                onClick={onClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <FilterDropdown
              categories={[stockStatusFilter]}
              onFilterSelect={handleFilterSelect}
              label="Stock Status"
              value={stockStatusFilter.items.find(i => i.key === stockFilter)?.label || null}
            />
            <FilterDropdown
              categories={[productTypeFilter]}
              onFilterSelect={handleFilterSelect}
              label="Product Type"
              value={productTypeFilter.items.find(i => i.key === typeFilter)?.label || null}
            />
          </div>
        </div>

        {/* ===== MOBILE (<md): Search full width, action buttons row ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          {/* Search - Full width */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search by Name, ID..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4"
              )}
            />
          </div>

          {/* Actions for Tablet/Mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {hasActiveFilters && (
              <button
                title="clear-filters"
                type="button"
                onClick={onClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] shrink-0")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="shrink-0">
              <FilterDropdown
                categories={[stockStatusFilter]}
                onFilterSelect={handleFilterSelect}
                label="Stock Status"
                value={stockStatusFilter.items.find(i => i.key === stockFilter)?.label || null}
              />
            </div>
            <div className="shrink-0">
              <FilterDropdown
                categories={[productTypeFilter]}
                onFilterSelect={handleFilterSelect}
                label="Product Type"
                value={productTypeFilter.items.find(i => i.key === typeFilter)?.label || null}
              />
            </div>


            {/* Bulk Action (icon only) */}
            <div className="shrink-0">
              <BulkActionDropdown items={bulkActionItems} iconOnly triggerIcon={CheckSquare2} />
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          bulkActions.onDelete();
          setDeleteModalOpen(false);
        }}
        title="Confirm Bulk Deletion"
        description={`Are you sure you want to delete ${selectedCount} selected product(s)? This action cannot be undone.`}
      />
    </>
  );
}
