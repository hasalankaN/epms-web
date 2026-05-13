"use client";

import React, { useState } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

import type { CompletedRequestDataType } from "../CompletedTab";
import { ViewSlipModal } from "@/components/admin-panel/approvals/bank-transfers/modals/ViewSlipModal";

interface CompletedTableProps {
  data: CompletedRequestDataType[];
  currentPage: number;
  onPageChange: (page: number) => void;
  totalResults: number;
  isLoading?: boolean;
}

export function CompletedTable({
  data,
  currentPage,
  onPageChange,
  totalResults,
  isLoading,
}: CompletedTableProps) {
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);

  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string | undefined>(
    undefined,
  );

  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  const columns: Column<CompletedRequestDataType>[] = [
    {
      header: "Requested Date",
      accessorKey: "requestedDate",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.requestedDate}
        </div>
      ),
    },
    {
      header: "Paid Date",
      accessorKey: "paidDate",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.paidDate}
        </div>
      ),
    },
    {
      header: "Member ID",
      accessorKey: "memberId",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.memberId}
        </div>
      ),
    },
    {
      header: "Member Name",
      accessorKey: "memberName",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap">
          {item.memberName}
        </div>
      ),
    },
    {
      header: "Requested Amount",
      accessorKey: "requestedAmount",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.requestedAmount}
        </div>
      ),
    },
    {
      header: "Bank Slip",
      accessorKey: "bankSlipUrl",
      className:
        "px-2 py-2 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[100px]",
      cell: (item) => (
        <button
          onClick={() => {
            setSelectedSlipUrl(item.bankSlipUrl);
            setIsSlipModalOpen(true);
          }}
          className="text-[11px] font-semibold text-[#F6339A] hover:underline"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        keyExtractor={(item) => item.id}
        showCheckboxes={false}
        isLoading={isLoading}
        pagination={{
          variant: "simple",
          totalCount: totalResults,
          currentPage,
          totalPages,
          onPageChange,
        }}
      />
      <ViewSlipModal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
        imageUrl={selectedSlipUrl}
      />
    </>
  );
}
