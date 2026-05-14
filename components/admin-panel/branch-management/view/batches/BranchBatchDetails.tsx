"use client";

import React, { useState, useCallback, useMemo } from "react";

import { format } from "date-fns";

import type { BatchDataType } from "@/types/batch";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";

import { BranchBatchToolbar } from "./BranchBatchToolbar";
import { BranchBatchTable } from "./BranchBatchTable";

const PAGE_SIZE = 10;

interface BranchBatchDetailsProps {
  branchId: string;
}

function fmtDate(val: string | null | undefined) {
  if (!val) return "—";
  try { return format(new Date(val), "yyyy/MM/dd"); } catch { return val; }
}

export function BranchBatchDetails({ branchId }: BranchBatchDetailsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  const { data, isLoading } = useGetBatches({
    branch_id: branchId,
    search: searchQuery || undefined,
    page: currentPage,
    size: PAGE_SIZE,
  });

  const tableData: BatchDataType[] = useMemo(() => {
    if (!data?.results) return [];

    return data.results.map((b) => {
      // Helper to convert UPPERCASE/SNAKE_CASE to Title Case
      const toTitleCase = (str?: string) => {
        if (!str) return "—";
        
        return str
          .toLowerCase()
          .split(/[_\s]+/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      };

      // Map API status (UPPERCASE) to Frontend status (Title Case)
      let displayStatus: BatchDataType["status"] = "Active";
      const apiStatus = b.status?.toUpperCase();
      
      if (apiStatus === "ACTIVE") displayStatus = "Active";
      else if (apiStatus === "UPCOMING") displayStatus = "Upcoming";
      else if (apiStatus === "COMPLETED") displayStatus = "Completed";
      else if (apiStatus === "INACTIVE") displayStatus = "Inactive";

      return {
        id: b.id,
        batchId: b.custom_id ?? "—",
        batchName: b.name ?? "—",
        category: toTitleCase(b.category),
        branch: b.branch_name ?? "—",
        type: toTitleCase(b.type),
        lecturer: b.lecturer_name || b.lecturer_email || "—",
        studentsCount: b.student_count || 0,
        payment: b.is_paid ? "Paid" : "Free",
        startDate: fmtDate(b.start_date),
        endDate: fmtDate(b.end_date),
        status: displayStatus,
      };
    });
  }, [data]);

  const totalPages = data?.totalPages ?? 1;
  const totalResults = data?.totalResults ?? 0;

  const handleRowSelectionChange = useCallback((id: string, checked: boolean) => {
    setRowSelection((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setRowSelection(Object.fromEntries(tableData.map((b) => [b.id, true])));
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
      <BranchBatchToolbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <BranchBatchTable
        data={tableData}
        rowSelection={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
        onSelectAll={handleSelectAll}
        onStatusChange={() => {}}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalResults}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
