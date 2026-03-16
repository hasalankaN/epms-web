"use client";

import React, { useState, useCallback, useEffect } from "react";

import { useGetCertificateTemplates } from "@/hooks/api/certificates/useGetCertificateTemplates";
import type { CertificateTemplateStatus } from "@/types/certificate";
import { AllTemplateToolbar } from "@/components/admin-panel/certificate-management/views/AllTemplate/AllTemplateToolbar";
import { AllTemplateTable } from "@/components/admin-panel/certificate-management/views/AllTemplate/AllTemplateTable";
import { useBulkDeleteCertificateTemplates } from "@/hooks/api/certificates/useBulkDeleteCertificateTemplates";

const PAGE_SIZE = 10;

export function AllTemplates() {
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CertificateTemplateStatus | undefined>(undefined);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { mutate: bulkDeleteTemplates, isPending: isDeleting } = useBulkDeleteCertificateTemplates();

  // Debounce localSearch to search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch]);

  const { data, isLoading, isError } = useGetCertificateTemplates({
    page: currentPage,
    limit: PAGE_SIZE,
    name: search || undefined,
    status: statusFilter,
  });

  const templates = data?.results ?? [];
  const totalCount = data?.totalResults ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setRowSelection({});
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    setCurrentPage(1);
    setRowSelection({});
  }, []);

  const handleStatusFilterChange = useCallback((status: CertificateTemplateStatus | undefined) => {
    setStatusFilter(status);
    setCurrentPage(1);
    setRowSelection({});
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <AllTemplateToolbar
        selectedCount={selectedCount}
        totalCount={totalCount}
        search={localSearch}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        isDeleting={isDeleting}
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        bulkActions={{
          onSelectAll: () => {
            const newSelection: Record<string, boolean> = {};

            templates.forEach((item) => {
              newSelection[item.id] = true;
            });
            setRowSelection(newSelection);
          },
          onClear: () => setRowSelection({}),
          onIssue: () => console.log("Issue selected templates"),
          onDelete: () => {
            const selectedIds = Object.entries(rowSelection)
              .filter(([, selected]) => selected)
              .map(([id]) => id);

            if (selectedIds.length > 0) {
              bulkDeleteTemplates({ ids: selectedIds }, {
                onSuccess: () => {
                  setRowSelection({});
                  setDeleteModalOpen(false);
                },
              });
            }
          },
        }}
      />
      <AllTemplateTable
        data={templates}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        isLoading={isLoading}
        isError={isError}
        currentPage={currentPage}
        totalCount={totalCount}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
