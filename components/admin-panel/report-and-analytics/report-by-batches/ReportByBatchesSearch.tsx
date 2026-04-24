"use client";

import React from "react";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";

interface ReportByBatchesSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function ReportByBatchesSearch({ search, onSearchChange }: ReportByBatchesSearchProps) {
  return (
    <div className="mt-6 flex w-full">
      <div className="relative w-full md:w-[320px]">
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
    </div>
  );
}
