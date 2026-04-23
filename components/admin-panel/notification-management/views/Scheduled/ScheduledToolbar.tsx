"use client";

import { Search, X, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { FilterDropdown } from "@/components/common/dropdowns/FilterDropdown";
import type { FilterCategory } from "@/components/common/dropdowns/FilterDropdown";
import { HorizontalScrollContainer } from "@/components/common/HorizontalScrollContainer";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

const scheduledOnCategories: FilterCategory[] = [
  {
    key: "scheduledOn",
    label: "Scheduled On",
    items: [
      { key: "today", label: "Today" },
      { key: "this-week", label: "This Week" },
      { key: "this-month", label: "This Month" },
      { key: "last-month", label: "Last Month" },
    ],
  },
];

const scheduledForCategories: FilterCategory[] = [
  {
    key: "scheduledFor",
    label: "Scheduled For",
    items: [
      { key: "today", label: "Today" },
      { key: "this-week", label: "This Week" },
      { key: "this-month", label: "This Month" },
      { key: "next-month", label: "Next Month" },
    ],
  },
];

const channelCategories: FilterCategory[] = [
  {
    key: "channel",
    label: "All Channels",
    items: [
      { key: "sms", label: "SMS" },
      { key: "email", label: "Email" },
      { key: "push", label: "Push" },
    ],
  },
];

const recipientCategories: FilterCategory[] = [
  {
    key: "recipient",
    label: "All Recipients",
    items: [
      { key: "all-users", label: "All Users" },
      { key: "students", label: "Students" },
      { key: "staff", label: "Staff" },
      { key: "lecturers", label: "Lecturers" },
      { key: "batches", label: "Batches" },
      { key: "courses", label: "Courses" },
      { key: "referrals", label: "Referrals" },
    ],
  },
];

interface ScheduledToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  scheduledOnValue: string | null;
  scheduledForValue: string | null;
  channelValue: string | null;
  recipientValue: string | null;
  onFilterSelect: (key: string, value: string, label: string) => void;
  onClearFilters?: () => void;
}

export function ScheduledToolbar({
  search,
  onSearchChange,
  scheduledOnValue,
  scheduledForValue,
  channelValue,
  recipientValue,
  onFilterSelect,
  onClearFilters,
}: ScheduledToolbarProps) {
  const hasActiveFilters = !!(scheduledOnValue || scheduledForValue || channelValue || recipientValue);

  return (
    <div className="flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+): Full layout ===== */}
      <div className="hidden w-full items-center justify-between gap-4 lg:flex">
        {/* Left: Search */}
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              AUTH_INPUT.base,
              AUTH_INPUT.placeholder,
              "w-full border border-[#E2E8F0] pl-10 pr-4"
            )}
          />
        </div>

        {/* Right: Filters */}
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          )}
          <FilterDropdown
            categories={scheduledOnCategories}
            label="Scheduled On"
            value={scheduledOnValue}
            onFilterSelect={onFilterSelect}
          />
          <FilterDropdown
            categories={scheduledForCategories}
            label="Scheduled For"
            value={scheduledForValue}
            onFilterSelect={onFilterSelect}
          />
          <FilterDropdown
            categories={channelCategories}
            label="All Channels"
            value={channelValue}
            onFilterSelect={onFilterSelect}
          />
          <FilterDropdown
            categories={recipientCategories}
            label="All Recipients"
            value={recipientValue}
            onFilterSelect={onFilterSelect}
          />
        </div>
      </div>

      {/* ===== TABLET (md-lg): Condensed layout ===== */}
      <div className="hidden w-full flex-col gap-3 md:flex lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4"
              )}
            />
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className={cn(BUTTON_STYLES.outline.md, "border-dashed text-[#64748B] hover:text-[#0F172B]")}
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown
            categories={scheduledOnCategories}
            label="Scheduled On"
            value={scheduledOnValue}
            onFilterSelect={onFilterSelect}
          />
          <FilterDropdown
            categories={scheduledForCategories}
            label="Scheduled For"
            value={scheduledForValue}
            onFilterSelect={onFilterSelect}
          />
          <FilterDropdown
            categories={channelCategories}
            label="All Channels"
            value={channelValue}
            onFilterSelect={onFilterSelect}
          />
          <FilterDropdown
            categories={recipientCategories}
            label="All Recipients"
            value={recipientValue}
            onFilterSelect={onFilterSelect}
          />
        </div>
      </div>

      {/* ===== MOBILE (<md): Search full width, scrollable filters below ===== */}
      <div className="flex w-full flex-col gap-3 md:hidden">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              AUTH_INPUT.base,
              AUTH_INPUT.placeholder,
              "w-full border border-[#E2E8F0] pl-10 pr-4"
            )}
          />
        </div>

        <HorizontalScrollContainer className="w-full pb-2">
          <div className="flex min-w-max items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B] shrink-0")}
                aria-label="Clear filters"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <div className="shrink-0">
              <FilterDropdown
                categories={scheduledOnCategories}
                label="Scheduled On"
                value={scheduledOnValue}
                onFilterSelect={onFilterSelect}
              />
            </div>
            <div className="shrink-0">
              <FilterDropdown
                categories={scheduledForCategories}
                label="Scheduled For"
                value={scheduledForValue}
                onFilterSelect={onFilterSelect}
              />
            </div>
            <div className="shrink-0">
              <FilterDropdown
                categories={channelCategories}
                label="All Channels"
                value={channelValue}
                onFilterSelect={onFilterSelect}
              />
            </div>
            <div className="shrink-0">
              <FilterDropdown
                categories={recipientCategories}
                label="All Recipients"
                value={recipientValue}
                onFilterSelect={onFilterSelect}
              />
            </div>
          </div>
        </HorizontalScrollContainer>
      </div>
    </div>
  );
}
