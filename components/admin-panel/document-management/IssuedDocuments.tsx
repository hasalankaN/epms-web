"use client";

/* eslint-disable padding-line-between-statements */

import React, { useState, useCallback, useEffect } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { toast } from "sonner";

import { useGetIssuedDocuments } from "@/hooks/api/documents/useGetIssuedDocuments";
import { useBulkDeleteIssuedDocuments } from "@/hooks/api/documents/useBulkDeleteIssuedDocuments";
import type {
  ApiDocumentType,
  GetIssuedDocumentsParams,
} from "@/types/document";
import { IssuedStatsCard } from "@/components/admin-panel/document-management/views/IssuedDocuments/IssuedStatsCard";
import { IssuedToolbar } from "@/components/admin-panel/document-management/views/IssuedDocuments/IssuedToolbar";
import { IssuedTable } from "@/components/admin-panel/document-management/views/IssuedDocuments/IssuedTable";
import { generateIssuedDocumentPDF } from "@/utils/export/PDF/generate-issued-document-pdf";

export function IssuedDocuments() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // URL-based state
  const currentPage = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const documentType = searchParams.get("document_type") as
    | ApiDocumentType
    | undefined;
  const issuedFrom = searchParams.get("issued_from") || undefined;
  const issuedTo = searchParams.get("issued_to") || undefined;

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

  const { data, isLoading, isError } = useGetIssuedDocuments({
    page: currentPage,
    limit: 10,
    search: search || undefined,
    document_type: documentType || undefined,
    issued_from: issuedFrom,
    issued_to: issuedTo,
  } satisfies GetIssuedDocumentsParams);

  const items = data?.data ?? [];
  const totalCount = data?.total ?? 0;

  const selectedIds = Object.entries(rowSelection)
    .filter(([, v]) => v)
    .map(([k]) => k);

  const selectedCount = selectedIds.length;

  const { mutateAsync: bulkDelete, isPending: isBulkDeleting } =
    useBulkDeleteIssuedDocuments();

  const handleFilterChange = useCallback(
    (params: {
      documentType?: string;
      issuedFrom?: string;
      issuedTo?: string;
    }) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (params.documentType !== undefined) {
        if (params.documentType)
          newParams.set("document_type", params.documentType);
        else newParams.delete("document_type");
      }

      if (params.issuedFrom !== undefined) {
        if (params.issuedFrom) newParams.set("issued_from", params.issuedFrom);
        else newParams.delete("issued_from");
      }

      if (params.issuedTo !== undefined) {
        if (params.issuedTo) newParams.set("issued_to", params.issuedTo);
        else newParams.delete("issued_to");
      }

      newParams.set("page", "1");
      router.replace(`${pathname}?${newParams.toString()}`);
      setRowSelection({});
    },
    [router, pathname, searchParams],
  );

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("document_type");
    params.delete("issued_from");
    params.delete("issued_to");
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
    setRowSelection({});
  }, [searchParams, pathname, router]);

  const handleBulkDelete = useCallback(async () => {
    if (!selectedIds.length) return;
    await bulkDelete({
      ids: selectedIds,
      reason: "Bulk deleted via admin panel",
    });
    setRowSelection({});
  }, [selectedIds, bulkDelete]);

  const handleExportPDF = useCallback(async () => {
    setIsExportingPDF(true);
    try {
      await generateIssuedDocumentPDF({
        search: search || undefined,
        document_type: documentType || undefined,
        issued_from: issuedFrom || undefined,
        issued_to: issuedTo || undefined,
      });
      toast.success("PDF exported successfully");
    } catch {
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExportingPDF(false);
    }
  }, [search, documentType, issuedFrom, issuedTo]);

  return (
    <div className="flex flex-col gap-4">
      {/* Stats Card */}
      <IssuedStatsCard totalIssued={totalCount} />

      {/* Toolbar */}
      <IssuedToolbar
        selectedCount={selectedCount}
        totalCount={totalCount}
        search={localSearch}
        onSearchChange={setLocalSearch}
        documentTypeFilter={documentType || null}
        issuedFromFilter={issuedFrom || null}
        issuedToFilter={issuedTo || null}
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
          onDelete: handleBulkDelete,
        }}
        isBulkDeleting={isBulkDeleting}
        onExportPDF={handleExportPDF}
        isExportingPDF={isExportingPDF}
      />

      {/* Table */}
      <IssuedTable
        data={items}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        isLoading={isLoading}
        isError={isError}
        currentPage={currentPage}
        totalCount={totalCount}
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
