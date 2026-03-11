"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { ComplaintDataType } from "@/types/complaint";

import { AllComplaintToolbar } from "./views/AllComplaints/AllComplaintToolbar";
import { AllComplaintTable } from "./views/AllComplaints/AllComplaintTable";

// ===== MOCK DATA =====
const mockComplaints: ComplaintDataType[] = Array.from({ length: 15 }, (_, i) => ({
  id: `complaint-${i + 1}`,
  submittedDate: "2026/01/21",
  idNo: `#${String(i + 1).padStart(6, "0")}`,
  submittedBy: i % 2 === 0 ? "by Student Name" : "by Staff {Member name}",
  complainType: (i % 2 === 0 ? "Request" : "Complaint") as ComplaintDataType["complainType"],
  complainStatus: (["In Progress", "Completed", "Pending"] as ComplaintDataType["complainStatus"][])[i % 3],
  assignee: "Staff Member",
}));

export function AllComplaints() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const [data] = useState<ComplaintDataType[]>(mockComplaints);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => id),
    [rowSelection]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const handleSelectAll = useCallback(() => {
    const newSelection = Object.fromEntries(data.map((item) => [item.id, true]));

    setRowSelection(newSelection);
    toast.success(`Selected all ${data.length} complaints`);
  }, [data]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
    toast.info("Selection cleared");
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one complaint");

      return;
    }

    toast.error(`Deleting ${selectedIds.length} selected complaint(s)`);
    setRowSelection({});
  }, [selectedIds]);

  const bulkActions = useMemo(
    () => ({
      onSelectAll: handleSelectAll,
      onClear: handleClearSelection,
      onDelete: handleDelete,
    }),
    [handleSelectAll, handleClearSelection, handleDelete]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <AllComplaintToolbar
        bulkActions={bulkActions}
        selectedCount={selectedIds.length}
        totalCount={data.length}
      />

      {/* Table */}
      <AllComplaintTable
        data={data}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </div>
  );
}
