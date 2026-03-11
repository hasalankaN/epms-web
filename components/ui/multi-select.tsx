"use client";

import * as React from "react";

import { X, Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface MultiSelectOption {
  value: string;
  label: string;
  avatar?: string;
  handle?: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  placeholder = "Select...",
  error,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const toggleOption = (optionValue: string) => {
    const current = value;

    if (current.includes(optionValue)) {
      onChange(current.filter((i) => i !== optionValue));
    } else {
      onChange([...current, optionValue]);
    }
  };

  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((i) => i !== optionValue));
  };

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
            {value.length > 0 ? (
              value.map((val) => {
                const option = options.find((o) => o.value === val);

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
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-1"
        align="start"
      >
        <div className="space-y-1">
          {options.map((option) => {
            const isSelected = value.includes(option.value);

            return (
              <div
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-slate-100 transition-colors",
                  isSelected && "bg-slate-100"
                )}
              >
                <div className="flex items-center gap-2">
                  {option.avatar && (
                    <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden shrink-0">
                      <img src={option.avatar} alt="avatar" />
                    </div>
                  )}
                  <span className="text-[#0F172B] text-sm font-medium">
                    {option.label}
                  </span>
                  {option.handle && (
                    <span className="text-[#64748B] text-xs">
                      {option.handle}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
