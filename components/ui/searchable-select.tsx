"use client";

import * as React from "react";

import { Check, ChevronDown, Search, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AUTH_INPUT } from "@/lib/constants/theme";

export interface SearchableSelectOption {
  value: string;
  label: string;
  subLabel?: string;
  avatarInitials?: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onChange: (value: string) => void;
  onSearchChange: (searchTerm: string) => void;
  searchValue: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  error?: boolean;
  isLoading?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function SearchableSelect({
  options = [],
  value,
  onChange,
  onSearchChange,
  searchValue,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  error,
  isLoading,
  className,
  icon,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-h-10 h-auto w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-[#E60076] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer flex items-center justify-between gap-2",
            !value && AUTH_INPUT.placeholder.replaceAll("placeholder:", ""),
            error && "border-red-500 focus:ring-red-500",
            className
          )}
        >
          <span className="flex items-center gap-2 truncate min-w-0">
            {icon && <span className="shrink-0">{icon}</span>}
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin opacity-50 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
          )}
        </Button>
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
                AUTH_INPUT.placeholder
              )}
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          {/* Results List */}
          <div className="max-h-[220px] space-y-1 overflow-y-auto overflow-x-hidden p-1">
            {isLoading && options.length === 0 ? (
              <div className="py-6 text-center text-sm text-[#64748B]">
                Loading...
              </div>
            ) : options.length === 0 ? (
              <div className="py-6 text-center text-sm text-[#64748B]">
                {emptyMessage}
              </div>
            ) : (
              options.map((option) => {
                const isSelected = value === option.value;

                return (
                  <div
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-slate-100 transition-colors",
                      isSelected && "bg-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {option.avatarInitials && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E2E8F0] text-[10px] font-bold text-[#64748B]">
                          {option.avatarInitials}
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
