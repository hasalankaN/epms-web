"use client";

import React, { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import { cn } from "@/lib/utils";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskFeedbackModal } from "@/components/admin-panel/task-management/view/students/modals/TaskFeedbackModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

export interface TaskSubmissionRow {
  id: string;
  studentName: string;
  submittedOn: string;
  evidence: string; // "View" or "-"
  status: "Completed" | "Pending";
}

const SUBMISSION_STATUS_OPTIONS = [
  { value: "Completed", bg: "#DFFFF0", text: "#16A34A" },
  { value: "Pending", bg: "#FFF7D7", text: "#F59E0B" },
];

interface TaskSubmissionTableProps {
  data: TaskSubmissionRow[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function TaskSubmissionTable({
  data,
  rowSelection,
  setRowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
}: TaskSubmissionTableProps) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<TaskSubmissionRow | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<TaskSubmissionRow | null>(null);

  const itemsPerPage = 10;

  const totalCount = data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage]);

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const newSelection = Object.fromEntries(data.map((item) => [item.id, true]));

      setRowSelection(newSelection);
    } else {
      setRowSelection({});
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setRowSelection((prev) => ({ ...prev, [id]: checked }));
  };

  const handleAction = (action: string, submission: TaskSubmissionRow) => {
    if (action === "add-feedback") {
      setSelectedSubmission(submission);
      setIsFeedbackModalOpen(true);

      return;
    }

    if (action === "delete") {
      setSubmissionToDelete(submission);
      setIsDeleteModalOpen(true);

      return;
    }

    console.log(`Action: ${action}`, submission);
  };

  const columns: Column<TaskSubmissionRow>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={
            selectedRowCount === data.length && data.length > 0
              ? true
              : selectedRowCount > 0
                ? "indeterminate"
                : false
          }
          onCheckedChange={handleSelectAll}
          aria-label="Select all rows"
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      cell: (row) => (
        <Checkbox
          checked={!!rowSelection[row.id]}
          onCheckedChange={(checked) => handleSelectRow(row.id, !!checked)}
          aria-label={`Select ${row.studentName}`}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Student Name",
      accessorKey: "studentName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[180px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.studentName}</div>,
    },
    {
      header: "Submitted On",
      accessorKey: "submittedOn",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.submittedOn}</div>,
    },
    {
      header: "Evidence / Submission",
      accessorKey: "evidence",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[180px]",
      cell: (item) => (
        <div 
          className={cn(
            "text-[11px] font-medium whitespace-nowrap overflow-hidden text-ellipsis",
            item.evidence === "View" ? "text-[#E60076] cursor-pointer hover:underline" : "text-[#45556C]"
          )}
          onClick={() => item.evidence === "View" && handleAction("view", item)}
        >
          {item.evidence}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => (
        <StatusPopover
          value={item.status}
          options={SUBMISSION_STATUS_OPTIONS}
          readOnly
        />
      ),
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap text-right w-[80px]",
      cell: (row) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem onClick={() => handleAction("add-feedback", row)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Add Feedback
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-email", row)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-notification", row)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send Notification
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("delete", row)} className="cursor-pointer text-red-600 focus:bg-[#FDF2F8] focus:text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={paginatedData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        pagination={{
          variant: "simple",
          totalCount,
          selectedRowCount,
          currentPage,
          totalPages,
          onPageChange,
        }}
        rowClassName={(item) => (rowSelection[item.id] ? "selected" : "")}
      />
      
      <TaskFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        submission={selectedSubmission}
        onSendFeedback={(score, feedback) => {
          console.log("Feedback Submitted:", { score, feedback, submissionId: selectedSubmission?.id });
        }}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          console.log("Deleted Submission:", submissionToDelete?.id);
          setIsDeleteModalOpen(false);
          setSubmissionToDelete(null);
        }}
        title="Confirm Deletion"
        description="Are you sure you want to delete this submission? This action cannot be undone."
      />
    </>
  );
}
