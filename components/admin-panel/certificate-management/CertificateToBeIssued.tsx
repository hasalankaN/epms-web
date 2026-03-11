"use client";

import React, { useState } from "react";

import { mockIssuedData, TOTAL_ISSUED_COUNT } from "@/components/admin-panel/certificate-management/mockData";
import { IssuedStatsCard } from "@/components/admin-panel/certificate-management/views/CertificateToBeIssued/IssuedStatsCard";
import { IssuedToolbar } from "@/components/admin-panel/certificate-management/views/CertificateToBeIssued/IssuedToolbar";
import { IssuedTable } from "@/components/admin-panel/certificate-management/views/CertificateToBeIssued/IssuedTable";

export function CertificateToBeIssued() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      {/* Stats Card */}
      <IssuedStatsCard totalIssued={TOTAL_ISSUED_COUNT} />

      {/* Toolbar */}
      <IssuedToolbar
        selectedCount={selectedCount}
        totalCount={mockIssuedData.length}
        bulkActions={{
          onSelectAll: () => {
            const newSelection: Record<string, boolean> = {};

            mockIssuedData.forEach((item) => {
              newSelection[item.id] = true;
            });
            setRowSelection(newSelection);
          },
          onClear: () => setRowSelection({}),
          onDelete: () => {
            console.log("Delete selected issued records");
            setRowSelection({});
          },
        }}
      />

      {/* Table */}
      <IssuedTable
        data={mockIssuedData}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
