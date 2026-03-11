"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { InquiryDataType } from "@/types/inquiry";

import { PendingInquiryTableToolbar } from "./views/PendingInquiries/PendingInquiryTableToolbar";
import { PendingInquiryTable } from "./views/PendingInquiries/PendingInquiryTable";

// ===== MOCK DATA =====
const mockInquiries: InquiryDataType[] = Array.from({ length: 15 }, (_, i) => ({
  id: `inquiry-${i + 1}`,
  date: "01/21",
  idNo: `#${String(i + 1).padStart(6, "0")}`,
  name: "Amali Perera",
  phone: "+9470 492 2345",
  whatsApp: "+9470 492 2345",
  source: i % 3 === 0 ? "Web" : "Added (Name)",
  assignee: "Name",
  district: "Colombo",
  interest: "Course",
  branch: "Main",
  status: "Pending", // All mock data here is pending
  followUp: "01/21",
}));

export function PendingInquiries() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // ===== SHARED STATE =====
  const [data] = useState<InquiryDataType[]>(mockInquiries);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  // ===== DERIVED VALUES =====
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => id),
    [rowSelection]
  );

  const selectedInquiries = useMemo(
    () => data.filter((item) => selectedIds.includes(item.id)),
    [data, selectedIds]
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
    console.log("Send SMS to:", selectedInquiries);
  }, [selectedIds, selectedInquiries]);

  const handleSendWhatsapp = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one inquiry");
      
      return;
    }

    toast.success(`Sending WhatsApp to ${selectedIds.length} selected inquiries`);
    console.log("Send WhatsApp to:", selectedInquiries);
  }, [selectedIds, selectedInquiries]);

  const handleSendEmail = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one inquiry");
      
      return;
    }

    toast.success(`Sending Email to ${selectedIds.length} selected inquiries`);
    console.log("Send Email to:", selectedInquiries);
  }, [selectedIds, selectedInquiries]);

  const handleDelete = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one inquiry");
      
      return;
    }

    toast.error(`Deleting ${selectedIds.length} selected inquiries`);
    console.log("Delete:", selectedInquiries);

    // Clear selection after delete
    setRowSelection({});
  }, [selectedIds, selectedInquiries]);

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
          totalCount={data.length} 
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
        />
      </div>
    </div>
  );
}
