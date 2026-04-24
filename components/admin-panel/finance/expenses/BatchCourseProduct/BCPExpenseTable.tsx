"use client";

import React, { useMemo } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

export interface BCPExpenseData {
  id: string;
  date: string;
  expenseDescription: string;
  batchCourseProductName: string;
  amount: string;
  branch: string;
  transactionVia: string;
  source?: string;
  evidenceUrl?: string;
}

interface BCPExpenseTableProps {
  data: BCPExpenseData[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  totalPages?: number;
  isLoading?: boolean;
  isError?: boolean;
}

export function BCPExpenseTable({
  data,
  currentPage,
  onPageChange,
  totalResults,
  totalPages: externalTotalPages,
  isLoading = false,
  isError = false,
}: BCPExpenseTableProps) {
  const tableData = useMemo(() => data || [], [data]);
  const totalPages = externalTotalPages ?? Math.max(1, Math.ceil(totalResults / 20));
  const paginatedData = tableData;

  const columns: Column<BCPExpenseData>[] = [
    {
      header: "Date",
      accessorKey: "date",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.date}</div>,
    },
    {
      header: "Expense Description",
      accessorKey: "expenseDescription",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.expenseDescription}</div>,
    },
    {
      header: "Batch/Course/Product Name",
      accessorKey: "batchCourseProductName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[200px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.batchCourseProductName}</div>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.amount}</div>,
    },
    {
      header: "Branch",
      accessorKey: "branch",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.branch}</div>,
    },
    {
      header: "Transaction via",
      accessorKey: "transactionVia",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.transactionVia}</div>,
    },
    {
      header: "Evidence",
      accessorKey: "id",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[90px]",
      cell: (item) => item.evidenceUrl ? (
        <a href={item.evidenceUrl} target="_blank" rel="noopener noreferrer"
          className="text-[12px] font-semibold text-[#E60076] hover:underline">
          View
        </a>
      ) : (
        <span className="text-[12px] text-[#CBD5E1]">—</span>
      ),
    },
  ];

  return (
    <DataTable
      data={paginatedData}
      columns={columns}
      keyExtractor={(item) => item.id}
      isLoading={isLoading}
      isError={isError}
      tableContainerClassName="overflow-auto"
      pagination={{
        variant: "simple",
        totalCount: totalResults,
        selectedRowCount: 0,
        currentPage,
        totalPages,
        onPageChange,
      }}
    />
  );
}
