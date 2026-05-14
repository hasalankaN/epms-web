"use client";

import React, { useMemo } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

export interface ReportByProductsDataType {
  id: string;
  date: string;
  totalPayment: number;
  totalDiscounts: number;
  totalReferralCommision: number;
  totalRefunds: number;
  netSales: number;
}

interface ReportByProductsTableProps {
  data: ReportByProductsDataType[];
  currentPage: number;
  onPageChange: (page: number) => void;
  serverTotalCount?: number;
  serverTotalPages?: number;
  isLoading?: boolean;
}

export function ReportByProductsTable({
  data,
  currentPage,
  onPageChange,
  serverTotalCount,
  serverTotalPages,
  isLoading = false,
}: ReportByProductsTableProps) {
  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = serverTotalCount ?? filteredData.length;
  const totalPages = serverTotalPages ?? Math.max(1, Math.ceil(totalCount / 10));
  const paginatedData = filteredData;

  const formatCurrency = (val: number) => val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const columns: Column<ReportByProductsDataType>[] = [
    {
      header: "Date",
      accessorKey: "date",
      className: "px-4 py-4 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.date}</div>,
    },
    {
      header: "Total Payment",
      accessorKey: "totalPayment",
      className: "px-2 py-4 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.totalPayment)}</div>,
    },
    {
      header: "Total Discounts",
      accessorKey: "totalDiscounts",
      className: "px-2 py-4 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.totalDiscounts)}</div>,
    },
    {
      header: "Total Referral Commision",
      accessorKey: "totalReferralCommision",
      className: "px-2 py-4 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.totalReferralCommision)}</div>,
    },
    {
      header: "Total Refunds",
      accessorKey: "totalRefunds",
      className: "px-2 py-4 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.totalRefunds)}</div>,
    },
    {
      header: "Net Sales",
      accessorKey: "netSales",
      className: "px-2 py-4 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.netSales)}</div>,
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
