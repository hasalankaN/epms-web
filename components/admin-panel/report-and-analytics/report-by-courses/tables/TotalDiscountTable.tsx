"use client";

import React, { useMemo } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

export interface TotalDiscountDataType {
  id: string;
  courseName: string;
  category: string;
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
}

export function TotalDiscountTable({
  data,
  currentPage,
  onPageChange,
}: TotalDiscountTableProps) {
  const itemsPerPage = 10;
  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const formatCurrency = (val: number) => val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const columns: Column<TotalDiscountDataType>[] = [
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
