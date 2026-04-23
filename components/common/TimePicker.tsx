"use client";

import React, { useRef, useEffect, useCallback, useMemo } from "react";

import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AUTH_INPUT } from "@/lib/constants/theme";

// ===== TYPES =====

interface TimePickerProps {
  value: string | null; // "HH:mm" 24h or null
  onChange: (time: string) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
  disabled?: boolean;
}

// ===== HELPERS =====

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));
const PERIODS = ["AM", "PM"];

function getCurrentTime24h(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  
  return `${h}:${m}`;
}

function parseTime(val: string | null): { hour: string; minute: string; period: string } {
  // Always use a reference time for scrolling/display purposes
  const targetVal = val || getCurrentTime24h();
  const [hStr, mStr] = targetVal.split(":");
  const h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  
  return {
    hour: String(displayHour).padStart(2, "0"),
    minute: mStr || "00",
    period,
  };
}

function toDisplayString(val: string | null): string {
  if (!val) return "";
  const { hour, minute, period } = parseTime(val);

  return `${hour}:${minute} ${period}`;
}

function to24h(hour: string, minute: string, period: string): string {
  let h = parseInt(hour, 10);

  if (period === "AM" && h === 12) h = 0;
  if (period === "PM" && h !== 12) h += 12;
  
  return `${String(h).padStart(2, "0")}:${minute}`;
}

// ===== SCROLL COLUMN =====

function ScrollColumn({
  items,
  selected,
  onSelect,
  isActuallySelected = false,
  loop = false,
}: {
  items: string[];
  selected: string;
  onSelect: (val: string) => void;
  isActuallySelected?: boolean;
  loop?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ITEM_HEIGHT = 36;
  const VISIBLE_ITEMS = 3;
  const CENTER_OFFSET = Math.floor(VISIBLE_ITEMS / 2) * ITEM_HEIGHT;

  const multiplier = loop ? 5 : 1;

  const displayItems = useMemo(() => {
    if (!loop) return items;
    const arr = [];

    for (let i = 0; i < multiplier; i++) arr.push(...items);
    
    return arr;
  }, [items, loop, multiplier]);

  const getNearestIndex = useCallback((val: string) => {
    if (!containerRef.current) return items.indexOf(val);
    
    const currentCenterScroll = containerRef.current.scrollTop + CENTER_OFFSET;
    const currentCenterIdx = Math.round(currentCenterScroll / ITEM_HEIGHT);
    
    const indices: number[] = [];

    displayItems.forEach((item, idx) => {
      if (item === val) indices.push(idx);
    });

    let closest = indices[0];
    let minDiff = Math.abs(closest - currentCenterIdx);

    for (let i = 1; i < indices.length; i++) {
      const diff = Math.abs(indices[i] - currentCenterIdx);

      if (diff < minDiff) {
        minDiff = diff;
        closest = indices[i];
      }
    }

    // Ensure the scroll target is never negative when looping
    if (loop && closest * ITEM_HEIGHT - CENTER_OFFSET < 0) {
      closest += items.length;
    }

    return closest;
  }, [displayItems, items, CENTER_OFFSET, loop]);

  const scrollToValue = useCallback((val: string, behavior: ScrollBehavior = "smooth") => {
    if (!containerRef.current) return;
    
    const idx = getNearestIndex(val);
    const scrollTarget = idx * ITEM_HEIGHT - CENTER_OFFSET;

    containerRef.current.scrollTo({ top: scrollTarget, behavior });
  }, [getNearestIndex, CENTER_OFFSET]);

  const handleScroll = () => {
    if (!loop || !containerRef.current) return;
    const { scrollTop, scrollHeight } = containerRef.current;
    const setHeight = items.length * ITEM_HEIGHT;

    if (scrollTop < setHeight) {
      containerRef.current.scrollTo({ top: scrollTop + setHeight * 2, behavior: "instant" as ScrollBehavior });
    } else if (scrollTop > scrollHeight - setHeight * 2) {
      containerRef.current.scrollTo({ top: scrollTop - setHeight * 2, behavior: "instant" as ScrollBehavior });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current && loop) {
        const midIdx = Math.floor(multiplier / 2) * items.length + items.indexOf(selected);

        containerRef.current.scrollTop = midIdx * ITEM_HEIGHT - CENTER_OFFSET;
      } else if (containerRef.current) {
        scrollToValue(selected, "instant");
      }
    }, 100);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollToValue(selected, "smooth");
  }, [selected, scrollToValue]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex h-[108px] w-12 flex-col overflow-y-auto scroll-smooth scrollbar-none relative"
      style={{ scrollbarWidth: "none" }}
    >
      {!loop && <div style={{ height: CENTER_OFFSET }} className="shrink-0" />}
      
      {displayItems.map((item, i) => {
        const isSelected = item === selected;
        
        return (
          <button
            key={`${item}-${i}`}
            type="button"
            onClick={() => onSelect(item)}
            className={cn(
              "flex h-9 w-12 shrink-0 items-center justify-center text-[13px] transition-all duration-200",
              isSelected && isActuallySelected ? "font-bold text-[#E60076]" : "font-medium text-slate-400 hover:text-slate-600"
            )}
          >
            {item}
          </button>
        );
      })}

      {!loop && <div style={{ height: CENTER_OFFSET }} className="shrink-0" />}
    </div>
  );
}

// ===== COMPONENT =====

export function TimePicker({
  value,
  onChange,
  placeholder = "Pick a time",
  error = false,
  className,
  disabled = false,
}: TimePickerProps) {
  const { hour, minute, period } = useMemo(() => parseTime(value), [value]);

  const handleHourChange = (h: string) => onChange(to24h(h, minute, period));
  const handleMinuteChange = (m: string) => onChange(to24h(hour, m, period));
  const handlePeriodChange = (p: string) => onChange(to24h(hour, minute, p));

  const displayValue = toDisplayString(value);
  const isActuallySelected = value !== null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "flex h-10 w-full cursor-pointer items-center rounded-md border bg-white transition-all hover:bg-slate-50",
            error ? "border-red-500" : "border-gray-300",
            disabled && "pointer-events-none opacity-60",
            className
          )}
        >
          <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
            <Clock className="h-4 w-4 text-[#64748B]" />
          </div>
          <input
            value={displayValue}
            readOnly
            placeholder={placeholder}
            className={cn(
              "flex-1 cursor-pointer bg-transparent px-3 py-2 text-sm outline-none pointer-events-none text-[#1D293D]",
              AUTH_INPUT.placeholder
            )}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0 z-[99999999] rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden"
        align="start"
        sideOffset={6}
      >
        <div className="relative flex items-center bg-white p-2">
          {/* Highlight Bar */}
          <div className="absolute left-0 right-0 top-1/2 h-9 -translate-y-1/2 bg-slate-50 border-y border-slate-100 pointer-events-none" />
          
          {/* Columns */}
          <div className="relative z-10 flex items-center">
            <ScrollColumn items={HOURS} selected={hour} onSelect={handleHourChange} isActuallySelected={isActuallySelected} loop />
            <span className="text-slate-300 font-bold px-1">:</span>
            <ScrollColumn items={MINUTES} selected={minute} onSelect={handleMinuteChange} isActuallySelected={isActuallySelected} loop />
            <div className="w-4" />
            <ScrollColumn items={PERIODS} selected={period} onSelect={handlePeriodChange} isActuallySelected={isActuallySelected} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
