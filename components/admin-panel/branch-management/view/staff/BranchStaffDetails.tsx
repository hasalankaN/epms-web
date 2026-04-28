"use client";

import React, { useState, useCallback, useMemo } from "react";

import { format } from "date-fns";

import type { StaffDataType } from "@/types/user-management";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";

import { BranchStaffToolbar } from "./BranchStaffToolbar";
import { BranchStaffTable } from "./BranchStaffTable";

const PAGE_SIZE = 10;

interface BranchStaffDetailsProps {
  branchId: string;
}

export function BranchStaffDetails({ branchId }: BranchStaffDetailsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  const { data, isLoading } = useGetStaff({
    branch_id: branchId,
    search: searchQuery || undefined,
    page: currentPage,
    size: PAGE_SIZE,
  });

  const tableData: StaffDataType[] = useMemo(() =>
    (data?.results ?? []).map((s) => ({
      id: s.userId,
      regDate: s.createdAt ? format(new Date(s.createdAt), "MM/dd") : "—",
      idNo: s.customId ?? "—",
      name: `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim() || "—",
      district: s.branchName ?? "—",
      phone: s.mobile ?? "—",
      whatsApp: s.whatsapp ?? "—",
      email: s.email ?? "—",
      privileges: s.privileges?.join(", ") || "—",
      commissions: s.commissionEarned ? `LKR ${parseFloat(s.commissionEarned).toLocaleString("en-LK", { minimumFractionDigits: 2 })}` : "N/A",
      branch: s.branchName ?? "—",
      salaryStatus: (s.salaryStatus as any) ?? "PENDING",
      status: s.status === "ACTIVE" ? "ACTIVE" : "INACTIVE",
      role: s.isBranchManager ? "Manager" : "",
      rawPrivileges: s.privileges ?? [],
      isBranchManager: s.isBranchManager,
    })),
  [data]);

  const totalPages = data?.totalPages ?? 1;
  const totalResults = data?.totalResults ?? 0;

  const handleRowSelectionChange = useCallback((id: string, checked: boolean) => {
    setRowSelection((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setRowSelection(Object.fromEntries(tableData.map((s) => [s.id, true])));
    } else {
      setRowSelection({});
    }
  }, [tableData]);

  const handleSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <BranchStaffToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <BranchStaffTable
        data={tableData}
        rowSelection={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
        onSelectAll={handleSelectAll}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalResults}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
