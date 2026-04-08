"use client";

import React, { useState } from "react";

import { MoreVertical } from "lucide-react";

import type { CertificateRequestItem } from "@/types/certificate";
import { DataTable, type Column } from "@/components/common/table/DataTable";
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
import { useUpdateCertificateStatus } from "@/hooks/api/certificates/useUpdateCertificateStatus";
import { useDeleteCertificateRequest } from "@/hooks/api/certificates/useDeleteCertificateRequest";

const ISSUED_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending", bg: "#FFF7D7", text: "#F59E0B" },
  { value: "IN_PROGRESS", label: "Printing in progress", bg: "#D9E9FF", text: "#2563EB" },
  { value: "DELIVERED", label: "Delivered", bg: "#DFFFF0", text: "#16A34A" },
  { value: "DOWNLOADED", label: "Downloaded", bg: "#DFFFF0", text: "#16A34A" },
];

interface IssuedTableProps {
  data: CertificateRequestItem[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function IssuedTable({
  data,
  rowSelection,
  setRowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  totalCount,
  totalPages,
  onPageChange,
}: IssuedTableProps) {
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

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
  const [selectedItem, setSelectedItem] = useState<CertificateRequestItem | null>(null);

  const { mutate: updateStatus } = useUpdateCertificateStatus();
  const { mutate: deleteRequest, isPending: isDeleting } = useDeleteCertificateRequest();

  const handleAction = (action: string, item: CertificateRequestItem) => {
    console.log(`Action: ${action}`, item);
    
    if (action === "mark-delivered") {
      updateStatus({ id: item.id, status: "DELIVERED" });
    }

    if (action === "delete") {
      setSelectedItem(item);
      setDeleteModalOpen(true);
    }
  };

  const columns: Column<CertificateRequestItem>[] = [
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
          aria-label={`Select row`}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Student Name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{item.student?.full_name || "-"}</div>,
    },
    {
      header: "Certificate Name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.template?.name || "-"}</div>,
    },
    {
      header: "Courses/Batches Name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[170px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.course?.name || "-"} {item.batch?.name ? `/ ${item.batch.name}` : ""}
        </div>
      ),
    },
    {
      header: "Certificate Type",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.certificate_type || "-"}</div>,
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[160px]",
      cell: (item) => (
        <StatusPopover
          value={item.status || "PENDING"}
          options={ISSUED_STATUS_OPTIONS}
          readOnly={true}
        />
      ),
    },
    {
      header: "Issued Date",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}
        </div>
      ),
    },
    {
      header: "Verification No",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: () => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">-</div>,
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
            <DropdownMenuContent align="end" className="min-w-[160px]">
              <DropdownMenuItem onClick={() => handleAction("view", item)} className="cursor-pointer focus:bg-[#FDF2F8]">View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("mark-delivered", item)} className="cursor-pointer focus:bg-[#FDF2F8]">Mark as Delivered</DropdownMenuItem>
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
        data={data}
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
          if (selectedItem) {
            deleteRequest(selectedItem.id, {
              onSuccess: () => {
                setDeleteModalOpen(false);
                setRowSelection({});
              },
            });
          }
        }}
        isDeleting={isDeleting}
        title="Confirm Deletion"
        description="Are you sure you want to delete this issued certificate record? This action cannot be undone."
      />
    </>
  );
}
