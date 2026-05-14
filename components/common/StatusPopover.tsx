"use client";

import * as React from "react";

import { ChevronDown, Loader2 } from "lucide-react";


import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface StatusOption {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  bg: string;
  text: string;
}

interface StatusPopoverProps {
  value: string;
  onValueChange?: (value: string) => void;
  options: StatusOption[];
  dropdownOptions?: StatusOption[];
  className?: string;
  readOnly?: boolean;
  isLoading?: boolean;
}

export function StatusPopover({
  value,
  onValueChange,
  options,
  dropdownOptions,
  className,
  readOnly = false,
  isLoading = false,
}: StatusPopoverProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  if (!selectedOption) return null;

  const formatStatusLabel = (val?: string) => {
    if (!val) return "";

    // Replace underscores/dashes with spaces, lower-case, then Title Case each word
    return val
      .toString()
      .replace(/[_-]+/g, " ")
      .toLowerCase()
      .split(" ")
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
      .join(" ");
  };

  const Chip = ({ option, onClick }: { option: StatusOption; onClick?: () => void }) => (
    <div
      onClick={!isLoading && !readOnly ? onClick : undefined}
      className={cn(
        "inline-flex h-[24px] cursor-pointer items-center justify-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium transition-all",
        "shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]", // Shadow from spec
        isLoading && "opacity-70 cursor-not-allowed",
        className
      )}
      style={{
        fontFamily: "Inter",
        backgroundColor: option.bg,
        color: option.text,
      }}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        option.icon
      )}
      <span>{option.label || formatStatusLabel(option.value)}</span>
      {!readOnly && !isLoading && <ChevronDown className="h-3.5 w-3.5 opacity-50" />}
    </div>
  );

  if (readOnly) {
    return <Chip option={selectedOption} />;
  }

  return (
    <Popover open={open} onOpenChange={!isLoading ? setOpen : undefined}>
      <PopoverTrigger asChild>
        <button 
          title="Change status" 
          className={cn(
            "outline-none ring-0 focus:ring-0",
            isLoading && "cursor-not-allowed"
          )}
          disabled={isLoading}
        >
           <Chip option={selectedOption} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-fit min-w-[140px] p-1 z-[99999999]" align="center">
        <div className="flex flex-col gap-1">
          {(dropdownOptions || options).map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 text-sm hover:bg-slate-100",
                value === option.value && "bg-slate-50"
              )}
              onClick={() => {
                onValueChange?.(option.value);
                setOpen(false);
              }}
            >
               <div
                  className="flex w-full items-center justify-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    backgroundColor: option.bg,
                    color: option.text,
                  }}
               >
                  {option.icon && <span className="scale-75">{option.icon}</span>}
                  {option.label || formatStatusLabel(option.value)}
               </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
