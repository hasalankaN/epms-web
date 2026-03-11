"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { MoreVertical } from "lucide-react";

import type { BranchRow } from "@/types/branch";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateBranchStatus } from "@/hooks/api/branches/useUpdateBranchStatus";

const BRANCH_STATUS_OPTIONS = [
  { value: "ACTIVE", bg: "#DFFFF0", text: "#16A34A" },
  { value: "INACTIVE", bg: "#F1F5F9", text: "#000000" },
];

interface BranchTableProps {
  data: BranchRow[];
  totalResults: number;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEditBranch: (branch: BranchRow) => void;
}

export function BranchTable({
  data,
  totalResults,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
  onEditBranch,
}: BranchTableProps) {
  const router = useRouter();
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const [selectedItem, setSelectedItem] = useState<BranchRow | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useUpdateBranchStatus(
    selectedItem?.id || ""
  );

  const handleAction = (action: string, item: BranchRow) => {
    setSelectedItem(item);

    if (action === "view") {
      router.push(`/admin-panel/branch-management/view/${item.id}`);
      
      return;
    }

    if (action === "edit") {
      onEditBranch(item);
      
    return;
    }

    if (action === "activate" || action === "deactivate") {
      setIsStatusModalOpen(true);
      
      return;
    }

    console.log(`Action: ${action}`, item);
  };

  const handleStatusConfirm = async () => {
    if (!selectedItem) return;

    try {
      await updateStatus();
      setIsStatusModalOpen(false);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const columns: Column<BranchRow>[] = [
    {
      header: "Created Date",
      accessorKey: "created_at",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{new Date(item.created_at).toLocaleDateString()}</div>,
    },
    {
      header: "Branch ID",
      accessorKey: "branch_code",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.branch_code}</div>,
    },
    {
      header: "Branch Name",
      accessorKey: "name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{item.name}</div>,
    },
    {
      header: "Branch Type",
      accessorKey: "branch_type",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.branch_type}</div>,
    },
    {
      header: "Manager Name",
      accessorKey: "manager_name",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.manager_name || "-"}</div>,
    },
    {
      header: "Total Staff",
      accessorKey: "staff_count",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.staff_count}</div>,
    },
    {
      header: "Total Batches",
      accessorKey: "batch_count",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.batch_count}</div>,
    },
    {
      header: "Total Income",
      accessorKey: "total_income",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.total_income}</div>,
    },
    {
      header: "Total Expenses",
      accessorKey: "total_expenses",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.total_expenses}</div>,
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => (
        <StatusPopover
          value={item.status}
          options={BRANCH_STATUS_OPTIONS}
          readOnly
        />
      ),
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
            <DropdownMenuContent align="end" className="min-w-[130px]">
              <DropdownMenuItem onClick={() => handleAction("view", item)} className="cursor-pointer focus:bg-[#FDF2F8]">View</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("edit", item)} className="cursor-pointer focus:bg-[#FDF2F8]">Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("call", item)} className="cursor-pointer focus:bg-[#FDF2F8]">Call</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("whatsapp", item)} className="cursor-pointer focus:bg-[#FDF2F8]">WhatsApp</DropdownMenuItem>
              {item.status === "ACTIVE" ? (
                <DropdownMenuItem
                  onClick={() => handleAction("deactivate", item)}
                  className="cursor-pointer focus:bg-[#FDF2F8]"
                >
                  Deactivate
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleAction("activate", item)}
                  className="cursor-pointer focus:bg-[#FDF2F8]"
                >
                  Activate
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  // suppress unused variable warning
  void selectedItem;

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
          totalCount: totalResults,
          selectedRowCount: 0,
          currentPage,
          totalPages,
          onPageChange,
        }}
      />

      <DeleteConfirmationModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onConfirm={handleStatusConfirm}
        title={selectedItem?.status === "ACTIVE" ? "Confirm Deactivation" : "Confirm Activation"}
        description={`Are you sure you want to ${
          selectedItem?.status === "ACTIVE" ? "deactivate" : "activate"
        } ${selectedItem?.name}?`}
        confirmText={
          selectedItem?.status === "ACTIVE" ? "Confirm Deactivation" : "Confirm Re - Activation"
        }
        confirmVariant={selectedItem?.status === "ACTIVE" ? "destructive" : "primary"}
        isDeleting={isUpdatingStatus}
      />
    </>
  );
}
