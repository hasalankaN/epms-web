"use client";

import React, { useMemo } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

export interface SalesByItemsDataType {
  id: string;
  itemName: string;
  noOfItemsSold: number;
  grossSale: number;
  totalDiscounts: number;
  totalRefCommissions: number;
  totalRefunds: number;
  netSales: number;
}

interface SalesByItemsTableProps {
  data: SalesByItemsDataType[];
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  totalCount?: number;
}

export function SalesByItemsTable({
  data,
  currentPage,
  onPageChange,
  isLoading = false,
  totalCount: externalTotalCount,
}: SalesByItemsTableProps) {
  const itemsPerPage = 10;
  const filteredData = useMemo(() => data || [], [data]);

  const totalCount = externalTotalCount ?? filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const formatCurrency = (val: number) => {
    return `${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const columns: Column<SalesByItemsDataType>[] = [
    {
      header: "Item Name",
      accessorKey: "itemName",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{item.itemName}</div>,
    },
    {
      header: "No. of items Sold",
      accessorKey: "noOfItemsSold",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#0F172B]">{item.noOfItemsSold}</div>,
    },
    {
      header: "Gross Sale",
      accessorKey: "grossSale",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.grossSale)}</div>,
    },
    {
      header: "Total Discounts",
      accessorKey: "totalDiscounts",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.totalDiscounts)}</div>,
    },
    {
      header: "Total Ref. Commissions",
      accessorKey: "totalRefCommissions",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.totalRefCommissions)}</div>,
    },
    {
      header: "Total refunds",
      accessorKey: "totalRefunds",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.totalRefunds)}</div>,
    },
    {
      header: "Net Sales",
      accessorKey: "netSales",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.netSales)}</div>,
    },
  ];

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[#E2E8F0]">
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
          onPageChange,
        }}
      />
    </div>
  );
}
