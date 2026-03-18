"use client";

import * as React from "react";

import { X, Check, ChevronDown, Search, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AUTH_INPUT } from "@/lib/constants/theme";

export interface MultiSelectOption {
  value: string;
  label: string;
  avatar?: string | null;
  handle?: string;
  subLabel?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  onSearchChange?: (searchTerm: string) => void;
  searchValue?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  error?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  onSearchChange,
  searchValue,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  error,
  isLoading,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [internalSearch, setInternalSearch] = React.useState("");

  const handleSearch = (term: string) => {
    if (onSearchChange) {
      onSearchChange(term);
    } else {
      setInternalSearch(term);
    }
  };

  const toggleOption = (optionValue: string) => {
    const current = value || [];

    if (current.includes(optionValue)) {
      onChange(current.filter((i) => i !== optionValue));
    } else {
      onChange([...current, optionValue]);
    }
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange((value || []).filter((i) => i !== optionValue));
  };

  // If not in controlled search mode, optionally filter locally, but usually it's fine just showing options
  const displayOptions = onSearchChange 
    ? options 
    : options.filter(opt => 
        opt.label.toLowerCase().includes(internalSearch.toLowerCase()) || 
        opt.handle?.toLowerCase().includes(internalSearch.toLowerCase())
      );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "min-h-10 h-auto w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#E60076] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer flex items-center justify-between gap-2",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
        >
          <div className="flex flex-1 flex-wrap gap-2">
            {(value || []).length > 0 ? (
              value.map((val) => {
                // If option isn't in current list (due to search etc.), just show ID or something if missing
                // To properly show label of already selected items we really need the full list or a map,
                // but let's try to match from options first.
                const option = options.find((o) => o.value === val) || { label: val };

                return (
                  <div
                    key={val}
                    className="flex items-center gap-1 bg-[#F1F5F9] text-[#1D293D] px-2 py-1 rounded-[6px] text-[12px] font-medium leading-4"
                  >
                    {option?.label || val}
                    <X
                      className="h-3 w-3 cursor-pointer text-[#1D293D] hover:text-red-500"
                      onClick={(e) => removeOption(val, e)}
                    />
                  </div>
                );
              })
            ) : (
              <span className="text-[#90A1B9] italic">{placeholder}</span>
            )}
          </div>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin opacity-50 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="z-[99999999] w-[var(--radix-popover-trigger-width)] p-1"
        align="start"
      >
        <div className="flex flex-col">
          {/* Search Input */}
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className={cn(
                "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
                AUTH_INPUT?.placeholder
              )}
              placeholder={searchPlaceholder}
              value={searchValue !== undefined ? searchValue : internalSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          {/* Results List */}
          <div className="max-h-[220px] space-y-1 overflow-y-auto overflow-x-hidden p-1">
            {isLoading && displayOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-[#64748B]">
                Loading...
              </div>
            ) : displayOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-[#64748B]">
                {emptyMessage}
              </div>
            ) : (
              displayOptions.map((option) => {
                const isSelected = (value || []).includes(option.value);

                return (
                  <div
                    key={option.value}
                    onClick={() => toggleOption(option.value)}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-slate-100 transition-colors",
                      isSelected && "bg-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {option.avatar ? (
                        <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden shrink-0">
                          <img src={option.avatar} alt="avatar" />
                        </div>
                      ) : option.handle ? (
                         <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E2E8F0] text-[10px] font-bold text-[#64748B]">
                            {option.handle.substring(0, 2).toUpperCase()}
                         </div>
                      ) : (
                         <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E2E8F0] text-[10px] font-bold text-[#64748B]">
                            {option.label.substring(0, 2).toUpperCase()}
                         </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[#0F172B]">
                          {option.label}
                        </span>
                        {option.subLabel && (
                          <span className="text-xs text-[#64748B]">
                            {option.subLabel}
                          </span>
                        )}
                        {!option.subLabel && option.handle && (
                          <span className="text-xs text-[#64748B]">
                            {option.handle}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Check className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
