"use client";

import React, { useState, useCallback } from "react";

import { Search, X, CheckSquare2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";
import type { FilterCategory } from "@/components/common/dropdowns/FilterDropdown";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";
import type { BulkActionItem } from "@/components/common/dropdowns/BulkActionDropdown";
import { BulkActionDropdown } from "@/components/common/dropdowns/BulkActionDropdown";
import { HorizontalScrollContainer } from "@/components/common/HorizontalScrollContainer";

import { useGetOrderSummary } from "@/hooks/api/orders/useGetOrderSummary";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px]";

// ===== TYPES =====

interface BulkActionsHandlers {
  onSelectAll: () => void;
  onClear: () => void;
  onPrintAddress: () => void;
  onPrintInvoices: () => void;
  onPrintWaybill: () => void;
  onMarkProcessing: () => void;
  onMarkDispatched: () => void;
  onMarkCompleted: () => void;
  onMarkRefunded: () => void;
}

export interface OrderToolbarProps {
  bulkActions: BulkActionsHandlers;
  selectedCount: number;
  totalCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string | null;
  typeFilter: string | null;
  dateFilter: string | null;
  onFilterChange: (key: string, value: string | null) => void;
  onClearFilters: () => void;
  onGenerateReport: () => void;
  isGeneratingReport: boolean;
}

export function OrderToolbar({
  bulkActions,
  selectedCount,
  totalCount,
  search,
  onSearchChange,
  statusFilter,
  typeFilter,
  dateFilter,
  onFilterChange,
  onClearFilters,
  onGenerateReport,
  isGeneratingReport,
}: OrderToolbarProps) {
  const { data: summaryData } = useGetOrderSummary();

  const formatCount = (count: number | undefined) => {
    return (count ?? 0).toString().padStart(2, "0");
  };

  const orderStatusFilter: FilterCategory = {
    key: "orderStatus",
    label: "Order Status",
    items: [
      { key: "processing", label: `Processing (${formatCount(summaryData?.processing)})` },
      { key: "pending", label: `Pending (${formatCount(summaryData?.pending)})` },
      { key: "downloaded", label: `Downloaded (${formatCount(summaryData?.downloaded)})` },
      { key: "refunded", label: `Refunded (${formatCount(summaryData?.refunded)})` },
      { key: "dispatched", label: `Dispatched (${formatCount(summaryData?.dispatched)})` },
      { key: "completed", label: `Completed (${formatCount(summaryData?.completed)})` },
    ],
  };

  const productTypeFilter: FilterCategory = {
    key: "productType",
    label: "Product Type",
    items: [
      { key: "digital", label: "Digital" },
      { key: "delivery", label: "Delivery" },
    ],
  };

  // Track whether a date range has been applied (drives Clear All visibility)
  const hasDateFilter = !!dateFilter;

  const hasActiveFilters = hasDateFilter || statusFilter !== null || typeFilter !== null;

  const [clearKey, setClearKey] = useState(0);

  const handleClearFilters = useCallback(() => {
    onClearFilters();
    setClearKey((k) => k + 1);
  }, [onClearFilters]);

  const handleFilterSelect = useCallback((categoryKey: string, itemKey: string) => {
    // Map UI keys to API values
    if (categoryKey === "orderStatus") onFilterChange("status", itemKey.toUpperCase());
    else if (categoryKey === "productType") onFilterChange("product_type", itemKey.toUpperCase());
  }, [onFilterChange]);

  const isAllSelected = totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  const bulkActionItems: BulkActionItem[] = [
    {
      key: isAllSelected ? "clear" : "selectAll",
      label: isAllSelected ? "Clear Selection" : "Select All",
      onClick: isAllSelected ? bulkActions.onClear : bulkActions.onSelectAll,
    },
    {
      key: "printAddress",
      label: "Export Addresses",
      onClick: bulkActions.onPrintAddress,
      disabled: !hasSelection,
    },
    {
      key: "printInvoices",
      label: "Print Invoices",
      onClick: bulkActions.onPrintInvoices,
      disabled: !hasSelection,
    },
    {
      key: "printWaybill",
      label: "Print Delivery way bill",
      onClick: bulkActions.onPrintWaybill,
      disabled: !hasSelection,
    },
    {
      key: "markProcessing",
      label: "Mark as Processing",
      onClick: bulkActions.onMarkProcessing,
      disabled: !hasSelection,
    },
    {
      key: "markDispatched",
      label: "Mark as Dispatched",
      onClick: bulkActions.onMarkDispatched,
      disabled: !hasSelection,
    },
    {
      key: "markCompleted",
      label: "Mark as Completed",
      onClick: bulkActions.onMarkCompleted,
      disabled: !hasSelection,
    },
    {
      key: "markRefunded",
      label: "Mark as Refunded",
      onClick: bulkActions.onMarkRefunded,
      disabled: !hasSelection,
    },
  ];

  const dateFilterComponent = (
    <DateRangeFilter
      key={clearKey}
      placeholder="By Date"
      onApply={(start) => {
        if (start) {
          const dateStr = start.toISOString().split("T")[0];

          onFilterChange("date", dateStr);
        } else {
          onFilterChange("date", null);
        }
      }}
    />
  );

  return (
    <div className="flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+): Full layout with horizontal slide ===== */}
      <HorizontalScrollContainer className="w-full pb-1" containerClassName="hidden lg:block">
        <div className="flex min-w-max items-center justify-between gap-4">
          {/* Left: Bulk Action + Search */}
          <div className="flex shrink-0 items-center gap-4">
            <BulkActionDropdown items={bulkActionItems} />

            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by customer Name"
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                title="clear filters"
                type="button"
                onClick={handleClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
                Clear All
              </button>
            )}

            {dateFilterComponent}

            <FilterDropdown categories={[orderStatusFilter]} onFilterSelect={handleFilterSelect} label="Order Status" value={statusFilter ? statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase() : null} />
            <FilterDropdown categories={[productTypeFilter]} onFilterSelect={handleFilterSelect} label="Product Type" value={typeFilter ? typeFilter.charAt(0) + typeFilter.slice(1).toLowerCase() : null} />
            <button
              onClick={onGenerateReport}
              disabled={isGeneratingReport}
              className={cn(BUTTON_STYLES.secondary.md, "whitespace-nowrap", buttonTextStyles, "text-[#0F172B]")}
            >
              {isGeneratingReport ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>
      </HorizontalScrollContainer>

      {/* ===== TABLET (md-lg) ===== */}
      <HorizontalScrollContainer className="w-full pb-1" containerClassName="hidden md:block lg:hidden">
        <div className="flex min-w-max items-center justify-between gap-4">
          {/* Left: Bulk Action + Search */}
          <div className="flex shrink-0 items-center gap-3">
            <BulkActionDropdown items={bulkActionItems} className="min-w-[110px]" />

            <div className="relative w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search..."
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                title="clear filters"
                type="button"
                onClick={handleClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {dateFilterComponent}

            <FilterDropdown categories={[orderStatusFilter]} onFilterSelect={handleFilterSelect} label="Status" value={statusFilter ? statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase() : null} />
            <FilterDropdown categories={[productTypeFilter]} onFilterSelect={handleFilterSelect} label="Type" value={typeFilter ? typeFilter.charAt(0) + typeFilter.slice(1).toLowerCase() : null} />
            <button
              onClick={onGenerateReport}
              disabled={isGeneratingReport}
              className={cn(BUTTON_STYLES.secondary.md, "whitespace-nowrap", buttonTextStyles, "text-[#0F172B]")}
            >
              {isGeneratingReport ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </div>
      </HorizontalScrollContainer>

      {/* ===== MOBILE (<md) ===== */}
      <div className="flex w-full flex-col gap-3 md:hidden">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search by customer Name"
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <HorizontalScrollContainer className="w-full pb-2">
          <div className="flex min-w-max items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] shrink-0")}
                title="Clear Filters"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            <div className="shrink-0">{dateFilterComponent}</div>

            <div className="shrink-0">
              <FilterDropdown categories={[orderStatusFilter]} onFilterSelect={handleFilterSelect} label="Order Status" value={statusFilter ? statusFilter.charAt(0) + statusFilter.slice(1).toLowerCase() : null} />
            </div>
            <div className="shrink-0">
              <FilterDropdown categories={[productTypeFilter]} onFilterSelect={handleFilterSelect} label="Product Type" value={typeFilter ? typeFilter.charAt(0) + typeFilter.slice(1).toLowerCase() : null} />
            </div>
            <div className="shrink-0">
              <button
                onClick={onGenerateReport}
                disabled={isGeneratingReport}
                className={cn(BUTTON_STYLES.secondary.md, "px-3 whitespace-nowrap", buttonTextStyles, "text-[#0F172B]")}
              >
                {isGeneratingReport ? "..." : "Generate Report"}
              </button>
            </div>
            {/* Bulk Action (icon only) */}
            <div className="shrink-0">
              <BulkActionDropdown items={bulkActionItems} iconOnly triggerIcon={CheckSquare2} />
            </div>
          </div>
        </HorizontalScrollContainer>
      </div>
    </div>
  );
}
