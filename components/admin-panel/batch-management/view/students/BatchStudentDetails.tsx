"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { StudentDataType } from "@/types/student";
import { useGetBatchStudents } from "@/hooks/api/batches/useGetBatchStudents";

import { StudentDetailsToolbar } from "./StudentDetailsToolbar";
import { StudentDetailsTable } from "./StudentDetailsTable";

interface BatchStudentDetailsProps {
  batchId: string;
}

export function BatchStudentDetails({ batchId }: BatchStudentDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("studentPage");
  const currentPage = pageParam ? parseInt(pageParam) : 1;
  const searchParam = searchParams.get("studentSearch") ?? undefined;

  // ===== SHARED STATE =====
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>(
    {},
  );

  // ===== DATA FETCHING =====
  const { data: studentsData, isLoading } = useGetBatchStudents({
    batchId,
    page: currentPage,
    size: 10,
    search: searchParam,
  });

  // Wrap 'data' in useMemo to ensure referential stability when falling back to []
  const data: StudentDataType[] = useMemo(
    () => studentsData?.items ?? [],
    [studentsData?.items],
  );

  // ===== DERIVED VALUES =====
  const selectedIds = useMemo(
    () =>
      Object.entries(rowSelection)
        .filter(([, selected]) => selected)
        .map(([id]) => id),
    [rowSelection],
  );

  const selectedStudents = useMemo(
    () => data.filter((item) => selectedIds.includes(item.id)),
    [data, selectedIds],
  );

  // ===== HANDLERS =====
  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("studentPage", page.toString());
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  const handleSelectAll = useCallback(() => {
    const newSelection = Object.fromEntries(
      data.map((item) => [item.id, true]),
    );

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

  const handleSendEmail = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student");

      return;
    }

    toast.success(`Sending Email to ${selectedIds.length} selected students`);
    console.log("Send Email to:", selectedStudents);
  }, [selectedIds, selectedStudents]);

  const handleIssueCertificate = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student");

      return;
    }

    toast.success(
      `Issuing certificates for ${selectedIds.length} selected students`,
    );
    console.log("Issue Certificate to:", selectedStudents);
  }, [selectedIds, selectedStudents]);

  const handleIssueDocument = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student");

      return;
    }

    toast.success(
      `Issuing documents for ${selectedIds.length} selected students`,
    );
    console.log("Issue Document to:", selectedStudents);
  }, [selectedIds, selectedStudents]);

  const handleDelete = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.warning("Please select at least one student");

      return;
    }

    toast.error(`Deleting ${selectedIds.length} selected students`);
    console.log("Delete:", selectedStudents);

    setRowSelection({});
  }, [selectedIds, selectedStudents]);

  // ===== BULK ACTIONS CONFIG =====
  const bulkActions = useMemo(
    () => ({
      onSelectAll: handleSelectAll,
      onClear: handleClearSelection,
      onSendSMS: handleSendSMS,
      onSendEmail: handleSendEmail,
      onIssueCertificate: handleIssueCertificate,
      onIssueDocument: handleIssueDocument,
      onDelete: handleDelete,
    }),
    [
      handleSelectAll,
      handleClearSelection,
      handleSendSMS,
      handleSendEmail,
      handleIssueCertificate,
      handleIssueDocument,
      handleDelete,
    ],
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-10 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-64 w-full animate-pulse rounded bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Table Toolbar */}
      <StudentDetailsToolbar
        bulkActions={bulkActions}
        selectedCount={selectedIds.length}
        totalCount={data.length}
      />

      {/* Student Table */}
      <StudentDetailsTable
        data={data}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        batchId={batchId}
        batchName=""
      />
    </div>
  );
}