"use client";

import React, { useState, useMemo, useCallback } from "react";

import type { BatchDataType } from "@/types/batch";

import { BranchBatchToolbar } from "./BranchBatchToolbar";
import { BranchBatchTable } from "./BranchBatchTable";

// ===== MOCK DATA =====
const mockBatches: BatchDataType[] = [
  {
    id: "batch-1",
    batchId: "#000001",
    batchName: "English Language Class",
    category: "On-Site",
    branch: "Negombo",
    type: "HND",
    lecturer: "Miss. Akarshani",
    studentsCount: 200,
    payment: "Paid",
    startDate: "2026/01/11",
    endDate: "2026/03/11",
    status: "Ongoing",
    level: "HND",
  },
  {
    id: "batch-2",
    batchId: "#000001",
    batchName: "UI/UX",
    category: "Hybrid",
    branch: "Galle",
    type: "Diploma",
    lecturer: "Mr. Saadh",
    studentsCount: 500,
    payment: "Free",
    startDate: "2025/11/03",
    endDate: "2026/01/03",
    status: "Completed",
    level: "Diploma",
  },
  {
    id: "batch-3",
    batchId: "#000001",
    batchName: "UI/UX",
    category: "Hybrid",
    branch: "Galle",
    type: "Diploma",
    lecturer: "Mr. Saadh",
    studentsCount: 500,
    payment: "Free",
    startDate: "2025/11/03",
    endDate: "2026/01/03",
    status: "Completed",
    level: "Diploma",
  },
  {
    id: "batch-4",
    batchId: "#000001",
    batchName: "UI/UX",
    category: "Hybrid",
    branch: "Galle",
    type: "Diploma",
    lecturer: "Mr. Saadh",
    studentsCount: 500,
    payment: "Free",
    startDate: "2026/01/03",
    endDate: "2026/02/03",
    status: "Inactive",
    level: "Diploma",
  },
  {
    id: "batch-5",
    batchId: "#000001",
    batchName: "UI/UX",
    category: "Hybrid",
    branch: "Galle",
    type: "Diploma",
    lecturer: "Mr. Saadh",
    studentsCount: 500,
    payment: "Free",
    startDate: "2026/02/03",
    endDate: "2026/03/03",
    status: "Upcoming",
    level: "Diploma",
  },
];

export function BranchBatchDetails() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchQuery) return mockBatches;

    const lowerQuery = searchQuery.toLowerCase();

    return mockBatches.filter(
      (item) =>
        item.batchName.toLowerCase().includes(lowerQuery) ||
        item.batchId.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        item.lecturer.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const pageSize = 10;
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

  const handleRowSelectionChange = useCallback((id: string, checked: boolean) => {
    setRowSelection((prev) => ({ ...prev, [id]: checked }));
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const newSelection = Object.fromEntries(filteredData.map((batch) => [batch.id, true]));

      setRowSelection(newSelection);
    } else {
      setRowSelection({});
    }
  }, [filteredData]);

  const handleStatusChange = useCallback((id: string, status: string) => {
    console.log("Status change:", id, status);
    
    // TODO: Update backend/mock state
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <BranchBatchToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <BranchBatchTable
        data={filteredData}
        rowSelection={rowSelection}
        onRowSelectionChange={handleRowSelectionChange}
        onSelectAll={handleSelectAll}
        onStatusChange={handleStatusChange}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
