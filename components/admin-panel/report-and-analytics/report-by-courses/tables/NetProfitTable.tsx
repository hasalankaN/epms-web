"use client";

import React, { useMemo } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";

export interface NetProfitDataType {
  id: string;
  courseName: string;
  category: string;
  totalIncome: number;
  totalExpense: number;
  profitOrLossValue: number;
  status: "Profit" | "Loss";
}

const STATUS_CONFIG = {
  Profit: { bg: "#DFFFF0", text: "#16A34A" },
  Loss: { bg: "#FFE4E6", text: "#E11D48" },
};

interface NetProfitTableProps {
  data: NetProfitDataType[];
  currentPage: number;
  onPageChange: (page: number) => void;
  serverTotalCount?: number;
  serverTotalPages?: number;
  isLoading?: boolean;
}

export function NetProfitTable({
  data,
  currentPage,
  onPageChange,
  serverTotalCount,
  serverTotalPages,
  isLoading = false,
}: NetProfitTableProps) {
  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = serverTotalCount ?? filteredData.length;
  const totalPages = serverTotalPages ?? Math.max(1, Math.ceil(totalCount / 10));
  const paginatedData = filteredData;

  const formatCurrency = (val: number) => val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const columns: Column<NetProfitDataType>[] = [
    {
      header: "Course Name",
      accessorKey: "courseName",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.courseName}</div>,
    },
    {
      header: "Category",
      accessorKey: "category",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.category}</div>,
    },
    {
      header: "Total Income",
      accessorKey: "totalIncome",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.totalIncome)}</div>,
    },
    {
      header: "Total Expense",
      accessorKey: "totalExpense",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.totalExpense)}</div>,
    },
    {
      header: "Profit/ Loss value",
      accessorKey: "profitOrLossValue",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.profitOrLossValue)}</div>,
    },
    {
      header: "Profit/ Loss",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => {
        const options = Object.entries(STATUS_CONFIG).map(([status, config]) => ({
          value: status,
          bg: config.bg,
          text: config.text,
        }));

        return <StatusPopover value={item.status} options={options} readOnly />;
      },
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
