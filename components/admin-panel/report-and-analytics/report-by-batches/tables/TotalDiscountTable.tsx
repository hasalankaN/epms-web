"use client";

import React, { useMemo } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

export interface TotalDiscountDataType {
  id: string;
  batchName: string;
  branch: string;
  studentName: string;
  referralName: string;
  actualValue: number;
  offerValue: number;
  discountReceived: number;
  offeredOn: string;
}

interface TotalDiscountTableProps {
  data: TotalDiscountDataType[];
  currentPage: number;
  onPageChange: (page: number) => void;
  serverTotalCount?: number;
  serverTotalPages?: number;
  isLoading?: boolean;
}

export function TotalDiscountTable({
  data,
  currentPage,
  onPageChange,
  serverTotalCount,
  serverTotalPages,
  isLoading = false,
}: TotalDiscountTableProps) {
  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = serverTotalCount ?? filteredData.length;
  const totalPages = serverTotalPages ?? Math.max(1, Math.ceil(totalCount / 10));
  const paginatedData = filteredData;

  const formatCurrency = (val: number) => `${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const columns: Column<TotalDiscountDataType>[] = [
    {
      header: "Batch Name",
      accessorKey: "batchName",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.batchName}</div>,
    },
    {
      header: "Branch",
      accessorKey: "branch",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.branch}</div>,
    },
    {
      header: "Student Name",
      accessorKey: "studentName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.studentName}</div>,
    },
    {
      header: "Referral Name",
      accessorKey: "referralName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.referralName}</div>,
    },
    {
      header: "Actual Value",
      accessorKey: "actualValue",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.actualValue)}</div>,
    },
    {
      header: "Offer Value",
      accessorKey: "offerValue",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.offerValue)}</div>,
    },
    {
      header: "Discount Received",
      accessorKey: "discountReceived",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.discountReceived)}</div>,
    },
    {
      header: "Offered On",
      accessorKey: "offeredOn",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.offeredOn}</div>,
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
