"use client";

import React, { useState } from "react";

import { mockIssuedDocumentsData, TOTAL_ISSUED_DOCUMENTS_COUNT } from "@/components/admin-panel/document-management/mockData";
import { IssuedStatsCard } from "@/components/admin-panel/document-management/views/IssuedDocuments/IssuedStatsCard";
import { IssuedToolbar } from "@/components/admin-panel/document-management/views/IssuedDocuments/IssuedToolbar";
import { IssuedTable } from "@/components/admin-panel/document-management/views/IssuedDocuments/IssuedTable";

export function IssuedDocuments() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Stats Card */}
      <IssuedStatsCard totalIssued={TOTAL_ISSUED_DOCUMENTS_COUNT} />

      {/* Toolbar */}
      <IssuedToolbar
        selectedCount={selectedCount}
        totalCount={mockIssuedDocumentsData.length}
        bulkActions={{
          onSelectAll: () => {
            const newSelection: Record<string, boolean> = {};

            mockIssuedDocumentsData.forEach((item) => {
              newSelection[item.id] = true;
            });
            setRowSelection(newSelection);
          },
          onClear: () => setRowSelection({}),
          onDelete: () => {
            console.log("Delete selected issued documents");
            setRowSelection({});
          },
        }}
      />

      {/* Table */}
      <IssuedTable
        data={mockIssuedDocumentsData}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
