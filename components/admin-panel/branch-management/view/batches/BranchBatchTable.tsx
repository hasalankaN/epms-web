"use client";

import React from "react";

import { Checkbox } from "@/components/ui/checkbox";

import type { BatchDataType } from "@/types/batch";
import { BATCH_STATUS_CONFIG } from "@/types/batch";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";

interface BranchBatchTableProps {
  data: BatchDataType[];
  rowSelection: { [key: string]: boolean };
  onRowSelectionChange: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onStatusChange: (id: string, status: string) => void;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function BranchBatchTable({
  data,
  rowSelection,
  onRowSelectionChange,
  onSelectAll,
  onStatusChange,
  isLoading = false,
  isError = false,
  currentPage,
  totalPages,
  onPageChange,
}: BranchBatchTableProps) {
  const selectedRowCount = Object.values(rowSelection).filter(Boolean).length;

  const columns: Column<BatchDataType>[] = [
    {
      id: "select",
      header: () => (
        <Checkbox
          checked={
            data.length > 0 && selectedRowCount === data.length
              ? true
              : selectedRowCount > 0
                ? "indeterminate"
                : false
          }
          onCheckedChange={(checked) => onSelectAll(!!checked)}
          aria-label="Select all rows"
          className="data-[state=checked]:border-[#E60076] data-[state=checked]:bg-[#E60076]"
        />
      ),
      cell: (batch) => (
        <Checkbox
          checked={!!rowSelection[batch.id]}
          onCheckedChange={(checked) => onRowSelectionChange(batch.id, !!checked)}
          aria-label={`Select ${batch.batchName}`}
          className="data-[state=checked]:border-[#E60076] data-[state=checked]:bg-[#E60076]"
        />
      ),
      className: "w-12 px-4",
    },
    {
      header: "Batch ID",
      accessorKey: "batchId",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.batchId}</div>,
    },
    {
      header: "Batch Name",
      accessorKey: "batchName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{item.batchName}</div>,
    },
    {
      header: "Category",
      accessorKey: "category",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.category}</div>,
    },
    {
      header: "Branch",
      accessorKey: "branch",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.branch}</div>,
    },
    {
      header: "Batch Type",
      accessorKey: "type",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.type}</div>,
    },
    {
      header: "Lecturer",
      accessorKey: "lecturer",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.lecturer}</div>,
    },
    {
      header: "No. of Student",
      accessorKey: "studentsCount",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.studentsCount}</div>,
    },
    {
      header: "Payment Type",
      accessorKey: "payment",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.payment}</div>,
    },
    {
      header: "Start Date",
      accessorKey: "startDate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.startDate}</div>,
    },
    {
      header: "End Date",
      accessorKey: "endDate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.endDate}</div>,
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
            onValueChange={(newStatus) => onStatusChange(batch.id, newStatus)}
            readOnly={false}
          />
        );
      },
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      isLoading={isLoading}
      isError={isError}
      tableContainerClassName="h-auto"
      pagination={{
        variant: "simple",
        totalCount: data.length,
        selectedRowCount,
        currentPage,
        totalPages,
        onPageChange: onPageChange,
      }}
      rowClassName={(item) => (rowSelection[item.id] ? "selected" : "")}
    />
  );
}
