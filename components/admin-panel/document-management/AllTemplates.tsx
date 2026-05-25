"use client";

import React, { useState, useCallback, useEffect } from "react";

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

  const [localSearch, setLocalSearch] = useState(search);

  // Sync local search when URL search changes (e.g. back button)
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  // Debounce search update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch.trim() !== search.trim()) {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearch.trim()) {
          params.set("search", localSearch.trim());
        } else {
          params.delete("search");
        }

        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, search, searchParams, pathname, router]);

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
    documentType?: string;
    isActive?: boolean;
  }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
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

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("document_type");
    params.delete("is_active");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
    setRowSelection({});
  }, [searchParams, pathname, router]);

  return (
    <div className="flex flex-col gap-4">
      <AllTemplateToolbar
        selectedCount={selectedCount}
        totalCount={total}
        search={localSearch}
        onSearchChange={setLocalSearch}
        documentTypeFilter={documentType || null}
        isActiveFilter={isActive}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
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
