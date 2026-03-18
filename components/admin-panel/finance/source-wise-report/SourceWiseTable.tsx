"use client";

import React, { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TransactionReportModal } from "./TransactionReportModal";

// ===== TYPES =====

export interface SourceWiseData {
  id: string;
  transactionSource: string;
  totalIncome: string;
  totalExpenses: string;
}

// ===== MOCK REPORT DATA for modal =====

export const mockIncomeItems = [
  { id: "1", date: "2026/01/21", description: "Lorem ipsum", batchCourseProduct: "Course", amount: "XXXX.00" },
  { id: "2", date: "2026/01/21", description: "Lorrem ipsum", batchCourseProduct: "Product", amount: "XXXX.00" },
];

export const mockExpenseItems = [
  { id: "1", date: "2026/01/21", description: "Lorem ipsum", batchCourseProduct: "Product", amount: "XXXX.00" },
  { id: "2", date: "2026/01/21", description: "Lorrem ipsum", batchCourseProduct: "Product", amount: "XXXX.00" },
];

// ===== TABLE COMPONENT =====

interface SourceWiseTableProps {
  data: SourceWiseData[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  isLoading?: boolean;
  isError?: boolean;
}

export function SourceWiseTable({
  data,
  currentPage,
  onPageChange,
  totalResults,
  isLoading = false,
  isError = false,
}: SourceWiseTableProps) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SourceWiseData | null>(null);

  const itemsPerPage = 10;
  const tableData = useMemo(() => data || [], [data]);
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return tableData.slice(start, start + itemsPerPage);
  }, [tableData, currentPage]);

  const handleViewReport = (row: SourceWiseData) => {
    setSelectedRow(row);
    setReportModalOpen(true);
  };

  const columns: Column<SourceWiseData>[] = [
    {
      header: "Transaction Source",
      accessorKey: "transactionSource",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] text-left",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] pl-2">{item.transactionSource}</div>
      ),
    },
    {
      header: "Total Income",
      accessorKey: "totalIncome",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] text-center",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C]">{item.totalIncome}</div>
      ),
    },
    {
      header: "Total Expenses",
      accessorKey: "totalExpenses",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] text-center",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C]">{item.totalExpenses}</div>
      ),
    },
    {
      header: "Action",
      accessorKey: "id",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] text-center w-[80px]",
      cell: (item) => (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem
                onClick={() => handleViewReport(item)}
                className="cursor-pointer hover:bg-[#FDF2F8] focus:bg-[#FDF2F8]"
              >
                View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
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

      {selectedRow && (
        <TransactionReportModal
          isOpen={reportModalOpen}
          onClose={() => {
            setReportModalOpen(false);
            setSelectedRow(null);
          }}
          transactionSource={selectedRow.transactionSource}
          openingCash=""
          incomeItems={mockIncomeItems}
          incomeTotal="+XXXX.00"
          expenseItems={mockExpenseItems}
          expenseTotal="-XXXX.00"
          balance="+XXX.00"
        />
      )}
    </>
  );
}
