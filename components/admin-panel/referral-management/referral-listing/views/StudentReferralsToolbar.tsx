"use client";

import React from "react";

import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";

import { Input } from "@/components/ui/input";

interface StudentReferralsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onClearFilters: () => void;
}

export function StudentReferralsToolbar({
  search,
  onSearchChange,
  onClearFilters,
}: StudentReferralsToolbarProps) {
  const hasActiveFilters = !!search;

  return (
    <div className="flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+): Full layout ===== */}
      <div className="hidden w-full items-center justify-between gap-4 lg:flex">
        {/* Left: Search */}
        <div className="flex items-center gap-4">
          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4"
              )}
            />
          </div>
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-3">
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
        </div>
      </div>

      {/* ===== TABLET (md-lg): Search left, Filter right ===== */}
      <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
        {/* Left: Search */}
        <div className="flex items-center gap-3">
          <div className="relative w-[200px]">
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
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-3">
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
        </div>
      </div>

      {/* ===== MOBILE (<md): Search full width, action buttons row ===== */}
      <div className="flex w-full flex-col gap-3 md:hidden">
        {/* Search - Full width */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              AUTH_INPUT.base,
              AUTH_INPUT.placeholder,
              "w-full border border-[#E2E8F0] pl-10 pr-4"
            )}
          />
        </div>

        {/* Action buttons row */}
        <div className="flex items-center gap-3">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className={cn(BUTTON_STYLES.outline.md, "px-3 border-dashed text-[#64748B] hover:text-[#0F172B]")}
              aria-label="Clear filters"
              title="Clear filters"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
