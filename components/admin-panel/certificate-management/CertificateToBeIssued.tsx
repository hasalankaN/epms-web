"use client";

import React, { useState, useMemo } from "react";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useGetCertificateRequests } from "@/hooks/api/certificates/useGetCertificateRequests";
import { IssuedStatsCard } from "@/components/admin-panel/certificate-management/views/CertificateToBeIssued/IssuedStatsCard";
import { IssuedToolbar } from "@/components/admin-panel/certificate-management/views/CertificateToBeIssued/IssuedToolbar";
import { IssuedTable } from "@/components/admin-panel/certificate-management/views/CertificateToBeIssued/IssuedTable";
import { generateCertificateRequestPDF } from "@/utils/export/PDF/generate-certificate-request-pdf";
import { useBulkDeleteCertificateRequests } from "@/hooks/api/certificates/useBulkDeleteCertificateRequests";
import type { CertificateRequestStatus, CertificateRequestType } from "@/types/certificate";

export function CertificateToBeIssued() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // URL-based state
  const currentPage = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") as CertificateRequestStatus || undefined;
  const certificate_type = searchParams.get("certificate_type") as CertificateRequestType || undefined;
  const course_id = searchParams.get("course_id") || undefined;
  const batch_id = searchParams.get("batch_id") || undefined;
  const date_from = searchParams.get("date_from") || undefined;
  const date_to = searchParams.get("date_to") || undefined;

  const { data, isLoading, isError } = useGetCertificateRequests({
    page: currentPage,
    limit: 10,
    search,
    status,
    certificate_type,
    course_id,
    batch_id,
    date_from,
    date_to,
  });

  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const { mutate: bulkDelete } = useBulkDeleteCertificateRequests();

  const selectedCount = useMemo(() => 
    Object.values(rowSelection).filter(Boolean).length, 
  [rowSelection]);

  const totalCount = data?.meta?.total || 0;
  const requests = data?.data || [];

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);

    try {
      await generateCertificateRequestPDF({
        search,
        status,
        certificate_type,
        course_id,
        batch_id,
        date_from,
        date_to,
      });
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stats Card - Using total from API if available, else 0 */}
      <IssuedStatsCard totalIssued={totalCount} isLoading={isLoading} />


      {/* Toolbar */}
      <IssuedToolbar
        selectedCount={selectedCount}
        totalCount={requests.length}
        onExportPDF={handleExportPDF}
        isExportingPDF={isExportingPDF}
        bulkActions={{
          onSelectAll: () => {
            const newSelection: Record<string, boolean> = {};

            requests.forEach((item) => {
              newSelection[item.id] = true;
            });
            setRowSelection(newSelection);
          },
          onClear: () => setRowSelection({}),
          onDelete: () => {
            const idsToDelete = Object.keys(rowSelection).filter(id => rowSelection[id]);
            
            if (idsToDelete.length > 0) {
              bulkDelete(idsToDelete, {
                onSuccess: () => {
                  setRowSelection({});
                }
              });
            }
          },
        }}
      />

      {/* Table */}
      <IssuedTable
        data={requests}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        currentPage={currentPage}
        isLoading={isLoading}
        isError={isError}
        totalCount={totalCount}
        totalPages={data?.meta?.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
