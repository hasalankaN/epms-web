"use client";

import React, { useState } from "react";

import { mockDocumentTemplatesData } from "@/components/admin-panel/document-management/mockData";
import { AllTemplateToolbar } from "@/components/admin-panel/document-management/views/AllTemplate/AllTemplateToolbar";
import { AllTemplateTable } from "@/components/admin-panel/document-management/views/AllTemplate/AllTemplateTable";

export function AllTemplates() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      <AllTemplateToolbar
        selectedCount={selectedCount}
        totalCount={mockDocumentTemplatesData.length}
        bulkActions={{
          onSelectAll: () => {
            const newSelection: Record<string, boolean> = {};

            mockDocumentTemplatesData.forEach((item) => {
              newSelection[item.id] = true;
            });
            setRowSelection(newSelection);
          },
          onClear: () => setRowSelection({}),
          onIssue: () => console.log("Issue selected document templates"),
        }}
      />
      <AllTemplateTable
        data={mockDocumentTemplatesData}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
