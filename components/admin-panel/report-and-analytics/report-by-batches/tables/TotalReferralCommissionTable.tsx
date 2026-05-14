"use client";

import React, { useMemo } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

export interface TotalReferralCommissionDataType {
  id: string;
  batchName: string;
  studentName: string;
  paymentAmount: number;
  referralCom: number;
  referralPerson: string;
  date: string;
  offeredBy: string;
}

interface TotalReferralCommissionTableProps {
  data: TotalReferralCommissionDataType[];
  currentPage: number;
  onPageChange: (page: number) => void;
  serverTotalCount?: number;
  serverTotalPages?: number;
  isLoading?: boolean;
}

export function TotalReferralCommissionTable({
  data,
  currentPage,
  onPageChange,
  serverTotalCount,
  serverTotalPages,
  isLoading = false,
}: TotalReferralCommissionTableProps) {
  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = serverTotalCount ?? filteredData.length;
  const totalPages = serverTotalPages ?? Math.max(1, Math.ceil(totalCount / 10));
  const paginatedData = filteredData;

  const formatCurrency = (val: number) => `${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const columns: Column<TotalReferralCommissionDataType>[] = [
    {
      header: "Batch Name",
      accessorKey: "batchName",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.batchName}</div>,
    },
    {
      header: "Student Name",
      accessorKey: "studentName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.studentName}</div>,
    },
    {
      header: "Payment Amount",
      accessorKey: "paymentAmount",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.paymentAmount)}</div>,
    },
    {
      header: "Referral Com.",
      accessorKey: "referralCom",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.referralCom)}</div>,
    },
    {
      header: "Referral Person",
      accessorKey: "referralPerson",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.referralPerson}</div>,
    },
    {
      header: "Date",
      accessorKey: "date",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.date}</div>,
    },
    {
      header: "Offered By",
      accessorKey: "offeredBy",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.offeredBy}</div>,
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
