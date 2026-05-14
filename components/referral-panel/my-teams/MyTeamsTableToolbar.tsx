"use client";

import React from "react";

import { Search, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES, AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";

interface MyTeamsTableToolbarProps {
  onAddMember?: () => void;
  onSearch?: (value: string) => void;
}

export function MyTeamsTableToolbar({
  onAddMember,
  onSearch,
}: MyTeamsTableToolbarProps) {
  return (
    <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
      {/* Search bar */}
      <div className="relative w-full max-w-full md:max-w-[320px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
        <Input
          type="text"
          placeholder="Search by Name, NIC, Phone Number"
          onChange={(e) => onSearch?.(e.target.value)}
          className={cn(
            AUTH_INPUT.base,
            AUTH_INPUT.placeholder,
            "w-full border border-[#E2E8F0] pl-10 pr-4"
          )}
        />
      </div>

      {/* Add Member Button */}
      <div className="flex justify-end">
        <button
          onClick={onAddMember}
          className={cn(
            BUTTON_STYLES.primary.md,
            "flex items-center gap-2 whitespace-nowrap bg-[#E60076] hover:bg-[#D0006B] text-white h-10 px-3 sm:px-6"
          )}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline text-[14px] font-semibold leading-[20px]">
            Add Member
          </span>
        </button>
      </div>
    </div>
  );
}
