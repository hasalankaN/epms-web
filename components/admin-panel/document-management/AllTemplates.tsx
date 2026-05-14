"use client";

import React, { useState, useCallback } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useGetDocumentTemplates } from "@/hooks/api/documents/useGetDocumentTemplates";
import type { ApiDocumentType, GetDocumentTemplatesParams } from "@/types/document";
import { AllTemplateToolbar } from "@/components/admin-panel/document-management/views/AllTemplate/AllTemplateToolbar";
import { AllTemplateTable } from "@/components/admin-panel/document-management/views/AllTemplate/AllTemplateTable";

export function AllTemplates() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  // URL-based state
  const currentPage = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const documentType = searchParams.get("document_type") as ApiDocumentType | undefined;
  const isActive = searchParams.get("is_active") === "true" ? true : searchParams.get("is_active") === "false" ? false : undefined;

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
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (params.search !== undefined) {
      if (params.search) newParams.set("search", params.search);
      else newParams.delete("search");
    }

    if (params.documentType !== undefined) {
      if (params.documentType) newParams.set("document_type", params.documentType);
      else newParams.delete("document_type");
    }

    if (params.isActive !== undefined) {
      newParams.set("is_active", String(params.isActive));
    } else {
      newParams.delete("is_active");
    }

    newParams.set("page", "1");
    router.replace(`${pathname}?${newParams.toString()}`);
    setRowSelection({});
  }, [router, pathname, searchParams]);

  return (
    <div className="flex flex-col gap-4">
      <AllTemplateToolbar
        selectedCount={selectedCount}
        totalCount={total}
        search={search}
        onSearchChange={(val) => {
          handleFilterChange({ search: val });
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
          const params = new URLSearchParams(searchParams.toString());

          params.set("page", page.toString());
          router.replace(`${pathname}?${params.toString()}`);
          setRowSelection({});
        }}
      />
    </div>
  );
}
