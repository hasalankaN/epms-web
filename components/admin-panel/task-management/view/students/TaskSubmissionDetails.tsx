"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { toast } from "sonner";

import type { TaskSubmissionRow } from "./TaskSubmissionTable";
import { TaskSubmissionToolbar } from "./TaskSubmissionToolbar";
import { TaskSubmissionTable } from "./TaskSubmissionTable";
import type { TaskSubmission } from "@/hooks/api/tasks/useGetTaskDetail";

function formatDate(dateStr: string | Date | null): string {
  if (!dateStr) {
    return "-";
  }

  const d = new Date(dateStr);

  if (isNaN(d.getTime())) {
    return "-";
  }

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${yyyy}/${mm}/${dd}`;
}

function mapSubmissionStatus(status: string): "Completed" | "Pending" {
  return status === "COMPLETED" ? "Completed" : "Pending";
}

interface TaskSubmissionDetailsProps {
  taskId: string;
  submissions: TaskSubmission[];
}

export function TaskSubmissionDetails({ taskId, submissions }: TaskSubmissionDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("submissionPage");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // ===== SHARED STATE =====
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Map backend submissions to frontend row format

  const data: TaskSubmissionRow[] = useMemo(() => {
    return (submissions || []).map((sub) => ({
      id: sub.submission_id || `${sub.student_id || sub.staff_id}-pending`,
      studentName: sub.student_name || sub.staff_name || "Unknown",
      submittedOn: formatDate(sub.submitted_at),
      evidence: sub.files && sub.files.length > 0 ? "View" : "-",
      status: mapSubmissionStatus(sub.status),

      // Extra fields for modal/actions
      submissionId: sub.submission_id,
      files: sub.files,
    }));
  }, [submissions]);

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
        taskId={taskId}
      />
    </div>
  );
}
