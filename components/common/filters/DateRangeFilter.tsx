"use client";

import { useState, useEffect } from "react";

import { Filter, ChevronDown } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";

import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";

interface DateRangeFilterProps {

  /** Called when the user clicks Apply with the committed [start, end] dates (or nulls if reset). */
  onApply?: (startDate: Date | null, endDate: Date | null) => void;

  /** Label shown on the trigger button when no date is selected. Defaults to "By Date". */
  placeholder?: string;

  /** Optional className passed to the trigger button. */
  className?: string;

  /** Alignment of the popover content. */
  align?: "start" | "center" | "end";
  
  /** Initial date range to display. */
  initialRange?: { from?: Date; to?: Date };
}

export function DateRangeFilter({
  onApply,
  placeholder = "By Date",
  className,
  align = "start",
  initialRange,
}: DateRangeFilterProps) {
  // Applied (committed) dates — drive the button label
  const [startDate, setStartDate] = useState<Date | null>(initialRange?.from || null);
  const [endDate, setEndDate] = useState<Date | null>(initialRange?.to || null);

  // Draft dates — live inside the popover until Apply
  const [draftStart, setDraftStart] = useState<Date | null>(initialRange?.from || null);
  const [draftEnd, setDraftEnd] = useState<Date | null>(initialRange?.to || null);

  // Sync with initialRange if it changes externally
  useEffect(() => {
    setStartDate(initialRange?.from || null);
    setEndDate(initialRange?.to || null);
    setDraftStart(initialRange?.from || null);
    setDraftEnd(initialRange?.to || null);
  }, [initialRange?.from, initialRange?.to]);

  const hasValue = startDate !== null || endDate !== null;

  const getLabel = () => {
    if (startDate && endDate) {
      return `${format(startDate, "MMM dd")} – ${format(endDate, "MMM dd")}`;
    }

    if (startDate) {
      return format(startDate, "MMM dd");
    }

    return placeholder;
  };

  const handleApply = () => {
    setStartDate(draftStart);
    setEndDate(draftEnd);
    onApply?.(draftStart, draftEnd);
  };

  const handleReset = () => {
    setDraftStart(null);
    setDraftEnd(null);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            hasValue
              ? "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#E60076] bg-[#FDF2F8] px-4 py-2 shadow-sm transition-colors hover:bg-[#FCE7F3]"
              : BUTTON_STYLES.outline.md,
            "min-w-[130px] justify-between gap-2 text-[14px] font-semibold leading-[20px]",
            hasValue ? "text-[#E60076]" : "",
            className
          )}
        >
          <div className="flex items-center gap-2">
            <Filter className={cn("h-4 w-4 shrink-0", hasValue ? "text-[#E60076]" : "text-[#64748B]")} />
            <span className="text-left whitespace-nowrap">{getLabel()}</span>
          </div>
          <ChevronDown className={cn("h-4 w-4 shrink-0", hasValue ? "text-[#E60076]" : "text-[#45556C]")} />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-4" align={align}>
        <div className="flex flex-col gap-4">
          <DateRangeCalendar
            startDate={draftStart}
            endDate={draftEnd}
            onDateChange={(start, end) => {
              setDraftStart(start);
              setDraftEnd(end);
            }}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <PopoverClose asChild>
              <Button
                size="sm"
                className="bg-[#E60076] hover:bg-[#D4006D] text-white"
                onClick={handleApply}
              >
                Apply
              </Button>
            </PopoverClose>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
