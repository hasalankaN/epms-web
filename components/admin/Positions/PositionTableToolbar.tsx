"use client";

import React from "react";
import { Search, Plus, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PositionTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  totalCount: number;
  filteredCount: number;
  onCreateClick: () => void;
}

export function PositionTableToolbar({
  search,
  onSearchChange,
  totalCount,
  filteredCount,
  onCreateClick,
}: PositionTableToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Title + Count */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            Job Roles & Positions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredCount === totalCount
              ? `${totalCount} job position${totalCount === 1 ? "" : "s"} defined`
              : `${filteredCount} of ${totalCount} positions`}
          </p>
        </div>
      </div>

      {/* Right: Search & Create */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            id="position-search-input"
            type="text"
            placeholder="Search roles or description…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-9 w-[220px] sm:w-[260px] text-xs"
          />
        </div>

        {/* Create Position Button */}
        <Button
          id="create-position-btn"
          size="sm"
          onClick={onCreateClick}
          className="h-9 bg-purple-600 hover:bg-purple-500 text-white gap-1.5 text-xs font-medium shadow-sm transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Role / Position
        </Button>
      </div>
    </div>
  );
}
