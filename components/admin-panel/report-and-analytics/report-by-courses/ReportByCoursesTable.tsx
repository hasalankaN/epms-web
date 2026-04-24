"use client";

import React, { useMemo } from "react";

import { MoreVertical } from "lucide-react";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface ReportByCoursesDataType {
  id: string;
  courseName: string;
  category: string;
  totalAmountToCollect: number;
  totalPendingPayment: number | null; // null for N/A
  status: "Pending" | "Completed";
}

const STATUS_CONFIG = {
  Pending: { bg: "#FFF7D7", text: "#F59E0B" },
  Completed: { bg: "#DFFFF0", text: "#16A34A" },
};

interface ReportByCoursesTableProps {
  data: ReportByCoursesDataType[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function ReportByCoursesTable({
  data,
  currentPage,
  onPageChange,
}: ReportByCoursesTableProps) {
  const itemsPerPage = 10;
  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const formatCurrency = (val: number | null) => {
    if (val === null) return "N/A";
    
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const columns: Column<ReportByCoursesDataType>[] = [
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
      header: "Total Amount to Collect",
      accessorKey: "totalAmountToCollect",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.totalAmountToCollect)}</div>,
    },
    {
      header: "Total Pending Payment",
      accessorKey: "totalPendingPayment",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[11px] font-medium text-[#45556C]">{formatCurrency(item.totalPendingPayment)}</div>,
    },
    {
      header: "Total Payment Status",
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
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4 text-[#64748B]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[160px]">
            <DropdownMenuItem onClick={() => console.log("View", item)} className="cursor-pointer focus:bg-[#FDF2F8]">
              <span className="text-[#45556C] font-medium text-[13px]">View</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Export CSV", item)} className="cursor-pointer focus:bg-[#FDF2F8]">
              <span className="text-[#45556C] font-medium text-[13px]">Export CSV</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
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
