"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { TaskSubmissionRow } from "./TaskSubmissionTable";
import { TaskSubmissionToolbar } from "./TaskSubmissionToolbar";
import { TaskSubmissionTable } from "./TaskSubmissionTable";

// ===== MOCK DATA =====
const mockSubmissions: TaskSubmissionRow[] = Array.from({ length: 15 }, (_, i) => ({
  id: `submission-${i + 1}`,
  studentName: `Student Name ${i + 1}`,
  submittedOn: i % 4 === 3 ? "-" : "2026/01/21",
  evidence: i % 4 === 3 ? "-" : "View",
  status: i % 4 === 3 ? "Pending" : "Completed",
}));

export function TaskSubmissionDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("submissionPage");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // ===== SHARED STATE =====
  const [data] = useState<TaskSubmissionRow[]>(mockSubmissions);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // ===== DERIVED VALUES =====
  const filteredData = useMemo(() => {
    let result = data;

    if (searchValue.trim()) {
      const lower = searchValue.toLowerCase();

      result = result.filter(
        (item) =>
          item.studentName.toLowerCase().includes(lower)
      );
    }

    if (statusFilter) {
      result = result.filter((item) => item.status === statusFilter);
    }

    return result;
  }, [data, searchValue, statusFilter]);

  const selectedIds = useMemo(
    () => Object.entries(rowSelection).filter(([, selected]) => selected).map(([id]) => id),
    [rowSelection]
  );

  // ===== HANDLERS =====
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("submissionPage", page.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleSelectAll = useCallback(() => {
    const newSelection = Object.fromEntries(filteredData.map((item) => [item.id, true]));

    setRowSelection(newSelection);
    toast.success(`Selected all ${filteredData.length} submissions`);
  }, [filteredData]);

  const handleClearSelection = useCallback(() => {
    setRowSelection({});
    toast.info("Selection cleared");
  }, []);

  const handleDelete = useCallback(() => {
    if (selectedIds.length === 0) return;
    toast.error(`Deleting ${selectedIds.length} selected submission(s)`);
    setRowSelection({});
  }, [selectedIds]);

  const handleAddFeedback = useCallback(() => {
    if (selectedIds.length === 0) return;
    toast.success(`Opening feedback modal for ${selectedIds.length} selected submission(s)`);
  }, [selectedIds]);

  const handleSendNotification = useCallback(() => {
    if (selectedIds.length === 0) return;
    toast.success(`Sending notification to ${selectedIds.length} selected student(s)`);
  }, [selectedIds]);

  const handleSendEmail = useCallback(() => {
    if (selectedIds.length === 0) return;
    toast.success(`Sending email to ${selectedIds.length} selected student(s)`);
  }, [selectedIds]);

  // ===== BULK ACTIONS CONFIG =====
  const bulkActions = useMemo(
    () => ({
      onSelectAll: handleSelectAll,
      onClear: handleClearSelection,
      onDelete: handleDelete,
      onAddFeedback: handleAddFeedback,
      onSendNotification: handleSendNotification,
      onSendEmail: handleSendEmail,
    }),
    [handleSelectAll, handleClearSelection, handleDelete, handleAddFeedback, handleSendNotification, handleSendEmail]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <TaskSubmissionToolbar
        bulkActions={bulkActions}
        selectedCount={selectedIds.length}
        totalCount={filteredData.length}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Table */}
      <TaskSubmissionTable
        data={filteredData}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </div>
  );
}
