"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ROLE_OPTIONS } from "@/data/userManagementData";
import { UserRole } from "@/types/roles";
import Link from "next/link";

interface UserTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: UserRole | "ALL";
  onRoleFilterChange: (value: UserRole | "ALL") => void;
  totalCount: number;
  filteredCount: number;
}

export function UserTableToolbar({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  totalCount,
  filteredCount,
}: UserTableToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Title + Count */}
      <div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          System Users
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {filteredCount === totalCount
            ? `${totalCount} users registered`
            : `${filteredCount} of ${totalCount} users`}
        </p>
      </div>

      {/* Right: Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            id="user-search-input"
            type="text"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-9 w-[200px] text-sm"
          />
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
          <Select
            value={roleFilter}
            onValueChange={(v) => onRoleFilterChange(v as UserRole | "ALL")}
          >
            <SelectTrigger
              id="role-filter-select"
              className="h-9 w-[150px] text-sm"
            >
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Create User */}
        <Button
          id="create-user-btn"
          size="sm"
          className="h-9 bg-indigo-600 hover:bg-indigo-500 text-white gap-1.5"
          asChild
        >
          <Link href="/admin-panel/user-managment/add-employee">
            <span className="text-base leading-none">+</span>
            Create User
          </Link>
        </Button>
      </div>
    </div>
  );
}
