"use client";

import React, { useState } from "react";

import { mockTemplatesData } from "@/components/admin-panel/certificate-management/mockData";
import { AllTemplateToolbar } from "@/components/admin-panel/certificate-management/views/AllTemplate/AllTemplateToolbar";
import { AllTemplateTable } from "@/components/admin-panel/certificate-management/views/AllTemplate/AllTemplateTable";

export function AllTemplates() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      <AllTemplateToolbar
        selectedCount={selectedCount}
        totalCount={mockTemplatesData.length}
        bulkActions={{
          onSelectAll: () => {
            const newSelection: Record<string, boolean> = {};

            mockTemplatesData.forEach((item) => {
              newSelection[item.id] = true;
            });
            setRowSelection(newSelection);
          },
          onClear: () => setRowSelection({}),
          onIssue: () => console.log("Issue selected templates"),
          onDelete: () => {
            console.log("Delete selected templates");
            setRowSelection({});
          },
        }}
      />
      <AllTemplateTable
        data={mockTemplatesData}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
