"use client";

import React from "react";

import { X, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import { DateRangeFilter } from "@/components/common/filters/DateRangeFilter";

const TRANSACTION_VIA_CATEGORIES = [
  {
    key: "transactionVia",
    label: "By Transaction Via",
    items: [
      { key: "all", label: "All" },
      { key: "boc", label: "BOC" },
      { key: "peoples", label: "Peoples" },
      { key: "hnb", label: "HNB" },
      { key: "ndb", label: "NDB" },
    ],
  },
];

interface OtherIncomeToolbarProps {
  transactionVia: string;
  setTransactionVia: (value: string) => void;
  dateRange: { start: Date | null; end: Date | null };
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
  onExportCsv?: () => void;
}

export function OtherIncomeToolbar({
  transactionVia,
  setTransactionVia,
  dateRange,
  setDateRange,
  onExportCsv,
}: OtherIncomeToolbarProps) {

  const handleDateApply = (start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
  };

  const handleClearFilters = () => {
    setTransactionVia("all");
    setDateRange({ start: null, end: null });
  };

  const hasActiveFilters = transactionVia !== "all" || dateRange.start || dateRange.end;

  const currentSelectionLabel = transactionVia === "all" ? null : TRANSACTION_VIA_CATEGORIES[0].items.find(i => i.key === transactionVia)?.label;

  const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

  return (
    <div className="flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+): Full layout ===== */}
      <div className="hidden w-full items-center justify-between gap-4 lg:flex">
        {/* Left side: Filters */}
        <div className="flex items-center gap-3">
          <FilterDropdown
            label="By Transaction Via"
            value={currentSelectionLabel}
            onFilterSelect={(_, itemKey) => setTransactionVia(itemKey)}
            categories={TRANSACTION_VIA_CATEGORIES}
          />
          <DateRangeFilter
            initialRange={{ from: dateRange.start || undefined, to: dateRange.end || undefined }}
            onApply={handleDateApply}
          />
        </div>

        {/* Right side: Clear + Action */}
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
          <button onClick={onExportCsv} className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}>
            <i className="file-csv h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ===== TABLET (md-lg): Full layout ===== */}
      <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
        <div className="flex items-center gap-3">
          <FilterDropdown
            label="By Transaction Via"
            value={currentSelectionLabel}
            onFilterSelect={(_, itemKey) => setTransactionVia(itemKey)}
            categories={TRANSACTION_VIA_CATEGORIES}
          />
          <DateRangeFilter
            initialRange={{ from: dateRange.start || undefined, to: dateRange.end || undefined }}
            onApply={handleDateApply}
          />
        </div>

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
          <button className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap px-3", buttonTextStyles)}>
            <i className="file-csv h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ===== MOBILE (<md): Action buttons row ===== */}
      <div className="flex w-full flex-col gap-3 md:hidden">
        {/* Action Row */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] shrink-0")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="shrink-0">
              <FilterDropdown
                label="Transaction Via"
                value={currentSelectionLabel}
                onFilterSelect={(_, itemKey) => setTransactionVia(itemKey)}
                categories={TRANSACTION_VIA_CATEGORIES}
              />
            </div>
            <div className="shrink-0">
              <DateRangeFilter
                initialRange={{ from: dateRange.start || undefined, to: dateRange.end || undefined }}
                onApply={handleDateApply}
              />
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(BUTTON_STYLES.outline.md, "px-3 shrink-0")}
                aria-label="More actions"
              >
                <MoreHorizontal className="h-4 w-4 text-[#0F172B]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuItem onClick={onExportCsv} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                <i className="file-csv mr-2 h-4 w-4" />
                Export CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
