"use client";

import React, { useState } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

interface AssignedBatch {
  id: string;
  assignedDate: string;
  batchNo: string;
  batchTitle: string;
  startDate: string;
  endDate: string;
  batchFee: string;
  noOfEnrollments: string;
}

const MOCK_DATA: AssignedBatch[] = [
  {
    id: "1",
    assignedDate: "2025/01/21",
    batchNo: "1",
    batchTitle: "Lorem Ipsum",
    startDate: "2025.12.12",
    endDate: "2026.2.12",
    batchFee: "XXXX.00",
    noOfEnrollments: "300",
  },
  {
    id: "2",
    assignedDate: "2025/01/21",
    batchNo: "2",
    batchTitle: "Lorem Ipsum",
    startDate: "2025.12.12",
    endDate: "2026.2.12",
    batchFee: "XXXX.00",
    noOfEnrollments: "300",
  },
];

export function LecturerAssignedBatches() {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalCount = MOCK_DATA.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paginatedData = MOCK_DATA.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: Column<AssignedBatch>[] = [
    {
      header: "Assigned Date",
      accessorKey: "assignedDate",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.assignedDate}</div>,
    },
    {
      header: "Batch No",
      accessorKey: "batchNo",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.batchNo}</div>,
    },
    {
      header: "Batch Title",
      accessorKey: "batchTitle",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.batchTitle}</div>,
    },
    {
      header: "Start Date",
      accessorKey: "startDate",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.startDate}</div>,
    },
    {
      header: "End Date",
      accessorKey: "endDate",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.endDate}</div>,
    },
    {
      header: "Batch Fee",
      accessorKey: "batchFee",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.batchFee}</div>,
    },
    {
      header: "No of Enrollments",
      accessorKey: "noOfEnrollments",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
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
          tableContainerClassName="h-auto"
          pagination={{
            variant: "simple",
            totalCount: totalCount,
            currentPage: currentPage,
            totalPages: totalPages,
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
}
