"use client";

import React, { useState, useCallback, useMemo } from "react";

import { Search, X, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

const generalFilterCategories: FilterCategory[] = [
  {
    key: "date",
    label: "By Date",
    type: "dateRange",
  },
  {
    key: "transactionVia",
    label: "Transaction via",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "cash", label: "Cash" },
      { key: "boc", label: "BOC" },
      { key: "peoples", label: "Peoples" },
    ],
  },
];

interface GeneralExpenseToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onApplyFilters: (filters: Record<string, string | null>) => void;
  onClearFilters: () => void;
  activeUrlFilters: {
    transactionVia?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export function GeneralExpenseToolbar({
  search,
  onSearchChange,
  onApplyFilters,
  onClearFilters,
  activeUrlFilters,
}: GeneralExpenseToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const initialSelections = useMemo(() => {
    const selections: FilterSelections = {};

    if (activeUrlFilters.transactionVia) selections.transactionVia = activeUrlFilters.transactionVia.split(",");

    if (activeUrlFilters.dateFrom || activeUrlFilters.dateTo) {
      selections.date = {
        start: activeUrlFilters.dateFrom ? new Date(activeUrlFilters.dateFrom) : null,
        end: activeUrlFilters.dateTo ? new Date(activeUrlFilters.dateTo) : null,
      };
    }

    return selections;
  }, [activeUrlFilters]);

  const hasActiveFilters =
    !!activeUrlFilters.transactionVia ||
    !!activeUrlFilters.dateFrom ||
    !!activeUrlFilters.dateTo;

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    const updates: Record<string, string | null> = {
      transactionVia: null,
      dateFrom: null,
      dateTo: null,
    };

    if (Array.isArray(selections.transactionVia) && selections.transactionVia.length) updates.transactionVia = selections.transactionVia.join(",");

    if (selections.date && !Array.isArray(selections.date)) {
      if (selections.date.start) {
        const d = selections.date.start;

        updates.dateFrom = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }

      if (selections.date.end) {
        const d = selections.date.end;

        updates.dateTo = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }
    }

    onApplyFilters(updates);
  }, [onApplyFilters]);

  const searchInput = (placeholder: string, className?: string) => (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
      />
    </div>
  );

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+): Full layout ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          {searchInput("Search by Description", "w-[320px]")}

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

        {/* ===== TABLET (md-lg): Full layout ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          {searchInput("Search...", "w-[240px]")}

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

        {/* ===== MOBILE (<md): Search + actions ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          {searchInput("Search...", "w-full")}

          <div className="flex items-center justify-between gap-2 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <div className="flex items-center gap-2 flex-1 justify-end">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] shrink-0")}
                  title="Clear filters"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <FilterModalTrigger
                onClick={() => setFilterModalOpen(true)}
                iconOnly
                className={cn(hasActiveFilters && BUTTON_STYLES.active.md, "shrink-0")}
                aria-label="Filter"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(BUTTON_STYLES.outline.md, "px-3 shrink-0")}
                    aria-label="More actions"
                    title="More actions"
                  >
                    <MoreHorizontal className="h-4 w-4 text-[#0F172B]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  <DropdownMenuItem onClick={() => console.log("Export CSV")} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                    <i className="file-csv mr-2 h-4 w-4" />
                    Export CSV
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <FilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        categories={generalFilterCategories}
        onApply={handleApplyFilters}
        initialSelections={initialSelections}
      />
    </>
  );
}
