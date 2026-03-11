"use client";

import React, { useState, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import type { ComplaintDataType } from "@/types/complaint";

import { PendingAssignmentToolbar } from "./views/PendingAssignment/PendingAssignmentToolbar";
import { PendingAssignmentTable } from "./views/PendingAssignment/PendingAssignmentTable";

// ===== MOCK DATA =====
const mockPendingComplaints: ComplaintDataType[] = Array.from({ length: 15 }, (_, i) => ({
  id: `pending-complaint-${i + 1}`,
  submittedDate: "2026/01/21",
  idNo: `#${String(i + 1).padStart(6, "0")}`,
  submittedBy: i % 2 === 0 ? "by Student Name" : "by Staff {Member name}",
  complainType: (i % 2 === 0 ? "Request" : "Complaint") as ComplaintDataType["complainType"],
  complainStatus: "Pending",
  assignee: "",
}));

export function PendingAssignment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const [data] = useState<ComplaintDataType[]>(mockPendingComplaints);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <PendingAssignmentToolbar />

      {/* Table */}
      <PendingAssignmentTable
        data={data}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </div>
  );
}
