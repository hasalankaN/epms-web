"use client";

import React, { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import type { ComplaintDataType } from "@/types/complaint";
import { COMPLAINT_STATUS_CONFIG } from "@/types/complaint";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewComplaintModal } from "@/components/admin-panel/complaint-management/modals/ViewComplaintModal";

interface AllComplaintTableProps {
  data: ComplaintDataType[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  totalPages: number;
}

export function AllComplaintTable({
  data,
  rowSelection,
  setRowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
  totalResults,
  totalPages,
}: AllComplaintTableProps) {
  const filteredData = useMemo(() => data || [], [data]);
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      const newSelection = Object.fromEntries(filteredData.map((item) => [item.id, true]));

      setRowSelection(newSelection);
    } else {
      setRowSelection({});
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setRowSelection((prev) => ({ ...prev, [id]: checked }));
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintDataType | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewComplaint, setViewComplaint] = useState<ComplaintDataType | null>(null);

  const handleAction = (action: string, complaint: ComplaintDataType) => {
    if (action === "view") {
      setViewComplaint(complaint);
      setIsViewModalOpen(true);
    } else if (action === "message") {
      console.log("Message complaint:", complaint);
    } else if (action === "delete") {
      setSelectedComplaint(complaint);
      setIsDeleteModalOpen(true);
    }
  };

  const statusOptions = Object.entries(COMPLAINT_STATUS_CONFIG).map(([status, config]) => ({
    value: status,
    bg: config.bg,
    text: config.text,
  }));

  const columns: Column<ComplaintDataType>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={
            selectedRowCount === filteredData.length && filteredData.length > 0
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
      cell: (complaint) => (
        <Checkbox
          checked={!!rowSelection[complaint.id]}
          onCheckedChange={(checked) => handleSelectRow(complaint.id, !!checked)}
          aria-label={`Select ${complaint.complaint_id}`}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Submitted Date",
      accessorKey: "submitted_date",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[180px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {new Date(item.submitted_date).toLocaleString("en-GB")}
        </div>
      ),
    },
    {
      header: "ID No.",
      accessorKey: "complaint_id",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[120px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.complaint_id}
        </div>
      ),
    },
    {
      header: "Submitted By",
      accessorKey: "submitted_by",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[200px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.submitted_by}
        </div>
      ),
    },
    {
      header: "Complain Type",
      accessorKey: "type",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[140px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase()}
        </div>
      ),
    },
    {
      header: "Complain Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[180px]",
      cell: (complaint) => (
        <StatusPopover
          value={complaint.status}
          options={statusOptions}
          readOnly={true}
        />
      ),
    },
    {
      header: "Assignee",
      accessorKey: "assignee",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.assignee || "-"}
        </div>
      ),
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap text-right w-[100px]",
      cell: (complaint) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem
                onClick={() => handleAction("view", complaint)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("message", complaint)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                Message
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("delete", complaint)}
                className="cursor-pointer text-red-600 focus:bg-[#FDF2F8] focus:text-red-600"
              >
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
        data={filteredData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        pagination={{
          variant: "simple",
          totalCount: totalResults,
          selectedRowCount,
          currentPage,
          totalPages,
          onPageChange,
        }}
        rowClassName={(item) => (rowSelection[item.id] ? "selected" : "")}
      />
      <ViewComplaintModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        complaint={viewComplaint}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          console.log("Deleting complaint:", selectedComplaint?.id);
          setIsDeleteModalOpen(false);
        }}
        title="Confirm Deletion"
        description="Are you sure you want to delete this complaint? This action cannot be undone."
      />
    </>
  );
}
