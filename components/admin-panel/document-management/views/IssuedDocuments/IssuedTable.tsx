"use client";

import React, { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import type { IssuedDocumentRow } from "@/types/document";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ISSUED_DOC_STATUS_OPTIONS = [
  { value: "Pending", bg: "#FFF7D7", text: "#F59E0B" },
  { value: "In Progress", bg: "#D9E9FF", text: "#2563EB" },
  { value: "Downloaded", bg: "#DFFFF0", text: "#16A34A" },
  { value: "Delivered", bg: "#DFFFF0", text: "#16A34A" },
];

interface IssuedTableProps {
  data: IssuedDocumentRow[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function IssuedTable({
  data,
  rowSelection,
  setRowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
}: IssuedTableProps) {
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

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IssuedDocumentRow | null>(null);

  const handleAction = (action: string, item: IssuedDocumentRow) => {
    console.log(`Action: ${action}`, item);

    if (action === "delete") {
      setSelectedItem(item);
      setDeleteModalOpen(true);
    }
  };

  const columns: Column<IssuedDocumentRow>[] = [
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
      cell: (item) => (
        <Checkbox
          checked={!!rowSelection[item.id]}
          onCheckedChange={(checked) => handleSelectRow(item.id, !!checked)}
          aria-label={`Select ${item.studentName}`}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Student Name",
      accessorKey: "studentName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{item.studentName}</div>,
    },
    {
      header: "Document Name",
      accessorKey: "documentName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.documentName}</div>,
    },
    {
      header: "Courses/Batches Name",
      accessorKey: "coursesBatchesName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[170px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.coursesBatchesName}</div>,
    },
    {
      header: "Document Type",
      accessorKey: "documentType",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.documentType}</div>,
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => (
        <StatusPopover
          value={item.status}
          options={ISSUED_DOC_STATUS_OPTIONS}
          readOnly={true}
        />
      ),
    },
    {
      header: "Issued Date",
      accessorKey: "issuedDate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.issuedDate}</div>,
    },
    {
      header: "Verification No",
      accessorKey: "verificationNo",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.verificationNo}</div>,
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap text-right w-[80px]",
      cell: (item) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem onClick={() => handleAction("view", item)} className="cursor-pointer focus:bg-[#FDF2F8]">View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("print", item)} className="cursor-pointer focus:bg-[#FDF2F8]">Print</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("email", item)} className="cursor-pointer focus:bg-[#FDF2F8]">Email</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("delete", item)} className="cursor-pointer text-red-600 focus:bg-[#FDF2F8] focus:text-red-600">Delete</DropdownMenuItem>
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
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => {
          console.log("Deleting:", selectedItem?.id);
          setDeleteModalOpen(false);
        }}
        title="Confirm Deletion"
        description="Are you sure you want to delete this issued document record? This action cannot be undone."
      />
    </>
  );
}
