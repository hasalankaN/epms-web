"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import { generateInquiryCSV } from "@/utils/export/CSV/generate-inquiry-csv";
import { generateInquiryPDF } from "@/utils/export/PDF/generate-inquiry-pdf";

import type { InquiryDataType, InquiryStatus } from "@/types/inquiry";

import { PendingInquiryTableToolbar } from "./views/PendingInquiries/PendingInquiryTableToolbar";
import { PendingInquiryTable } from "./views/PendingInquiries/PendingInquiryTable";

import { useGetEnquiries } from "@/hooks/api/enquiries/useGetEnquiries";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";

  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export function PendingInquiries() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || undefined;
  const district = searchParams.get("district") || undefined;
  const branch_id = searchParams.get("branch_id") || undefined;
  const assignee_user_id = searchParams.get("assignee_user_id") || undefined;
  const interest_id = searchParams.get("interest_id") || undefined;
  const source = searchParams.get("source") || undefined;
  const follow_up_from = searchParams.get("follow_up_from") || undefined;
  const follow_up_to = searchParams.get("follow_up_to") || undefined;
  const date_from = searchParams.get("date_from") || undefined;
  const date_to = searchParams.get("date_to") || undefined;
  const orderBy = searchParams.get("orderBy") || undefined;
  const order = (searchParams.get("order") as "asc" | "desc") || undefined;

  // ===== API CALL (status defaulted to PENDING) =====
  const { data: responseData, isLoading, isError } = useGetEnquiries({
    page: currentPage,
    size: 10,
    tab: "all",
    status: "PENDING",
    search,
    district,
    branch_id,
    assignee_user_id,
    interest_id,
    source,
    follow_up_from,
    follow_up_to,
    date_from,
    date_to,
    orderBy,
    order,
  });

  // Map API data to UI format
  const data: InquiryDataType[] = useMemo(() => {
    const rawData = responseData?.data || [];

    return rawData.map((apiRow) => {
      let normalizedStatus: InquiryStatus = "Pending";
      const apiStatus = apiRow.status?.toUpperCase() || "";

      if (apiStatus === "IN_PROGRESS" || apiStatus === "IN PROGRESS") normalizedStatus = "In Progress";
      else if (apiStatus === "COMPLETED") normalizedStatus = "Completed";
      else if (apiStatus === "NO_RESPONSE" || apiStatus === "NO RESPONSE") normalizedStatus = "No Response";

      return {
        id: apiRow.id,
        date: formatDate(apiRow.created_at),
        idNo: apiRow.enquiry_code,
        name: apiRow.name,
        phone: apiRow.phone,
        whatsApp: apiRow.whatsapp_number,
        source: apiRow.source || "-",
        assignee: apiRow.assignee_name || "-",
        district: apiRow.district || "-",
        interest: apiRow.batch_name || apiRow.course_name || "-",
        branch: apiRow.branch_name || "-",
        status: normalizedStatus,
        followUp: formatDate(apiRow.next_follow_up_at),
      };
    });
  }, [responseData]);

  const totalCount = responseData?.meta?.total || 0;

  // ===== SHARED STATE =====
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // ===== DERIVED VALUES =====
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => id),
    [rowSelection]
  );

  // ===== BULK ACTION HANDLERS =====
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleSelectAll = useCallback(() => {
    const newSelection = Object.fromEntries(data.map((item) => [item.id, true]));

    setRowSelection(newSelection);
    toast.success(`Selected all ${data.length} inquiries`);
  }, [data]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
    toast.info("Selection cleared");
  }, []);

  const handleSendSMS = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one inquiry");

      return;
    }

    toast.success(`Sending SMS to ${selectedIds.length} selected inquiries`);
  }, [selectedIds]);

  const handleSendWhatsapp = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one inquiry");

      return;
    }

    toast.success(`Sending WhatsApp to ${selectedIds.length} selected inquiries`);
  }, [selectedIds]);

  const handleSendEmail = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one inquiry");

      return;
    }

    toast.success(`Sending Email to ${selectedIds.length} selected inquiries`);
  }, [selectedIds]);

  const handleDelete = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one inquiry");

      return;
    }

    toast.error(`Deleting ${selectedIds.length} selected inquiries`);
    setRowSelection({});
  }, [selectedIds]);

  const handleExportCSV = useCallback(async () => {
    setIsExportingCSV(true);

    try {
      await generateInquiryCSV({
        search,
        district,
        branch_id,
        assignee_user_id,
        interest_id,
        source,
        date_from,
        date_to,
        follow_up_from,
        follow_up_to,
        status: "PENDING",
        tab: "all",
      });
      toast.success("CSV exported successfully");
    } catch {
      toast.error("Failed to export CSV. Please try again.");
    } finally {
      setIsExportingCSV(false);
    }
  }, [search, district, branch_id, assignee_user_id, interest_id, source, date_from, date_to, follow_up_from, follow_up_to]);

  const handleExportPDF = useCallback(async () => {
    setIsExportingPDF(true);

    try {
      await generateInquiryPDF({
        search,
        district,
        branch_id,
        assignee_user_id,
        interest_id,
        source,
        date_from,
        date_to,
        follow_up_from,
        follow_up_to,
        status: "PENDING",
        tab: "all",
      });
      toast.success("PDF exported successfully");
    } catch {
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExportingPDF(false);
    }
  }, [search, district, branch_id, assignee_user_id, interest_id, source, date_from, date_to, follow_up_from, follow_up_to]);

  // ===== BULK ACTIONS CONFIG =====
  const bulkActions = useMemo(
    () => ({
      onSelectAll: handleSelectAll,
      onClear: handleClearSelection,
      onSendSMS: handleSendSMS,
      onSendWhatsapp: handleSendWhatsapp,
      onSendEmail: handleSendEmail,
      onDelete: handleDelete,
    }),
    [handleSelectAll, handleClearSelection, handleSendSMS, handleSendWhatsapp, handleSendEmail, handleDelete]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <div className="mt-4">
        <PendingInquiryTableToolbar
          bulkActions={bulkActions}
          selectedCount={selectedIds.length}
          totalCount={totalCount}
          onExportCSV={handleExportCSV}
          isExportingCSV={isExportingCSV}
          onExportPDF={handleExportPDF}
          isExportingPDF={isExportingPDF}
        />
      </div>

      {/* Inquiry Table */}
      <div className="mt-4">
        <PendingInquiryTable
          data={data}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          isLoading={isLoading}
          isError={isError}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
