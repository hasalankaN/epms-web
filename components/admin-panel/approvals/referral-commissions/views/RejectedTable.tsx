"use client";

import React from "react";

import { MoreVertical } from "lucide-react";

import type { CommissionRejectedRow } from "@/types/approval";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RejectedTableProps {
  data: CommissionRejectedRow[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isError?: boolean;
}

export function RejectedTable({
  data,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  isLoading = false,
  isError = false,
}: RejectedTableProps) {
  const itemsPerPage = 10;

  const columns: Column<CommissionRejectedRow>[] = [
    {
      header: "Date",
      accessorKey: "date",
      className: "px-2 py-2 w-[80px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.date}</div>,
    },
    {
      header: "Transaction For",
      accessorKey: "transactionFor",
      className: "px-2 py-2 w-[150px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.transactionFor}</div>,
    },
    {
      header: "Type",
      accessorKey: "type",
      className: "px-2 py-2 w-[90px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.type}</div>,
    },
    {
      header: "Student Name",
      accessorKey: "studentName",
      className: "px-2 py-2 w-[150px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.studentName}</div>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "px-2 py-2 w-[100px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.amount}</div>,
    },
    {
      header: "Referral Member",
      accessorKey: "referralMember",
      className: "px-2 py-2 w-[200px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] whitespace-norm break-words w-[180px]">
          {item.referralMember}
        </div>
      ),
    },
    {
      header: "Com. Rate",
      accessorKey: "comRate",
      className: "px-2 py-2 w-[90px] text-center",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap text-center">{item.comRate}</div>,
    },
    {
      header: "Com. Accumulated",
      accessorKey: "comAccumulated",
      className: "px-2 py-2 w-[140px] text-center",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap text-center">{item.comAccumulated}</div>,
    },
    {
      header: "Rejected Reason",
      accessorKey: "rejectedReason",
      className: "px-2 py-2 w-[140px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.rejectedReason}</div>,
    },
    {
      header: "Action",
      id: "actions",
      className: "px-2 py-2 w-[60px]",
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 transition-colors">
              <MoreVertical className="h-4 w-4 text-[#64748B]" />
              <span className="sr-only">Open menu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px] p-1 rounded-xl shadow-lg border border-[#E2E8F0]">
            <DropdownMenuItem className="text-[13px] font-medium text-[#0F172B] hover:bg-[#FDF2F8] focus:bg-[#FDF2F8] cursor-pointer">
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const getRowClassName = (item: CommissionRejectedRow) => {
    if (item.referralMember.startsWith("Student Referral")) {
      return "border-b border-[#E7E5E4] bg-[#D9E9FF] hover:bg-[#D9E9FF]";
    }

    if (item.referralMember.startsWith("Agent Referral")) {
      return "border-b border-[#E7E5E4] bg-[#FFF7D7] hover:bg-[#FFF7D7]";
    }

    return "border-b border-[#E7E5E4] bg-white hover:bg-[#FFF9FC]";
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      isLoading={isLoading}
      isError={isError}
      showCheckboxes={false}
      rowClassName={getRowClassName}
      pagination={{
        currentPage,
        totalPages,
        onPageChange,
        totalCount,
        selectedRowCount: 0,
        variant: "simple",
        itemsPerPage,
      }}
    />
  );
}
