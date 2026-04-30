"use client";

import React from "react";

import type { LucideIcon } from "lucide-react";
import { Filter, ChevronDown, Loader2, Search, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
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
  triggerIcon?: LucideIcon;
  isLoading?: boolean;
  responsive?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export function FilterDropdown({
  categories,
  onFilterSelect,
  className,
  iconOnly = false,
  label = "Filter Option",
  value = null,
  triggerIcon: TriggerIcon = Filter,
  isLoading = false,
  responsive = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
}: FilterDropdownProps) {
  if (isLoading) {
    return (
      <button
        disabled
        className={cn(
          BUTTON_STYLES.outline.md,
          "cursor-not-allowed opacity-70",
          iconOnly || responsive ? "px-3 min-w-10 lg:min-w-[140px]" : "min-w-[140px] justify-between gap-2",
          responsive ? "justify-center lg:justify-between" : "",
          buttonTextStyles,
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#64748B]" />
          {!iconOnly && (
            <span className={cn(
              "text-left whitespace-nowrap",
              responsive ? "hidden lg:inline" : ""
            )}>
              Loading...
            </span>
          )}
        </div>
      </button>
    );
  }

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
            iconOnly || responsive ? "px-3 min-w-10 lg:min-w-[140px]" : "min-w-[130px] justify-between gap-2",
            responsive ? "justify-center lg:justify-between" : "",
            buttonTextStyles,
            isSelected && "text-[#E60076]",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <TriggerIcon className={cn("h-4 w-4 shrink-0", isSelected ? "text-[#E60076]" : "text-[#64748B]")} />
            {!iconOnly && (
              <span className={cn(
                "text-left whitespace-nowrap",
                responsive ? "hidden lg:inline" : ""
              )}>
                {displayLabel}
              </span>
            )}
          </div>
          {!iconOnly && <ChevronDown className={cn(
            "h-4 w-4 shrink-0", 
            isSelected ? "text-[#E60076]" : "text-[#45556C]",
            responsive ? "hidden lg:inline" : ""
          )} />}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px] p-1">
        {onSearchChange && (
          <div className="flex items-center border-b border-slate-100 px-3 py-2 mb-1">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50 text-[#64748B]" />
            <input
              className={cn(
                "flex h-8 w-full rounded-md bg-transparent text-sm outline-none",
                AUTH_INPUT.placeholder
              )}
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
        {categories.length === 1 ? (

          // Single category: Show items directly
          categories[0].items.map((item) => {
            const isItemActive = item.label === value || item.label.split(" (")[0] === value || (!value && item.key === "all");

            return (
              <DropdownMenuItem
                key={item.key}
                onClick={() => handleFilterSelect(categories[0].key, item)}
                className={cn(
                  "flex items-center justify-between cursor-pointer focus:bg-[#FDF2F8]",
                  isItemActive && "bg-[#FDF2F8] text-[#E60076]"
                )}
              >
                <span>{item.label}</span>
                {isItemActive && <Check className="h-4 w-4 shrink-0" />}
              </DropdownMenuItem>
            );
          })
        ) : (

          // Multiple categories: Show nested sub-menus
          categories.map((category) => (
            <DropdownMenuSub key={category.key}>
              <DropdownMenuSubTrigger className="cursor-pointer focus:bg-[#FDF2F8] data-[state=open]:bg-[#FDF2F8]">
                {category.label}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-[140px] p-1">
                {category.items.map((item) => {
                  const isItemActive = item.label === value || item.label.split(" (")[0] === value || (!value && item.key === "all");

                  return (
                    <DropdownMenuItem
                      key={item.key}
                      onClick={() => handleFilterSelect(category.key, item)}
                      className={cn(
                        "flex items-center justify-between cursor-pointer focus:bg-[#FDF2F8]",
                        isItemActive && "bg-[#FDF2F8] text-[#E60076]"
                      )}
                    >
                      <span>{item.label}</span>
                      {isItemActive && <Check className="h-4 w-4 shrink-0" />}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
