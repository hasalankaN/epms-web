"use client";

import React, { useState, useCallback } from "react";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";

import { Input } from "@/components/ui/input";
import type { FilterCategory } from "@/components/common/dropdowns/FilterDropdown";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px]";

// ===== FILTER DATA =====

const orderStatusFilter: FilterCategory = {
  key: "orderStatus",
  label: "Order Status",
  items: [
    { key: "processing", label: "Processing" },
    { key: "pending", label: "Pending" },
    { key: "downloaded", label: "Downloaded" },
    { key: "refunded", label: "Refunded" },
    { key: "dispatched", label: "Dispatched" },
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

export function OrderToolbar() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Track whether a date range has been applied (drives Clear All visibility)
  const [hasDateFilter, setHasDateFilter] = useState(false);

  const hasActiveFilters = hasDateFilter || statusFilter !== null || typeFilter !== null;

  const handleClearFilters = useCallback(() => {
    setStatusFilter(null);
    setTypeFilter(null);
    setHasDateFilter(false);

    // Note: DateRangeFilter manages its own internal state.
    // To clear it, we use a key so it re-mounts on clear.
    setClearKey((k) => k + 1);
  }, []);

  const [clearKey, setClearKey] = useState(0);

  const handleFilterSelect = useCallback((categoryKey: string, _itemKey: string, itemLabel: string) => {
    if (categoryKey === "orderStatus") setStatusFilter(itemLabel);
    else if (categoryKey === "productType") setTypeFilter(itemLabel);
  }, []);

  const dateFilter = (
    <DateRangeFilter
      key={clearKey}
      placeholder="By Date"
      onApply={(start, end) => setHasDateFilter(start !== null || end !== null)}
    />
  );

  return (
    <div className="flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+): Full layout ===== */}
      <div className="hidden w-full items-center justify-between gap-4 lg:flex">
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search by customer Name"
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
          />
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

          {dateFilter}

          <FilterDropdown categories={[orderStatusFilter]} onFilterSelect={handleFilterSelect} label="Order Status" value={statusFilter} />
          <FilterDropdown categories={[productTypeFilter]} onFilterSelect={handleFilterSelect} label="Product Type" value={typeFilter} />
          <button title="Addresses" className={cn(BUTTON_STYLES.secondary.md, "whitespace-nowrap", buttonTextStyles, "text-[#0F172B]")}>
            Addresses
          </button>
        </div>
      </div>

      {/* ===== TABLET (md-lg) ===== */}
      <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
        <div className="relative w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search..."
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
          />
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

          {dateFilter}

          <FilterDropdown categories={[orderStatusFilter]} onFilterSelect={handleFilterSelect} label="Status" value={statusFilter} />
          <FilterDropdown categories={[productTypeFilter]} onFilterSelect={handleFilterSelect} label="Type" value={typeFilter} />
        </div>
      </div>

      {/* ===== MOBILE (<md) ===== */}
      <div className="flex w-full flex-col gap-3 md:hidden">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search by customer Name"
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
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

          <div className="shrink-0">{dateFilter}</div>

          <div className="shrink-0">
            <FilterDropdown categories={[orderStatusFilter]} onFilterSelect={handleFilterSelect} label="Order Status" value={statusFilter} />
          </div>
          <div className="shrink-0">
            <FilterDropdown categories={[productTypeFilter]} onFilterSelect={handleFilterSelect} label="Product Type" value={typeFilter} />
          </div>
          <div className="shrink-0">
            <button className={cn(BUTTON_STYLES.secondary.md, "px-3")}>Addresses</button>
          </div>
        </div>
      </div>
    </div>
  );
}
