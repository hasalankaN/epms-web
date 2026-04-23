"use client";

import React from "react";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { AUTH_INPUT } from "@/lib/constants/theme";

import { Input } from "@/components/ui/input";
import { HorizontalScrollContainer } from "@/components/common/HorizontalScrollContainer";

// ===== TYPES =====
interface ProductCategoryTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

// ===== COMPONENT =====

export function ProductCategoryTableToolbar({
  search,
  onSearchChange,
}: ProductCategoryTableToolbarProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+): Full layout with horizontal slide ===== */}
      <HorizontalScrollContainer className="w-full pb-1" containerClassName="hidden lg:block">
        <div className="flex min-w-max items-center justify-between gap-4">
          {/* Left: Search */}
          <div className="flex shrink-0 items-center gap-4">
            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by Category Name"
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

          {/* Right: Empty for now (Add button is in parent) */}
          <div className="flex shrink-0 items-center gap-3"></div>
        </div>
      </HorizontalScrollContainer>

      {/* ===== TABLET (md–lg): Search left with horizontal slide ===== */}
      <HorizontalScrollContainer className="w-full pb-1" containerClassName="hidden md:block lg:hidden">
        <div className="flex min-w-max items-center justify-between gap-4">
          {/* Left: Search */}
          <div className="flex shrink-0 items-center gap-3">
            <div className="relative w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
              <Input
                type="text"
                placeholder="Search by Category Name"
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

          {/* Right: Empty for now */}
          <div className="flex shrink-0 items-center gap-3"></div>
        </div>
      </HorizontalScrollContainer>

      {/* ===== MOBILE (<md): Search full width ===== */}
      <div className="flex w-full flex-col gap-3 md:hidden">
        {/* Search - Full width */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search by Category Name"
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
    </div>
  );
}
