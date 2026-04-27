"use client";

import React from "react";

import { MoreHorizontal, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import type { FilterCategory } from "@/components/common/dropdowns/FilterDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

interface ProductOption {
  id: string;
  name: string;
}

interface ReportByProductsTopBarProps {
  products?: ProductOption[];
  selectedProductId?: string | null;
  onSelectProduct?: (id: string | null) => void;
  onExport?: () => void;
}

export function ReportByProductsTopBar({
  products = [],
  selectedProductId,
  onSelectProduct,
  onExport,
}: ReportByProductsTopBarProps) {
  const productCategories: FilterCategory[] = [
    {
      key: "product",
      label: "Product",
      items: [
        { key: "all", label: "All Products" },
        ...products.map((p) => ({ key: p.id, label: p.name })),
      ],
    },
  ];

  const selectedLabel = selectedProductId
    ? products.find((p) => p.id === selectedProductId)?.name ?? null
    : null;

  const handleProductSelect = (_categoryKey: string, itemKey: string) => {
    onSelectProduct?.(itemKey === "all" ? null : itemKey);
  };

  const handleClearFilters = () => onSelectProduct?.(null);
  const hasActiveFilters = !!selectedProductId;

  const filterDropdown = (
    <FilterDropdown
      categories={productCategories}
      onFilterSelect={handleProductSelect}
      label="All Products"
      value={selectedLabel}
    />
  );

  const exportButton = (
    <button
      className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}
      onClick={() => onExport?.()}
    >
      <i className="file-csv h-4 w-4" />
      Export CSV
    </button>
  );

  return (
    <div className="flex w-full flex-col">
      {/* DESKTOP/TABLET */}
      <div className="hidden w-full items-center justify-end gap-3 md:flex">
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
        {filterDropdown}
        {exportButton}
      </div>

      {/* MOBILE */}
      <div className="flex w-full items-center justify-between gap-2 md:hidden overflow-x-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <div className="flex items-center gap-2 flex-1 justify-end">
          {hasActiveFilters && (
            <button
              title="clear filters"
              type="button"
              onClick={handleClearFilters}
              className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] shrink-0")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="shrink-0">{filterDropdown}</div>

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
              <DropdownMenuItem onClick={() => onExport?.()} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
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
