"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";

import { X, Plus, Filter, Loader2 } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";

import { FilterChip } from "./FilterChip";
import { DateRangeCalendar } from "./DateRangeCalendar";

// ===== TYPES =====

export interface FilterCategory {
  key: string;
  label: string;
  type: "chips" | "date" | "dateRange";
  items?: FilterItem[];
  multiSelect?: boolean;
  onShowMore?: (categoryKey: string) => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export interface FilterItem {
  key: string;
  label: string;
}

export interface FilterSelections {
  [categoryKey: string]: string[] | { start: Date | null; end: Date | null };
}

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: FilterCategory[];
  onApply: (selections: FilterSelections) => void;
  className?: string;
  initialSelections?: FilterSelections;
  multiSelect?: boolean;
}

// ===== COMPONENT =====

const PAGE_SIZE = 10;

export function FilterModal({
  open,
  onOpenChange,
  categories,
  onApply,
  className,
  initialSelections = {},
  multiSelect: globalMultiSelect,
}: FilterModalProps) {
  const [selections, setSelections] = useState<FilterSelections>(initialSelections);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const [loadingCategories, setLoadingCategories] = useState<Record<string, boolean>>({});

  const [followUpDates, setFollowUpDates] = useState<{ start: Date | null; end: Date | null }>(
    (initialSelections["followUp"] as { start: Date | null; end: Date | null }) || {
      start: null,
      end: null,
    }
  );

  const [isFollowUpRange, setIsFollowUpRange] = useState(
    !!(initialSelections["followUp"] as { start: Date | null; end: Date | null })
  );

  // Initialize visible counts when modal opens or categories change
  useEffect(() => {
    if (open) {
      setSelections(initialSelections);
      const initialFollowUp = (initialSelections["followUp"] as { start: Date | null; end: Date | null }) || { start: null, end: null };

      setFollowUpDates(initialFollowUp);
      setIsFollowUpRange(!!initialSelections["followUp"]);

      // Reset visible counts to PAGE_SIZE
      const counts: Record<string, number> = {};

      categories.forEach((cat) => {
        counts[cat.key] = PAGE_SIZE;
      });
      setVisibleCounts(counts);
    }
  }, [open, initialSelections, categories]);

  // Calculate dateSelection early to use in useMemo dependencies
  const dateSelection = useMemo(
    () => (selections["date"] as { start: Date | null; end: Date | null }) || { start: null, end: null },
    [selections]
  );

  // ===== DERIVED VALUES =====

  const selectedChips = useMemo(() => {
    const chips: { categoryKey: string; itemKey: string; label: string }[] = [];

    // Add chip selections
    Object.entries(selections).forEach(([categoryKey, value]) => {
      if (Array.isArray(value)) {
        value.forEach((itemKey) => {
          const category = categories.find((c) => c.key === categoryKey);
          const item = category?.items?.find((i) => i.key === itemKey);

          if (item) {
            chips.push({ categoryKey, itemKey, label: item.label });
          }
        });
      }

    });

    return chips;
  }, [selections, categories]);

  const totalSelectedCount = useMemo(() => {
    let count = selectedChips.length;

    // Count date selections (only if both are present for range)
    if (dateSelection.start && dateSelection.end) {
      count += 1;
    }

    if (followUpDates.start && followUpDates.end) {
      count += 1;
    } else if (!isFollowUpRange && followUpDates.start) {
      // If single date mode, only start is needed
      count += 1;
    }

    return count;
  }, [selectedChips, dateSelection, followUpDates, isFollowUpRange]);

  // ===== HANDLERS =====

  const handleChipToggle = useCallback((categoryKey: string, itemKey: string) => {
    setSelections((prev) => {
      const category = categories.find((c) => c.key === categoryKey);

      // Priority: Category level -> Global level -> Default (true)
      const isMultiSelect = category?.multiSelect ?? globalMultiSelect ?? true;

      const current = (prev[categoryKey] as string[]) || [];
      const isSelected = current.includes(itemKey);

      if (!isMultiSelect) {
        return {
          ...prev,
          [categoryKey]: isSelected ? [] : [itemKey],
        };
      }

      return {
        ...prev,
        [categoryKey]: isSelected
          ? current.filter((k) => k !== itemKey)
          : [...current, itemKey],
      };
    });
  }, [categories, globalMultiSelect]);

  const handleShowMore = useCallback((categoryKey: string) => {
    const category = categories.find(c => c.key === categoryKey);
    
    if (category?.onShowMore) {
      category.onShowMore(categoryKey);
      
      return;
    }

    setLoadingCategories(prev => ({ ...prev, [categoryKey]: true }));
    
    // Simulate loading
    setTimeout(() => {
      setVisibleCounts(prev => ({
        ...prev,
        [categoryKey]: (prev[categoryKey] || PAGE_SIZE) + PAGE_SIZE,
      }));
      setLoadingCategories(prev => ({ ...prev, [categoryKey]: false }));
    }, 600);
  }, [categories]);

  const handleDateChange = useCallback((start: Date | null, end: Date | null) => {
    setSelections((prev) => ({
      ...prev,
      date: { start, end },
    }));
  }, []);

  const handleFollowUpDateChange = useCallback((start: Date | null, end: Date | null) => {
    setFollowUpDates({ start, end });
  }, []);

  const handleClearAll = useCallback(() => {
    setSelections({});
    setFollowUpDates({ start: null, end: null });
    setIsFollowUpRange(false);
    onApply({});
    onOpenChange(false);
  }, [onApply, onOpenChange]);

  const handleApply = useCallback(() => {
    const finalSelections = { ...selections };

    if (followUpDates.start || followUpDates.end) {
      finalSelections["followUp"] = followUpDates;
    }

    onApply(finalSelections);
    onOpenChange(false);
  }, [selections, followUpDates, onApply, onOpenChange]);

  const handleRemoveChip = useCallback((categoryKey: string, itemKey: string) => {
    setSelections((prev) => {
      const current = (prev[categoryKey] as string[]) || [];

      return {
        ...prev,
        [categoryKey]: current.filter((k) => k !== itemKey),
      };
    });
  }, []);

  // ===== RENDER =====

  const renderCategory = (category: FilterCategory) => {
    if (category.type === "dateRange" && category.key === "date") {
      return (
        <div key={category.key} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold leading-5 text-[#0F172B]">{category.label}</h3>
            <span className="text-sm italic font-normal leading-5 text-[#90A1B9]">
              Today date: {format(new Date(), "dd/MM/yyyy")}
            </span>
          </div>
          <DateRangeCalendar
            startDate={dateSelection.start}
            endDate={dateSelection.end}
            onDateChange={handleDateChange}
          />
        </div>
      );
    }

    if (category.type === "dateRange" && category.key === "followUp") {
      return (
        <div key={category.key} className="space-y-3">
          <h3 className="text-sm font-semibold leading-5 text-[#0F172B]">{category.label}</h3>
          <DateRangeCalendar
            startDate={followUpDates.start}
            endDate={followUpDates.end}
            onDateChange={handleFollowUpDateChange}
            mode={isFollowUpRange ? "range" : "single"}
          />
          <button
            type="button"
            onClick={() => setIsFollowUpRange(!isFollowUpRange)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E8F0] px-3 py-2 text-sm font-semibold text-[#0F172B] hover:bg-[#F8FAFC]"
          >
            <Plus className="h-4 w-4" />
            {isFollowUpRange ? "Add Single Date" : "Add Date Range"}
          </button>
        </div>
      );
    }

    if (category.type === "chips" && category.items) {
      const selectedItems = (selections[category.key] as string[]) || [];
      const visibleCount = visibleCounts[category.key] || PAGE_SIZE;
      const isLoading = category.isLoading ?? loadingCategories[category.key];
      
      const visibleItems = category.onShowMore ? category.items : category.items.slice(0, visibleCount);
      const hasMore = category.hasMore ?? (category.items.length > visibleCount);

      return (
        <div key={category.key} className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold leading-5 text-[#0F172B]">{category.label}</h3>
          <div className="flex flex-wrap gap-2">
            {visibleItems.map((item) => (
              <FilterChip
                key={item.key}
                label={item.label}
                selected={selectedItems.includes(item.key)}
                onClick={() => handleChipToggle(category.key, item.key)}
              />
            ))}
            
            {hasMore && (
              <button
                type="button"
                onClick={() => handleShowMore(category.key)}
                disabled={isLoading}
                className={cn(
                  "inline-flex h-[26px] items-center justify-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-2 py-[2px] text-sm font-semibold transition-colors hover:border-[#CBD5E1] hover:bg-[#F8FAFC]",
                  isLoading ? "text-[#90A1B9] cursor-not-allowed" : "text-[#F6339A]"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    <span>Show More</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  // Format date range for header chip
  const dateRangeLabel = useMemo(() => {
    if (dateSelection.start && dateSelection.end) {
      return `From ${format(dateSelection.start, "dd/MM/yyyy")} To ${format(dateSelection.end, "dd/MM/yyyy")}`;
    }

    if (dateSelection.start) {
      return `From ${format(dateSelection.start, "dd/MM/yyyy")}`;
    }

    return null;
  }, [dateSelection]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        animateChildren
        className={cn(
          "flex max-h-[90vh] w-full max-w-[720px] flex-col gap-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden",
          className
        )}
      >
        {/* ===== STATIC HEADER ===== */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
              Filter Options
            </DialogTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>

          {/* Separator 12px below title */}
          <div className="border-b border-[#E2E8F0]" />

          {/* Selected Count - 16px below separator */}
          <div className="text-sm font-normal leading-5">
            <span className="text-[#90A1B9]">Selected </span>
            <span className="text-xs font-normal leading-4 text-[#F6339A]">{totalSelectedCount}</span>
            <span className="text-[#90A1B9]">/8</span>
          </div>

          {/* Selected Filter Chips */}
          {(selectedChips.length > 0 || dateRangeLabel) && (
            <div className="flex flex-wrap items-center gap-2">
              {dateRangeLabel && (
                <span className="inline-flex items-center gap-1 rounded-[40px] bg-[#F1F5F9] px-3 py-1 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
                  <span className="text-xs font-semibold leading-4 text-[#90A1B9]">From</span>
                  <span className="text-sm font-medium leading-5 text-black">
                    {dateSelection.start ? format(dateSelection.start, "dd/MM/yyyy") : ""}
                  </span>
                  <span className="text-xs font-semibold leading-4 text-[#90A1B9]">To</span>
                  <span className="text-sm font-medium leading-5 text-black">
                    {dateSelection.end ? format(dateSelection.end, "dd/MM/yyyy") : ""}
                  </span>
                </span>
              )}
              {selectedChips.map((chip) => (
                <span
                  key={`${chip.categoryKey}-${chip.itemKey}`}
                  className="inline-flex items-center gap-1 rounded-[40px] bg-[#F1F5F9] px-3 py-1 text-sm font-medium leading-5 text-black shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]"
                >
                  {chip.label}
                  <button
                    type="button"
                    onClick={() => handleRemoveChip(chip.categoryKey, chip.itemKey)}
                    className="ml-0.5 text-[#64748B] hover:text-[#0F172B]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="mb-2 border-b border-[#CAD5E2]" />
        </motion.div>

        {/* ===== SCROLLABLE BODY ===== */}
        <motion.div variants={itemVariants} className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {categories.map(renderCategory)}
          </div>
        </motion.div>

        {/* ===== STATIC FOOTER ===== */}
        <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 mt-5 border-t border-[#E2E8F0] pt-4">
          <button
            type="button"
            onClick={handleClearAll}
            className={cn(BUTTON_STYLES.secondary.md, "text-sm font-semibold text-[#0F172B]")}
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={totalSelectedCount === 0}
            className={cn(BUTTON_STYLES.primary.md, "text-sm font-semibold text-white")}
          >
            Show Results
          </button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// ===== TRIGGER BUTTON =====

interface FilterModalTriggerProps {
  onClick: () => void;
  iconOnly?: boolean;
  label?: string;
  className?: string;
}

export function FilterModalTrigger({
  onClick,
  iconOnly = false,
  label = "Filter Option",
  className,
}: FilterModalTriggerProps) {
  const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        BUTTON_STYLES.secondary.md,
        iconOnly ? "px-3" : "whitespace-nowrap",
        buttonTextStyles,
        className
      )}
    >
      <Filter className="h-4 w-4" />
      {!iconOnly && label}
    </button>
  );
}
