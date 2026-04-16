"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { StudentDataType, StudentStatus, PaymentStatus, CertificateStatus } from "@/types/user-management";

import { MyStudentTableToolbar } from "@/components/referral-panel/my-students/MyStudentTableToolbar";
import { MyStudentTable } from "@/components/referral-panel/my-students/MyStudentTable";

// ===== MOCK DATA =====
const mockStudents: StudentDataType[] = Array.from({ length: 15 }, (_, i) => ({
  id: `student-${i + 1}`,
  date: "2026/01/21",
  idNo: `#${String(i + 1).padStart(6, "0")}`,
  name: "Amali Perera",
  district: "Colombo",
  phone: "+9470 492 2345",
  whatsApp: "+9470 492 2345",
  paymentStatus: (["Pending", "Completed"] as PaymentStatus[])[i % 2],
  paymentPendingAmount: i % 2 === 0 ? "5,000.00" : "0.00",
  certificateStatus: (["Pending", "Completed"] as CertificateStatus[])[i % 2],
  pendingCertificates: i % 2 === 0 ? 1 : 0,
  commissions: "XXXX.00",
  studentStatus: (["ACTIVE", "INACTIVE", "DROPPED", "COMPLETED"] as StudentStatus[])[i % 4],
}));

export default function MyStudentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // ===== SHARED STATE =====
  const [data] = useState<StudentDataType[]>(mockStudents);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

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
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
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
    console.log("Send SMS to:", selectedStudents);
  }, [selectedIds, selectedStudents]);

  const handleSendWhatsapp = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student");

      return;
    }

    toast.success(`Sending WhatsApp to ${selectedIds.length} selected students`);
    console.log("Send WhatsApp to:", selectedStudents);
  }, [selectedIds, selectedStudents]);

  const handleSendEmail = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student");

      return;
    }

    toast.success(`Sending Email to ${selectedIds.length} selected students`);
    console.log("Send Email to:", selectedStudents);
  }, [selectedIds, selectedStudents]);

  const handleDelete = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student");

      return;
    }

    toast.success(`Deleted ${selectedIds.length} student(s)`);
    setRowSelection({});
  }, [selectedIds]);

  const handleAddStudent = useCallback(() => {
    toast.info("Add Student coming soon");
  }, []);

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
    <div className="space-y-4 p-4 md:p-6">
      {/* Toolbar */}
      <MyStudentTableToolbar
        bulkActions={bulkActions}
        selectedCount={selectedIds.length}
        totalCount={data.length}
        onAddStudent={handleAddStudent}
      />

      {/* Main Data Table */}
      <MyStudentTable
        data={data}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </div>
  );
}
