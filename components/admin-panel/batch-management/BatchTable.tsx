"use client";

import React, { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { MoreVertical } from "lucide-react";

import type { BatchDataType } from "@/types/batch";
import { BATCH_STATUS_CONFIG } from "@/types/batch";

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

interface BatchTableProps {
  data: BatchDataType[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function BatchTable({
  data,
  rowSelection,
  setRowSelection,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
}: BatchTableProps) {
  const router = useRouter();
  const itemsPerPage = 10;

  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

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
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<BatchDataType | null>(null);

  const handleAction = (action: string, batch: BatchDataType) => {
    console.log(`Action: ${action}`, batch);
    
    if (action === "view") {
       router.push(`/admin-panel/batch-management/${batch.id}`);
    } else if (action === "edit") {
       router.push(`/admin-panel/batch-management/edit/${batch.id}`);
    } else if (action === "send-sms") {
        console.log("Send SMS to batch", batch.id);
    } else if (action === "send-email") {
        console.log("Send Email to batch", batch.id);
    } else if (action === "deactivate") {
        setSelectedBatch(batch);
        setIsDeactivateModalOpen(true);
    } else if (action === "delete") {
      setSelectedBatch(batch);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    // Implement actual delete logic (e.g., API call)
    console.log("Deleting batch:", selectedBatch?.id);
    setIsDeleteModalOpen(false);
  };

  const handleDeactivateConfirm = () => {
    // Implement actual deactivate logic
    console.log("Deactivating batch:", selectedBatch?.id);
    setIsDeactivateModalOpen(false);
  };


  const columns: Column<BatchDataType>[] = [
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
      cell: (batch) => (
        <Checkbox
          checked={!!rowSelection[batch.id]}
          onCheckedChange={(checked) => handleSelectRow(batch.id, !!checked)}
          aria-label={`Select ${batch.batchName}`}
          className="data-[state=checked]:bg-[#E60076] data-[state=checked]:border-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Batch ID",
      accessorKey: "batchId",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.batchId}</div>,
    },
    {
      header: "Batch Name",
      accessorKey: "batchName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[180px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{item.batchName}</div>,
    },
    {
      header: "Category",
      accessorKey: "category",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap capitalize overflow-hidden text-ellipsis">{item.category}</div>,
    },
    {
        header: "Branch",
        accessorKey: "branch",
        className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
        cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap capitalize overflow-hidden text-ellipsis">{item.branch}</div>,
    },
    {
      header: "Batch Type",
      accessorKey: "type",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap capitalize overflow-hidden text-ellipsis">{item.type}</div>,
    },
    {
        header: "Lecturer",
        accessorKey: "lecturer",
        className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
        cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.lecturer}</div>,
    },
    {
        header: "No. of Student",
        accessorKey: "studentsCount",
        className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px] text-center",
        cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap text-center overflow-hidden text-ellipsis">{item.studentsCount}</div>,
    },
    {
        header: "Payment Type",
        accessorKey: "payment",
        className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
        cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap capitalize overflow-hidden text-ellipsis">{item.payment}</div>,
    },
    {
        header: "Start Date",
        accessorKey: "startDate",
        className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
        cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.startDate}</div>,
    },
    {
        header: "End Date",
        accessorKey: "endDate",
        className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
        cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.endDate}</div>,
    },
    {
      header: "Status",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (batch) => {
        const options = Object.entries(BATCH_STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return (
          <StatusPopover
            value={batch.status}
            options={options}

            // Add onSelect logic if needed for updating status directly
            readOnly={false} // Allow changing status
          />
        );
      },
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap text-right w-[80px]",
      cell: (batch) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem onClick={() => handleAction("view", batch)} className="cursor-pointer focus:bg-[#FDF2F8]">
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("edit", batch)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-sms", batch)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send SMS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("send-email", batch)} className="cursor-pointer focus:bg-[#FDF2F8]">
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAction("deactivate", batch)} className="cursor-pointer text-red-600 focus:bg-[#FDF2F8] focus:text-red-600">
                Deactivate
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
          onPageChange: onPageChange,
        }}
        rowClassName={(item) => (rowSelection[item.id] ? "selected" : "")}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        description={`Are you sure you want to delete batch "${selectedBatch?.batchName}"? This action cannot be undone.`}
      />
      <DeleteConfirmationModal
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Confirm Deactivation"
        description={`Are you sure you want to deactivate ${selectedBatch?.batchName}?`}
        confirmText="Confirm Deactivation"
        cancelText="Go Back"
        confirmVariant="destructive"
      />
    </>
  );
}
