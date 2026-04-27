"use client";

import React, { useMemo } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

export interface TotalExpenseDataType {
  id: string;
  date: string;
  batchName: string;
  branch: string;
  description: string;
  transactionVia: string;
  amount: number;
}

interface TotalExpenseTableProps {
  data: TotalExpenseDataType[];
  currentPage: number;
  onPageChange: (page: number) => void;
  serverTotalCount?: number;
  serverTotalPages?: number;
  isLoading?: boolean;
}

export function TotalExpenseTable({
  data,
  currentPage,
  onPageChange,
  serverTotalCount,
  serverTotalPages,
  isLoading = false,
}: TotalExpenseTableProps) {
  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = serverTotalCount ?? filteredData.length;
  const totalPages = serverTotalPages ?? Math.max(1, Math.ceil(totalCount / 10));
  const paginatedData = filteredData;

  const formatCurrency = (val: number) => `${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const columns: Column<TotalExpenseDataType>[] = [
    {
      header: "Date",
      accessorKey: "date",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.date}</div>,
    },
    {
      header: "Batch Name",
      accessorKey: "batchName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.batchName}</div>,
    },
    {
      header: "Branch",
      accessorKey: "branch",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.branch}</div>,
    },
    {
      header: "Description",
      accessorKey: "description",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.description}</div>,
    },
    {
      header: "Transaction via",
      accessorKey: "transactionVia",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.transactionVia}</div>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.amount)}</div>,
    },
  ];

  return (
    <DataTable
      data={paginatedData}
      columns={columns}
      keyExtractor={(item) => item.id}
      isLoading={isLoading}
      tableContainerClassName="overflow-auto"
      pagination={{
        variant: "simple",
        totalCount,
        selectedRowCount: 0,
        currentPage,
        totalPages,
        onPageChange,
      }}
    />
  );
}
