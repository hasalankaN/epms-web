"use client";

import React from "react";

import type { LucideIcon } from "lucide-react";
import { Filter, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

export interface FilterCategory {
  key: string;
  label: string;
  icon?: LucideIcon;
  items: FilterItem[];
}

export interface FilterItem {
  key: string;
  label: string;
}

interface FilterDropdownProps {
  categories: FilterCategory[];
  onFilterSelect?: (categoryKey: string, itemKey: string, itemLabel: string) => void;
  className?: string;
  iconOnly?: boolean;
  label?: string;
  value?: string | null;
}

export function FilterDropdown({
  categories,
  onFilterSelect,
  className,
  iconOnly = false,
  label = "Filter Option",
  value = null,
}: FilterDropdownProps) {
  const handleFilterSelect = (categoryKey: string, item: FilterItem) => {
    onFilterSelect?.(categoryKey, item.key, item.label);
  };

  const isSelected = !!value;
  const displayLabel = value ? value : label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            isSelected ? "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#E60076] bg-[#FDF2F8] px-4 py-2 text-[#E60076] shadow-sm transition-colors hover:bg-[#FCE7F3]" : BUTTON_STYLES.outline.md,
            iconOnly ? "px-3" : "min-w-[130px] justify-between gap-2",
            buttonTextStyles,
            isSelected && "text-[#E60076]",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <Filter className={cn("h-4 w-4 shrink-0", isSelected ? "text-[#E60076]" : "text-[#64748B]")} />
            {!iconOnly && (
              <span className="text-left whitespace-nowrap">
                {displayLabel}
              </span>
            )}
          </div>
          {!iconOnly && <ChevronDown className={cn("h-4 w-4 shrink-0", isSelected ? "text-[#E60076]" : "text-[#45556C]")} />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px]">
        {categories.length === 1 ? (

          // Single category: Show items directly
          categories[0].items.map((item) => (
            <DropdownMenuItem
              key={item.key}
              onClick={() => handleFilterSelect(categories[0].key, item)}
              className="cursor-pointer focus:bg-[#FDF2F8]"
            >
              {item.label}
            </DropdownMenuItem>
          ))
        ) : (

          // Multiple categories: Show nested sub-menus
          categories.map((category) => (
            <DropdownMenuSub key={category.key}>
              <DropdownMenuSubTrigger className="cursor-pointer focus:bg-[#FDF2F8] data-[state=open]:bg-[#FDF2F8]">
                {category.label}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-[140px]">
                {category.items.map((item) => (
                  <DropdownMenuItem
                    key={item.key}
                    onClick={() => handleFilterSelect(category.key, item)}
                    className="cursor-pointer focus:bg-[#FDF2F8]"
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
