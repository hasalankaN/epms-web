"use client";

import React from "react";

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

import type { PendingRequestDataType } from "../PendingTab";

interface PendingTableProps {
  data: PendingRequestDataType[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
}

export function PendingTable({
  data,
  currentPage,
  onPageChange,
  totalResults,
}: PendingTableProps) {
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const handleAction = (action: string, item: PendingRequestDataType) => {
    if (action === "whatsapp") {
      window.open(`https://wa.me/94711234567`, "_blank");

      return;
    }
    
    console.log(`Action: ${action}`, item);
  };

  const columns: Column<PendingRequestDataType>[] = [
    {
      header: "Requested Date",
      accessorKey: "requestedDate",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.requestedDate}</div>
      ),
    },
    {
      header: "Member ID",
      accessorKey: "memberId",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.memberId}</div>
      ),
    },
    {
      header: "Member Name",
      accessorKey: "memberName",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap">{item.memberName}</div>
      ),
    },
    {
      header: "Requested Amount",
      accessorKey: "requestedAmount",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.requestedAmount}</div>
      ),
    },
    {
      header: "Requested For",
      accessorKey: "requestedFor",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.requestedFor}</div>
      ),
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap text-right w-[80px]",
      cell: (item) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[130px]">
              <DropdownMenuItem
                onClick={() => handleAction("view", item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("whatsapp", item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                Whatsapp
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAction("payment-now", item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                Payment Now
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      keyExtractor={(item) => item.id}
      showCheckboxes={false}
      pagination={{
        variant: "simple",
        totalCount: totalResults,
        currentPage,
        totalPages,
        onPageChange,
      }}
    />
  );
}
