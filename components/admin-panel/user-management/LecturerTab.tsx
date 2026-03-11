"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { LecturerDataType, SalaryStatus, MemberStatus } from "@/types/user-management";

import { LecturerTableToolbar } from "./views/Lecturer/LecturerTableToolbar";
import { LecturerTable } from "./views/Lecturer/LecturerTable";

// ===== MOCK DATA =====
const mockLecturers: LecturerDataType[] = Array.from({ length: 15 }, (_, i) => ({
  id: `lecturer-${i + 1}`,
  regDate: "01/21",
  idNo: `#${String(i + 1).padStart(6, "0")}`,
  name: "Amali Perera",
  phone: "+9470 492 2345",
  whatsApp: "+9470 492 2345",
  email: "user@gmail.com",
  salaryType: i % 2 === 0 ? "Monthly" : "Percentage",
  salaryStatus: (["Over Due", "Pending", "Paid"] as SalaryStatus[])[i % 3],
  status: (["active", "inactive"] as MemberStatus[])[i % 2],
}));

export function LecturerTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // ===== SHARED STATE =====
  const [data] = useState<LecturerDataType[]>(mockLecturers);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  // ===== DERIVED VALUES =====
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => id),
    [rowSelection]
  );

  const selectedLecturers = useMemo(
    () => data.filter((item) => selectedIds.includes(item.id)),
    [data, selectedIds]
  );

  // ===== HANDLERS =====
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  const handleSelectAll = useCallback(() => {
    const newSelection = Object.fromEntries(data.map((item) => [item.id, true]));

    setRowSelection(newSelection);
    toast.success(`Selected all ${data.length} lecturers`);
  }, [data]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
    toast.info("Selection cleared");
  }, []);

  const handleSendSMS = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one lecturer");

      return;
    }

    toast.success(`Sending SMS to ${selectedIds.length} selected lecturers`);
    console.log("Send SMS to:", selectedLecturers);
  }, [selectedIds, selectedLecturers]);

  const handleSendWhatsapp = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one lecturer");

      return;
    }

    toast.success(`Sending WhatsApp to ${selectedIds.length} selected lecturers`);
    console.log("Send WhatsApp to:", selectedLecturers);
  }, [selectedIds, selectedLecturers]);

  const handleSendEmail = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one lecturer");

      return;
    }

    toast.success(`Sending Email to ${selectedIds.length} selected lecturers`);
    console.log("Send Email to:", selectedLecturers);
  }, [selectedIds, selectedLecturers]);

  // ===== BULK ACTIONS CONFIG =====
  const bulkActions = useMemo(
    () => ({
      onSelectAll: handleSelectAll,
      onClear: handleClearSelection,
      onSendSMS: handleSendSMS,
      onSendWhatsapp: handleSendWhatsapp,
      onSendEmail: handleSendEmail,
    }),
    [handleSelectAll, handleClearSelection, handleSendSMS, handleSendWhatsapp, handleSendEmail]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <div>
        <LecturerTableToolbar
          bulkActions={bulkActions}
          selectedCount={selectedIds.length}
          totalCount={data.length}
        />
      </div>

      {/* Lecturer Table */}
      <div>
        <LecturerTable
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
