"use client";

import React, { useMemo } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

export interface GeneralExpenseData {
  id: string;
  date: string;
  expenseDescription: string;
  amount: string;
  transactionVia: string;
  branch: string;
}

interface GeneralExpenseTableProps {
  data: GeneralExpenseData[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  isLoading?: boolean;
  isError?: boolean;
}

export function GeneralExpenseTable({
  data,
  currentPage,
  onPageChange,
  totalResults,
  isLoading = false,
  isError = false,
}: GeneralExpenseTableProps) {
  const itemsPerPage = 10;
  const tableData = useMemo(() => data || [], [data]);
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return tableData.slice(start, start + itemsPerPage);
  }, [tableData, currentPage]);

  const columns: Column<GeneralExpenseData>[] = [
    {
      header: "Date",
      accessorKey: "date",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.date}</div>,
    },
    {
      header: "Expense Description",
      accessorKey: "expenseDescription",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[180px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.expenseDescription}</div>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[100px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.amount}</div>,
    },
    {
      header: "Transaction via",
      accessorKey: "transactionVia",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[130px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.transactionVia}</div>,
    },
    {
      header: "Branch",
      accessorKey: "branch",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[110px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.branch}</div>,
    },
    {
      header: "Evidence",
      accessorKey: "id",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[90px]",
      cell: () => (
        <button className="text-[12px] font-semibold text-[#E60076] hover:underline bg-transparent border-none p-0 cursor-pointer">
          View
        </button>
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
