"use client";

import React, { useState } from "react";
import { format } from "date-fns";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import type { LecturerAssignedBatch } from "@/hooks/api/lecturers/useGetLecturerById";

interface BatchRow {
  id: string;
  assignedDate: string;
  batchNo: string;
  batchTitle: string;
  startDate: string;
  endDate: string;
  batchFee: string;
  noOfEnrollments: string;
}

interface LecturerAssignedBatchesProps {
  batches: LecturerAssignedBatch[];
  isLoading?: boolean;
}

export function LecturerAssignedBatches({ batches, isLoading = false }: LecturerAssignedBatchesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const data: BatchRow[] = batches.map((b, idx) => ({
    id: b.id,
    assignedDate: b.created_at ? format(new Date(b.created_at), "yyyy/MM/dd") : "—",
    batchNo: String(idx + 1),
    batchTitle: b.name,
    startDate: b.start_date ? format(new Date(b.start_date), "yyyy.MM.dd") : "—",
    endDate: b.end_date ? format(new Date(b.end_date), "yyyy.MM.dd") : "—",
    batchFee: `LKR ${Number(b.base_price).toFixed(2)}`,
    noOfEnrollments: String(b.enrollment_count),
  }));

  const totalCount = data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: Column<BatchRow>[] = [
    {
      header: "Assigned Date",
      accessorKey: "assignedDate",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.assignedDate}</div>,
    },
    {
      header: "Batch No",
      accessorKey: "batchNo",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.batchNo}</div>,
    },
    {
      header: "Batch Title",
      accessorKey: "batchTitle",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] line-clamp-2 break-words">{item.batchTitle}</div>,
    },
    {
      header: "Start Date",
      accessorKey: "startDate",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.startDate}</div>,
    },
    {
      header: "End Date",
      accessorKey: "endDate",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.endDate}</div>,
    },
    {
      header: "Batch Fee",
      accessorKey: "batchFee",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.batchFee}</div>,
    },
    {
      header: "No of Enrollments",
      accessorKey: "noOfEnrollments",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.noOfEnrollments}</div>,
    },
  ];

  return (
    <div className="flex flex-col">
      <h2 className="font-inter text-[18px] font-semibold leading-[30px] text-[#0F172B]">
        Assigned Batches
      </h2>

      <div className="mt-[8px] w-full max-w-full overflow-hidden">
        <DataTable
          data={paginatedData}
          columns={columns}
          keyExtractor={(item) => item.id}
          showCheckboxes={true}
          isLoading={isLoading}
          tableContainerClassName="h-auto"
          pagination={{
            variant: "simple",
            totalCount,
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
}
