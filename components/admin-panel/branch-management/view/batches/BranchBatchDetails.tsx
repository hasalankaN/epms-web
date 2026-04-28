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

  const tableData: BatchDataType[] = useMemo(() =>
    (data?.results ?? []).map((b) => ({
      id: b.id,
      batchId: b.custom_id ?? "—",
      batchName: b.name ?? "—",
      category: b.category ?? "—",
      branch: b.branch_name ?? "—",
      type: b.type ?? "—",
      lecturer: "—",
      studentsCount: 0,
      payment: "—",
      startDate: fmtDate(b.start_date),
      endDate: fmtDate(b.end_date),
      status: b.status,
    })),
  [data]);

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
