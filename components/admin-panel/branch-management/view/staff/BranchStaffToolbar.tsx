"use client";

import React from "react";

import { Search, MoreHorizontal, FileDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import type { ExportItem } from "@/components/common/dropdowns/ExportDropdown";
import { ExportDropdown } from "@/components/common/dropdowns/ExportDropdown";

const buttonTextStyles = "text-[14px] font-semibold leading-[20px] text-[#0F172B]";

const staffExportItems: ExportItem[] = [
  { key: "csv", label: "Export CSV", icon: (() => <FileDown className="h-4 w-4" />) as any, onClick: () => console.log("Export CSV") },
];

// ===== TYPES =====

interface BranchStaffToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

// ===== COMPONENT =====

export function BranchStaffToolbar({
  searchQuery,
  onSearchChange,
}: BranchStaffToolbarProps) {
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
              placeholder="Search by Name, NIC, Phone Number"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4 italic"
              )}
            />
          </div>
        </div>

        {/* Right: Export CSV (button) */}
        <div className="flex items-center gap-3">
          <button className={cn(BUTTON_STYLES.outline.md, "whitespace-nowrap", buttonTextStyles)}>
            <i className="file-csv h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ===== TABLET (md-lg): Search left, Export dropdown right ===== */}
      <div className="hidden w-full items-center justify-between gap-4 md:flex lg:hidden">
        {/* Left: Search */}
        <div className="flex items-center gap-3">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "w-full border border-[#E2E8F0] pl-10 pr-4 italic"
              )}
            />
          </div>
        </div>

        {/* Right: Export Dropdown */}
        <div className="flex items-center gap-3">
          <ExportDropdown items={staffExportItems} />
        </div>
      </div>

      {/* ===== MOBILE (<md): Search full width, action buttons row ===== */}
      <div className="flex w-full flex-col gap-3 md:hidden">
        {/* Search - Full width */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Search by Name, NIC, Phone Number"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              AUTH_INPUT.base,
              AUTH_INPUT.placeholder,
              "w-full border border-[#E2E8F0] pl-10 pr-4 italic"
            )}
          />
        </div>

        {/* Action buttons row: More Actions Dropdown (CSV) */}
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className={cn(BUTTON_STYLES.outline.md, "px-3")}
                aria-label="More actions"
                title="More actions"
              >
                <MoreHorizontal className="h-4 w-4 text-[#0F172B]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuItem onClick={() => console.log("Export CSV")} className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]">
                <FileDown className="mr-2 h-4 w-4" />
                Export CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}


