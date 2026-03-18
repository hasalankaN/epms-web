"use client";

import React, { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import { DataTable } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";
import type { Column } from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IncomeExpenseReportModal } from "./IncomeExpenseReportModal";

export interface ProfitLossTableDataType {
  id: string;
  description: string;
  totalIncome: number;
  totalExpenses: number;
  status: "Profited" | "Loss";
}

interface ProfitLossTableProps {
  data: ProfitLossTableDataType[];
  rowSelection: { [key: string]: boolean };
  setRowSelection: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
  isLoading?: boolean;
  isError?: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function ProfitLossTable({
  data,
  isLoading = false,
  isError = false,
  currentPage,
  onPageChange,
}: Omit<ProfitLossTableProps, "rowSelection" | "setRowSelection">) {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ProfitLossTableDataType | null>(null);

  const itemsPerPage = 10;
  const filteredData = useMemo(() => data || [], [data]);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handleViewReport = (row: ProfitLossTableDataType) => {
    setSelectedRow(row);
    setReportModalOpen(true);
  };

  const columns: Column<ProfitLossTableDataType>[] = [
    {
      id: "select",
      header: () => (
        <label className="sr-only">Select All</label>
      ),
      cell: (item) => (
        <label className="sr-only">Select {item.id}</label>
      ),
      className: "w-12 px-4 sr-only md:not-sr-only md:w-12",
    },
    {
      header: "Description",
      accessorKey: "description",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[250px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis">
          {item.description}
        </div>
      ),
    },
    {
      header: "Total Income",
      accessorKey: "totalIncome",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {formatCurrency(item.totalIncome)}
        </div>
      ),
    },
    {
      header: "Total Expenses",
      accessorKey: "totalExpenses",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap overflow-hidden text-ellipsis">
          {formatCurrency(item.totalExpenses)}
        </div>
      ),
    },
    {
      header: "Profit or Loss",
      accessorKey: "status",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[140px]",
      cell: (item) => {
        const options = [
          { value: "Profited", bg: "#DFFFF0", text: "#16A34A" },
          { value: "Loss", bg: "#FFDEDE", text: "#FB2C36" },
        ];

        return (
          <StatusPopover 
            value={item.status} 
            options={options} 
            readOnly 
          />
        );
      },
    },
    {
      header: "Action",
      className: "px-4 py-2 text-[13px] font-semibold text-[#1D293D] text-right w-[80px]",
      cell: (item) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem 
                onClick={() => handleViewReport(item)} 
                className="cursor-pointer focus:bg-[#FDF2F8]"
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
          totalCount: filteredData.length,
          selectedRowCount: 0,
          currentPage,
          totalPages,
          onPageChange,
        }}
      />

      {selectedRow && (
        <IncomeExpenseReportModal
          isOpen={reportModalOpen}
          onClose={() => {
            setReportModalOpen(false);
            setSelectedRow(null);
          }}
          reportId={selectedRow.id}
          incomeItems={[
            { id: "1", date: "2026/01/21", description: "Lorrem ipsum", transactionVia: "via", amount: "XXXX.00" },
            { id: "2", date: "2026/01/21", description: "Lorrem ipsum", transactionVia: "via", amount: "XXXX.00" },
          ]}
          incomeTotal="+XXXX.00"
          expenseItems={[
            { id: "1", date: "2026/01/21", description: "Lorrem ipsum", transactionVia: "via", amount: "XXXX.00" },
            { id: "2", date: "2026/01/21", description: "Lorrem ipsum", transactionVia: "via", amount: "XXXX.00" },
          ]}
          expenseTotal="-XXXX.00"
          status={selectedRow.status}
          balance="XXX.00"
        />
      )}
    </>
  );
}
