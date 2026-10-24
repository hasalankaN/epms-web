"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { MoreHorizontal, Eye, UserCog, Trash2 } from "lucide-react";

import { DataTable, Column } from "@/components/common/table/DataTable";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserTableToolbar } from "./UserTableToolbar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { MOCK_USERS, UserRecord } from "@/data/userManagementData";
import { UserRole } from "@/types/roles";

const ITEMS_PER_PAGE = 8;

export function UserManagementTable() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered data
  const filtered = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      const matchesSearch =
        search.trim() === "" ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter]);

  // Reset to page 1 when filters change
  const handleSearchChange = (v: string) => {
    setSearch(v);
    setCurrentPage(1);
  };
  const handleRoleChange = (v: UserRole | "ALL") => {
    setRoleFilter(v);
    setCurrentPage(1);
  };

  // Paginated slice
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Column definitions
  const columns: Column<UserRecord>[] = [
    {
      id: "user",
      header: "User",
      cell: (item) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback
              className={`text-[11px] font-bold text-white bg-gradient-to-br ${item.avatarColor}`}
            >
              {item.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
              {item.name}
            </p>
            <p className="text-[11px] text-slate-400">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      id: "role",
      header: "Role",
      cell: (item) => <UserRoleBadge role={item.role} />,
    },
    {
      id: "department",
      header: "Department",
      cell: (item) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {item.department}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (item) => (
        <Badge
          variant={item.status === "Active" ? "active" : "inactive"}
          className="text-[11px]"
        >
          {item.status}
        </Badge>
      ),
    },
    {
      id: "joinDate",
      header: "Join Date",
      cell: (item) => (
        <span className="text-xs text-slate-500">
          {new Date(item.joinDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      headerClassName: "w-12",
      className: "w-12",
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-slate-700"
              aria-label={`Actions for ${item.name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link
                href={`/admin-panel/user-managment/${item.id}`}
                className="flex items-center gap-2 text-xs"
              >
                <Eye className="h-3.5 w-3.5" />
                View Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 text-xs">
              <UserCog className="h-3.5 w-3.5" />
              Edit Role
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-xs text-red-600 focus:text-red-600 focus:bg-red-50">
              <Trash2 className="h-3.5 w-3.5" />
              Deactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <UserTableToolbar
        search={search}
        onSearchChange={handleSearchChange}
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleChange}
        totalCount={MOCK_USERS.length}
        filteredCount={filtered.length}
      />

      {/* Table */}
      <DataTable<UserRecord>
        data={paginated}
        columns={columns}
        keyExtractor={(item) => item.id}
        showCheckboxes={false}
        tableContainerClassName="h-auto"
        pagination={{
          variant: "simple",
          currentPage,
          totalPages,
          totalCount: filtered.length,
          itemsPerPage: ITEMS_PER_PAGE,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
}
