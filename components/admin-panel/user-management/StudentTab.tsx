import React, { useState, useMemo, useCallback, useEffect } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { StudentDataType, StudentStatus } from "@/types/user-management";

import { StudentTableToolbar } from "./views/Student/StudentTableToolbar";
import { StudentTable } from "./views/Student/StudentTable";
import { useGetStudents } from "@/hooks/api/user-management/useGetStudents";
import { generateStudentCSV } from "@/utils/export/CSV/generate-student-csv";

export function StudentTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || "";
  const district = searchParams.get("district") || undefined;
  const studentStatus = searchParams.get("studentStatus")?.toUpperCase() || undefined;
  const paymentStatus = searchParams.get("paymentStatus")?.toUpperCase() || undefined;
  const certificateStatus = searchParams.get("certificateStatus")?.toUpperCase() || undefined;
  const fromDate = searchParams.get("from") || undefined;
  const toDate = searchParams.get("to") || undefined;

  // ===== API HOOK =====
  const { data: apiData, isLoading, isError } = useGetStudents({
    page: currentPage,
    size: 10,
    search: search || undefined,
    district,
    student_status: studentStatus,
    payment_status: paymentStatus,
    certificate_status: certificateStatus,
    enrollment_date_from: fromDate,
    enrollment_date_to: toDate,
  });

  const data = useMemo(() => {
    if (!apiData?.results) return [];
    
    return apiData.results.map(item => ({
      id: item.user_id,
      date: item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) : "-",
      idNo: item.referral_code || "-",
      name: item.full_name || "-",
      district: item.district || "-",
      phone: item.mobile_number || "-",
      whatsApp: item.whatsapp_number || "-",
      paymentStatus: item.payment_status?.status === "PAID" ? "Completed" : "Pending",
      paymentPendingAmount: item.payment_status?.total_pending_amount || "0.00",
      certificateStatus: item.certificate_status?.has_certificate ? "Completed" : "Pending",
      pendingCertificates: item.certificate_status?.total_issued === 0 ? 1 : 0, // Placeholder logic if specific count not provided
      commissions: item.commissions?.total_earned || "0.00",
      studentStatus: item.status as StudentStatus,
    })) as StudentDataType[];
  }, [apiData]);

  // ===== SHARED STATE =====
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [isExporting, setIsExporting] = useState(false);

  // ===== DERIVED VALUES =====
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => id),
    [rowSelection]
  );

  const selectedStudents = useMemo(
    () => data.filter((item) => selectedIds.includes(item.id)),
    [data, selectedIds]
  );

  // ===== HANDLERS =====
  const [localSearch, setLocalSearch] = useState(search);

  // Sync local search when URL search changes
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
        router.push(`${pathname}?${params.toString()}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, search, searchParams, pathname, router]);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleMultiFilterChange = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleClearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("district");
    params.delete("studentStatus");
    params.delete("paymentStatus");
    params.delete("certificateStatus");
    params.delete("from");
    params.delete("to");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleSelectAll = useCallback(() => {
    const newSelection = Object.fromEntries(data.map((item) => [item.id, true]));

    setRowSelection(newSelection);
    toast.success(`Selected all ${data.length} students`);
  }, [data]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
    toast.info("Selection cleared");
  }, []);

  const handleSendSMS = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student");

      return;
    }

    toast.success(`Sending SMS to ${selectedIds.length} selected students`);
  }, [selectedIds]);

  const handleSendWhatsapp = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student");

      return;
    }

    toast.success(`Sending WhatsApp to ${selectedIds.length} selected students`);
  }, [selectedIds]);

  const handleSendEmail = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student");

      return;
    }

    toast.success(`Sending Email to ${selectedIds.length} selected students`);
  }, [selectedIds]);

  const handleIssueCertificate = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student");

      return;
    }

    console.log("Issue Certificate for:", selectedStudents);
  }, [selectedIds, selectedStudents]);

  const handleIssueDocument = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student");

      return;
    }

    console.log("Issue Document for:", selectedStudents);
  }, [selectedIds, selectedStudents]);

  const handleExportCSV = useCallback(async () => {
    setIsExporting(true);

    try {
      await generateStudentCSV({
        search: localSearch || undefined,
        district,
        student_status: studentStatus,
        payment_status: paymentStatus,
        certificate_status: certificateStatus,
        enrollment_date_from: fromDate,
        enrollment_date_to: toDate,
      }, selectedIds);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export Student data");
    } finally {
      setIsExporting(false);
    }
  }, [localSearch, district, studentStatus, paymentStatus, certificateStatus, fromDate, toDate, selectedIds]);

  // ===== BULK ACTIONS CONFIG =====
  const bulkActions = useMemo(
    () => ({
      onSelectAll: handleSelectAll,
      onClear: handleClearSelection,
      onSendSMS: handleSendSMS,
      onSendWhatsapp: handleSendWhatsapp,
      onSendEmail: handleSendEmail,
      onIssueCertificate: handleIssueCertificate,
      onIssueDocument: handleIssueDocument,
    }),
    [handleSelectAll, handleClearSelection, handleSendSMS, handleSendWhatsapp, handleSendEmail, handleIssueCertificate, handleIssueDocument]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <div>
        <StudentTableToolbar
          bulkActions={bulkActions}
          selectedCount={selectedIds.length}
          totalCount={data.length}
          search={localSearch}
          onSearchChange={setLocalSearch}
          onApplyFilters={handleMultiFilterChange}
          onClearFilters={handleClearFilters}
          activeUrlFilters={{
            district,
            studentStatus: studentStatus?.toLowerCase(), // Map back to lowercase for UI labels
            paymentStatus: paymentStatus?.toLowerCase(),
            certificateStatus: certificateStatus?.toLowerCase(),
            from: fromDate,
            to: toDate,
          }}
          onExportCSV={handleExportCSV}
          isExporting={isExporting}
        />
      </div>

      {/* Student Table */}
      <div>
        <StudentTable
          data={data}
          isLoading={isLoading}
          isError={isError}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          totalResults={apiData?.totalResults || 0}
        />
      </div>
    </div>
  );
}
