"use client";

import React from "react";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { AUTH_INPUT } from "@/lib/constants/theme";

import { Input } from "@/components/ui/input";

// ===== COMPONENT =====

export function CategoryTableToolbar() {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative w-[320px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
          <Input
            type="text"
            placeholder="Category name."
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
