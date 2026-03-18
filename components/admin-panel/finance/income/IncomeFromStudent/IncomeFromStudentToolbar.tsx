"use client";

import React, { useState, useCallback, useMemo } from "react";

import { X, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { FilterCategory, FilterSelections } from "@/components/common/filters/FilterModal";
import { FilterModal, FilterModalTrigger } from "@/components/common/filters/FilterModal";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

const incomeFilterCategories: FilterCategory[] = [
  {
    key: "date",
    label: "By Date",
    type: "dateRange",
  },
  {
    key: "source",
    label: "By Source",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "batch", label: "Batch" },
      { key: "course", label: "Course" },
      { key: "product", label: "Product" },
    ],
  },
  {
    key: "paymentMethod",
    label: "By Payment Method",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "bank_slip", label: "Bank Slip" },
      { key: "payment_gateway", label: "Payment Gateway" },
    ],
  },
  {
    key: "paymentType",
    label: "By Payment Type",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "complete", label: "Complete" },
      { key: "installments", label: "Installments" },
      { key: "etc", label: "etc" },
    ],
  },
  {
    key: "paymentVia",
    label: "By Payment Via",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "boc", label: "BOC" },
      { key: "peoples", label: "Peoples" },
      { key: "hnb", label: "HNB" },
      { key: "ndb", label: "NDB" },
    ],
  },
  {
    key: "status",
    label: "By Status",
    type: "chips",
    multiSelect: false,
    items: [
      { key: "completed", label: "Completed" },
      { key: "pending", label: "Pending" },
    ],
  },
];

interface IncomeFromStudentToolbarProps {
  onApplyFilters: (filters: Record<string, string | null>) => void;
  onClearFilters: () => void;
  activeUrlFilters: {
    source?: string;
    paymentMethod?: string;
    paymentType?: string;
    paymentVia?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export function IncomeFromStudentToolbar({
  onApplyFilters,
  onClearFilters,
  activeUrlFilters,
}: IncomeFromStudentToolbarProps) {
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const initialSelections = useMemo(() => {
    const selections: FilterSelections = {};

    if (activeUrlFilters.source) selections.source = activeUrlFilters.source.split(",");
    if (activeUrlFilters.paymentMethod) selections.paymentMethod = activeUrlFilters.paymentMethod.split(",");
    if (activeUrlFilters.paymentType) selections.paymentType = activeUrlFilters.paymentType.split(",");
    if (activeUrlFilters.paymentVia) selections.paymentVia = activeUrlFilters.paymentVia.split(",");
    if (activeUrlFilters.status) selections.status = activeUrlFilters.status.split(",");
    
    if (activeUrlFilters.dateFrom || activeUrlFilters.dateTo) {
      selections.date = {
        start: activeUrlFilters.dateFrom ? new Date(activeUrlFilters.dateFrom) : null,
        end: activeUrlFilters.dateTo ? new Date(activeUrlFilters.dateTo) : null,
      };
    }

    return selections;
  }, [activeUrlFilters]);

  const hasActiveFilters = 
    !!activeUrlFilters.source || 
    !!activeUrlFilters.paymentMethod || 
    !!activeUrlFilters.paymentType || 
    !!activeUrlFilters.paymentVia || 
    !!activeUrlFilters.status ||
    !!activeUrlFilters.dateFrom ||
    !!activeUrlFilters.dateTo;

  const handleApplyFilters = useCallback((selections: FilterSelections) => {
    const updates: Record<string, string | null> = {
      source: null,
      paymentMethod: null,
      paymentType: null,
      paymentVia: null,
      status: null,
      dateFrom: null,
      dateTo: null,
    };

    if (Array.isArray(selections.source) && selections.source.length) updates.source = selections.source.join(",");
    if (Array.isArray(selections.paymentMethod) && selections.paymentMethod.length) updates.paymentMethod = selections.paymentMethod.join(",");
    if (Array.isArray(selections.paymentType) && selections.paymentType.length) updates.paymentType = selections.paymentType.join(",");
    if (Array.isArray(selections.paymentVia) && selections.paymentVia.length) updates.paymentVia = selections.paymentVia.join(",");
    if (Array.isArray(selections.status) && selections.status.length) updates.status = selections.status.join(",");

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

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        {/* ===== DESKTOP (lg+): Full layout ===== */}
        <div className="hidden w-full items-center justify-between gap-4 lg:flex">
          {/* Left: empty to keep right aligned */}
          <div className="flex items-center gap-4"></div>

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

        {/* ===== TABLET (md-lg): Full layout ===== */}
        <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
          {/* Left: empty */}
          <div className="flex items-center gap-3"></div>

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

        {/* ===== MOBILE (<md): Action buttons row (no search) ===== */}
        <div className="flex w-full flex-col gap-3 md:hidden">
          {/* Action buttons row */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <div className="flex items-center gap-2 flex-1 justify-end">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] shrink-0")}
                  aria-label="Clear filters"
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
        categories={incomeFilterCategories}
        onApply={handleApplyFilters}
        initialSelections={initialSelections}
      />
    </>
  );
}
