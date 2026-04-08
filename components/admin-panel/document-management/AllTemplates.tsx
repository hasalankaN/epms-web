"use client";

import React, { useState, useCallback } from "react";

import { useGetDocumentTemplates } from "@/hooks/api/documents/useGetDocumentTemplates";
import type { ApiDocumentType, GetDocumentTemplatesParams } from "@/types/document";
import { AllTemplateToolbar } from "@/components/admin-panel/document-management/views/AllTemplate/AllTemplateToolbar";
import { AllTemplateTable } from "@/components/admin-panel/document-management/views/AllTemplate/AllTemplateTable";

export function AllTemplates() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [documentType, setDocumentType] = useState<ApiDocumentType | undefined>(undefined);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  const { data, isLoading, isError } = useGetDocumentTemplates({
    page: currentPage,
    limit: 10,
    search: search || undefined,
    document_type: documentType,
    is_active: isActive,
  } satisfies GetDocumentTemplatesParams);

  const items = data?.data ?? [];
  const total = data?.total ?? 0;

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  const handleFilterChange = useCallback((params: {
    search?: string;
    documentType?: string;
    isActive?: boolean;
  }) => {
    setSearch(params.search ?? "");
    setDocumentType(params.documentType as ApiDocumentType | undefined);
    setIsActive(params.isActive);
    setCurrentPage(1);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <AllTemplateToolbar
        selectedCount={selectedCount}
        totalCount={total}
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        onFilterChange={handleFilterChange}
        bulkActions={{
          onSelectAll: () => {
            const newSelection: Record<string, boolean> = {};

            items.forEach((item) => {
              newSelection[item.id] = true;
            });
            setRowSelection(newSelection);
          },
          onClear: () => setRowSelection({}),
          onIssue: () => console.log("Issue selected document templates"),
        }}
      />
      <AllTemplateTable
        data={items}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        isLoading={isLoading}
        isError={isError}
        currentPage={currentPage}
        totalCount={total}
        onPageChange={(page) => {
          setCurrentPage(page);
        }}
      />
    </div>
  );
}
