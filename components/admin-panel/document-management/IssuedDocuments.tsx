"use client";

import React, { useState } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { mockIssuedDocumentsData, TOTAL_ISSUED_DOCUMENTS_COUNT } from "@/components/admin-panel/document-management/mockData";
import { IssuedStatsCard } from "@/components/admin-panel/document-management/views/IssuedDocuments/IssuedStatsCard";
import { IssuedToolbar } from "@/components/admin-panel/document-management/views/IssuedDocuments/IssuedToolbar";
import { IssuedTable } from "@/components/admin-panel/document-management/views/IssuedDocuments/IssuedTable";

export function IssuedDocuments() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  
  // URL-based state
  const currentPage = Number(searchParams.get("page")) || 1;

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
        onPageChange={(page) => {
          const params = new URLSearchParams(searchParams.toString());

          params.set("page", page.toString());
          router.replace(`${pathname}?${params.toString()}`);
          setRowSelection({});
        }}
      />
    </div>
  );
}
