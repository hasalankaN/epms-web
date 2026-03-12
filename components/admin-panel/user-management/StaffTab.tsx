"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { StaffDataType, SalaryStatus, MemberStatus } from "@/types/user-management";

import { StaffTableToolbar } from "./views/Staff/StaffTableToolbar";
import { StaffTable } from "./views/Staff/StaffTable";

// ===== MOCK DATA =====
const mockStaff: StaffDataType[] = Array.from({ length: 15 }, (_, i) => ({
  id: `staff-${i + 1}`,
  regDate: "01/21",
  idNo: `#${String(i + 1).padStart(6, "0")}`,
  name: "Amali Perera",
  phone: "+9470 492 2345",
  whatsApp: "+9470 492 2345",
  email: "user@gmail.com",
  privileges: "Privilege 1",
  commissions: "N/A",
  district: "Colombo",
  branch: "Main",
  salaryStatus: (["OVER_DUE", "PENDING", "PAID"] as SalaryStatus[])[i % 3],
  status: (["ACTIVE", "SUSPENDED"] as MemberStatus[])[i % 2],
  role: i % 3 === 2 ? "Manager" : "",
}));

export function StaffTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // ===== SHARED STATE =====
  const [data] = useState<StaffDataType[]>(mockStaff);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  // ===== DERIVED VALUES =====
  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => id),
    [rowSelection]
  );

  const selectedStaff = useMemo(
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
    toast.success(`Selected all ${data.length} staff members`);
  }, [data]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
    toast.info("Selection cleared");
  }, []);

  const handleSendSMS = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one staff member");

      return;
    }

    toast.success(`Sending SMS to ${selectedIds.length} selected staff members`);
    console.log("Send SMS to:", selectedStaff);
  }, [selectedIds, selectedStaff]);

  const handleSendWhatsapp = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one staff member");

      return;
    }

    toast.success(`Sending WhatsApp to ${selectedIds.length} selected staff members`);
    console.log("Send WhatsApp to:", selectedStaff);
  }, [selectedIds, selectedStaff]);

  const handleSendEmail = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one staff member");

      return;
    }

    toast.success(`Sending Email to ${selectedIds.length} selected staff members`);
    console.log("Send Email to:", selectedStaff);
  }, [selectedIds, selectedStaff]);

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
        <StaffTableToolbar
          bulkActions={bulkActions}
          selectedCount={selectedIds.length}
          totalCount={data.length}
        />
      </div>

      {/* Staff Table */}
      <div>
        <StaffTable
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
