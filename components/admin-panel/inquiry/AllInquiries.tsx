"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";


import { toast } from "sonner";

import type { InquiryDataType, InquiryStatus } from "@/types/inquiry";

import { AllInquiryStatsRow } from "./views/AllInquiries/AllInquiryStatsRow";
import { AllInquiryTableToolbar } from "./views/AllInquiries/AllInquiryTableToolbar";
import { AllInquiryTable } from "./views/AllInquiries/AllInquiryTable";

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

export function AllInquiries() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const search = searchParams.get("search") || undefined;
  const status = searchParams.get("status") || undefined;
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

  // ===== API CALL =====
  const { data: responseData, isLoading, isError } = useGetEnquiries({
    page: currentPage,
    size: 10,
    tab: "all",
    search,
    status,
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

  // Map APi data to UI format
  const data: InquiryDataType[] = useMemo(() => {
    const rawData = responseData?.data || [];
    
    return rawData.map((apiRow) => {
      // Basic normalization of status to match UI keys
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
      {/* Stats Row */}
      <AllInquiryStatsRow />
      
      {/* Separator Line (24px below) */}
      <div className="mt-4 h-[1px] w-full bg-[#E2E8F0]" />

      {/* Table Toolbar (24px below separator) */}
      <div className="mt-4">
        <AllInquiryTableToolbar 
          bulkActions={bulkActions} 
          selectedCount={selectedIds.length} 
          totalCount={totalCount} 
        />
      </div>

      {/* Inquiry Table (16px below toolbar) */}
      <div className="mt-4">
        <AllInquiryTable
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
