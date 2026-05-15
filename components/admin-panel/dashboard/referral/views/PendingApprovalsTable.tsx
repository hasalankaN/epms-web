"use client";

import React, { useState } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { ViewSlipModal } from "@/components/admin-panel/approvals/bank-transfers/modals/ViewSlipModal";

export interface PendingApprovalRow {
  id: string;
  transactionDate: string;
  batchName: string;
  studentName: string;
  enrolledBy: string;
  whatsApp: string;
  amount: string;
  refNo: string;
  receiptUrl?: string;
}

interface Props {
  data?: PendingApprovalRow[];
}

export function PendingApprovalsTable({ data }: Props) {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string | undefined>(
    undefined,
  );

  const handleViewSlip = (url?: string) => {
    setSelectedSlipUrl(url);
    setIsViewModalOpen(true);
  };

  const columns: Column<PendingApprovalRow>[] = [
    {
      header: "Transaction Date",
      accessorKey: "transactionDate",
      className: "px-2 py-2 w-[120px] whitespace-nowrap",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
          {item.transactionDate}
        </div>
      ),
    },
    {
      header: "Batch Name",
      accessorKey: "batchName",
      className: "px-2 py-2 w-[150px] whitespace-nowrap",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
          {item.batchName}
        </div>
      ),
    },
    {
      header: "Student Name",
      accessorKey: "studentName",
      className: "px-2 py-2 w-[150px] whitespace-nowrap",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
          {item.studentName}
        </div>
      ),
    },
    {
      header: "Enrolled By",
      accessorKey: "enrolledBy",
      className: "px-2 py-2 w-[200px] whitespace-nowrap",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
          {item.enrolledBy}
        </div>
      ),
    },
    {
      header: () => (
        <span className="flex items-center gap-1">
          <i className="whatsapp-logo h-4 w-4 text-[#64748B]" /> WhatsApp
        </span>
      ),
      accessorKey: "whatsApp",
      className: "px-2 py-2 w-[150px]",
      cell: (item) =>
        item.whatsApp && item.whatsApp !== "-" ? (
          <a
            href={`https://wa.me/${item.whatsApp.replace(/\s+/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-[#45556C] transition-colors hover:text-[#E60076]"
          >
            {item.whatsApp}
          </a>
        ) : (
          <span className="text-[11px] font-medium text-[#45556C]">
            {item.whatsApp || "-"}
          </span>
        ),
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "px-2 py-2 w-[100px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
          {item.amount}
        </div>
      ),
    },
    {
      header: "Ref. No",
      accessorKey: "refNo",
      className: "px-2 py-2 w-[100px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
          {item.refNo}
        </div>
      ),
    },
    {
      header: "Bank Receipt",
      id: "receiptUrl",
      className: "px-2 py-2 w-[100px]",
      cell: (item) => (
        <button
          onClick={() => handleViewSlip(item.receiptUrl)}
          className="text-[12px] font-semibold text-[#E60076] hover:underline whitespace-nowrap bg-transparent border-none p-0 cursor-pointer"
        >
          View
        </button>
      ),
    },
  ];

  const getRowClassName = (item: PendingApprovalRow) => {
    const lower = item.enrolledBy.toLowerCase();

    if (lower.startsWith("student referral")) {
      return "border-b border-[#E7E5E4] bg-[#D9E9FF] hover:bg-[#D9E9FF]";
    }

    if (lower.startsWith("agent referral")) {
      return "border-b border-[#E7E5E4] bg-[#FEF3C7] hover:bg-[#FEF3C7]"; // Yellow background for agent
    }

    return "border-b border-[#E7E5E4] bg-white hover:bg-[#FFF9FC]";
  };

  return (
    <div className="mt-[10px] w-full rounded-lg border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <DataTable
        data={data ?? []}
        columns={columns}
        keyExtractor={(item) => item.id}
        showCheckboxes={false}
        rowClassName={getRowClassName}
        hideBorder={true}
        tableContainerClassName="h-auto"
      />
      <div className="flex w-full items-center justify-center border-t border-[#E2E8F0] bg-white py-4 px-2">
        <span className="text-[14px] font-normal leading-[20px] text-[#6B7280] font-sans">
          View of first 5 Row
        </span>
      </div>
      <ViewSlipModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        imageUrl={selectedSlipUrl}
      />
    </div>
  );
}
