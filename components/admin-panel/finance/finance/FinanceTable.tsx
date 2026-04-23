"use client";

import React, { useMemo } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

export interface FinanceTableDataType {
  id: string;
  date: string;
  totalPayment: number;
  totalDiscount: number;
  totalCommission: number;
  totalExpenses: number;
  netProfit: number;
}

interface FinanceTableProps {
  data: FinanceTableDataType[];
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  totalCount?: number;
}

export function FinanceTable({
  data,
  currentPage,
  onPageChange,
  isLoading = false,
  totalCount: externalTotalCount,
}: FinanceTableProps) {
  const itemsPerPage = 10;
  const filteredData = useMemo(() => data || [], [data]);

  const totalCount = externalTotalCount ?? filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const formatCurrency = (val: number) => {
    return `LKR ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const columns: Column<FinanceTableDataType>[] = [
    {
      header: "Date",
      accessorKey: "date",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{item.date}</div>,
    },
    {
      header: "Total Payment",
      accessorKey: "totalPayment",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">{formatCurrency(item.totalPayment)}</div>,
    },
    {
      header: "Total Discount",
      accessorKey: "totalDiscount",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{formatCurrency(item.totalDiscount)}</div>,
    },
    {
      header: "Total Commission",
      accessorKey: "totalCommission",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{formatCurrency(item.totalCommission)}</div>,
    },
    {
      header: "Total Expenses",
      accessorKey: "totalExpenses",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{formatCurrency(item.totalExpenses)}</div>,
    },
    {
      header: "Net Profit",
      accessorKey: "netProfit",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">{formatCurrency(item.netProfit)}</div>,
    },
  ];

  return (
    <DataTable
      data={paginatedData}
      columns={columns}
      keyExtractor={(item) => item.id}
      isLoading={isLoading}
      pagination={{
        variant: "simple",
        totalCount,
        selectedRowCount: 0,
        currentPage,
        totalPages,
        onPageChange: onPageChange,
      }}
    />
  );
}
