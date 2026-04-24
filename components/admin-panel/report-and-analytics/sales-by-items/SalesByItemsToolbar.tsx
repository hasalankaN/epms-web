"use client";

import React, { useState } from "react";

import { Search, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

interface SalesByItemsToolbarProps {
  onExportCsv?: () => void;
  onSearchChange?: (val: string) => void;
}

export function SalesByItemsToolbar({ onExportCsv, onSearchChange }: SalesByItemsToolbarProps) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    setSearchValue(val);
    onSearchChange?.(val);
  };

  return (
    <div className="mt-4 flex w-full flex-col gap-4">
      {/* ===== DESKTOP (lg+): Full layout ===== */}
      <div className="hidden w-full items-center justify-between gap-4 lg:flex">
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search by item name"
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onExportCsv} 
            className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}
          >
            <i className="file-csv h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ===== TABLET (md-lg) ===== */}
      <div className="hidden w-full flex-col gap-4 md:flex lg:hidden">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              value={searchValue}
              onChange={handleSearch}
              placeholder="Search..."
              className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
            />
          </div>

          <button 
            onClick={onExportCsv} 
            className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}
          >
            <i className="file-csv h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* ===== MOBILE (<md) ===== */}
      <div className="flex w-full flex-col gap-3 md:hidden">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            value={searchValue}
            onChange={handleSearch}
            placeholder="Search by item name"
            className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "w-full border border-[#E2E8F0] pl-10 pr-4")}
          />
        </div>

        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(BUTTON_STYLES.outline.md, "px-3 shrink-0")}
                aria-label="More actions"
                title="More actions"
              >
                <MoreHorizontal className="h-4 w-4 text-[#0F172B]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuItem onClick={onExportCsv} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                <i className="file-csv mr-2 h-4 w-4" />
                Export CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
