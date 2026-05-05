"use client";

import React, { useState, useCallback, useEffect } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useGetCertificateTemplates } from "@/hooks/api/certificates/useGetCertificateTemplates";
import type { CertificateTemplateStatus } from "@/types/certificate";
import { AllTemplateToolbar } from "@/components/admin-panel/certificate-management/views/AllTemplate/AllTemplateToolbar";
import { AllTemplateTable } from "@/components/admin-panel/certificate-management/views/AllTemplate/AllTemplateTable";
import { useBulkDeleteCertificateTemplates } from "@/hooks/api/certificates/useBulkDeleteCertificateTemplates";

const PAGE_SIZE = 10;

export function AllTemplates() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  
  // URL-based state
  const currentPage = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") as CertificateTemplateStatus | undefined;

  const [localSearch, setLocalSearch] = useState(search);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { mutate: bulkDeleteTemplates, isPending: isDeleting } = useBulkDeleteCertificateTemplates();

  // Debounce localSearch to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        const params = new URLSearchParams(searchParams.toString());

        if (localSearch) {
          params.set("search", localSearch);
        } else {
          params.delete("search");
        }
        
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, router, pathname, searchParams, search]);

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
    const params = new URLSearchParams(searchParams.toString());
    
    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
    setRowSelection({});
  }, [router, pathname, searchParams]);

  const handleSearchChange = useCallback((value: string) => {
    setLocalSearch(value);
    setRowSelection({});
  }, []);

  const handleStatusFilterChange = useCallback((status: CertificateTemplateStatus | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
    setRowSelection({});
  }, [router, pathname, searchParams]);

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
