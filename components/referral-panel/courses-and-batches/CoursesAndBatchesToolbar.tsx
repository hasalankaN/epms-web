"use client";

import React from "react";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";

interface CoursesAndBatchesToolbarProps {
  placeholder: string;
  onSearch: (value: string) => void;
}

export function CoursesAndBatchesToolbar({
  placeholder,
  onSearch,
}: CoursesAndBatchesToolbarProps) {
  return (
    <div className="relative w-full max-w-[400px]">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
      <Input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className={cn(
          AUTH_INPUT.base,
          AUTH_INPUT.placeholder,
          "w-full border border-[#E2E8F0] pl-10 pr-4 h-10 rounded-lg text-[13px]"
        )}
      />
    </div>
  );
}
