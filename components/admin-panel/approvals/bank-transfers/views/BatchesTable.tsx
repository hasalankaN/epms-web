"use client";

import React, { useState } from "react";

import { MoreVertical } from "lucide-react";

import type { ApprovalSource, BankTransferBatchRow } from "@/types/approval";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewSlipModal } from "@/components/admin-panel/approvals/bank-transfers/modals/ViewSlipModal";
import {
  ViewTransactionModal,
  type UserSummaryData,
  type TransactionDetails,
} from "@/components/admin-panel/approvals/bank-transfers/modals/ViewTransactionModal";

interface BatchesTableProps {
  data: BankTransferBatchRow[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onApproveClick: (id: string, source: ApprovalSource) => void;
  onRejectClick: (id: string, source: ApprovalSource) => void;
  isLoading?: boolean;
  isError?: boolean;
}

export function BatchesTable({
  data,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onApproveClick,
  onRejectClick,
  isLoading = false,
  isError = false,
}: BatchesTableProps) {
  const itemsPerPage = 10;

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string | undefined>(
    undefined,
  );

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<UserSummaryData | null>(
    null,
  );

  const [selectedTransactions, setSelectedTransactions] = useState<
    TransactionDetails[]
  >([]);

  const handleViewSlip = (url?: string | null) => {
    setSelectedSlipUrl(url ?? undefined);
    setIsViewModalOpen(true);
  };

  const handleViewTransaction = (item: BankTransferBatchRow) => {
    setSelectedUser({
      name: item.studentName,
      studentId: item.id,
      registeredDate: item.transactionDate,
      email: "",
      phone: item.whatsApp,
      whatsapp: item.whatsApp,
    });
    setSelectedTransactions([
      {
        id: item.id,
        transactionDate: item.transactionDate,
        transactionId: item.refNo,
        amount: item.amount,
        invoiceUrl: item.receiptUrl ?? undefined,
      },
    ]);
    setIsTransactionModalOpen(true);
  };

  const columns: Column<BankTransferBatchRow>[] = [
    {
      header: "Transaction Date",
      accessorKey: "transactionDate",
      className: "px-2 py-2 w-[120px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
          {item.transactionDate}
        </div>
      ),
    },
    {
      header: "Batch Name",
      accessorKey: "batchName",
      className: "px-2 py-2 w-[150px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] line-clamp-2 break-words">
          {item.batchName}
        </div>
      ),
    },
    {
      header: "Student Name",
      accessorKey: "studentName",
      className: "px-2 py-2 w-[150px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] line-clamp-2 break-words">
          {item.studentName}
        </div>
      ),
    },
    {
      header: "Enrolled By",
      accessorKey: "enrolledBy",
      className: "px-2 py-2 w-[200px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] line-clamp-2 break-words">
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
      cell: (item) => {
        if (item.whatsApp === "—") {
          return <span className="text-[12px] font-medium text-[#45556C]">—</span>;
        }

        const cleaned = item.whatsApp.replace(/\D/g, "");

        
return (
          <a
            href={`https://wa.me/${cleaned}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] font-medium text-[#25D366] hover:underline transition-colors"
          >
            {item.whatsApp}
          </a>
        );
      },
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
      accessorKey: "receiptUrl",
      className: "px-2 py-2 w-[100px]",
      cell: (item) => (
        <button
          onClick={() => handleViewSlip(item.receiptUrl)}
          disabled={!item.receiptUrl}
          className="text-[12px] font-semibold text-[#E60076] hover:underline whitespace-nowrap bg-transparent border-none p-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          View
        </button>
      ),
    },
    {
      header: "Action",
      id: "actions",
      className: "px-2 py-2 w-[60px]",
      cell: (item) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 transition-colors">
              <MoreVertical className="h-4 w-4 text-[#64748B]" />
              <span className="sr-only">Open menu</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[160px] p-1 rounded-xl shadow-lg border border-[#E2E8F0]"
          >
            <DropdownMenuItem
              onClick={() => handleViewTransaction(item)}
              className="text-[13px] font-medium text-[#0F172B] hover:bg-[#FDF2F8] focus:bg-[#FDF2F8] cursor-pointer"
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onApproveClick(item.id, item.source)}
              className="text-[13px] font-medium text-[#0F172B] hover:bg-[#FDF2F8] focus:bg-[#FDF2F8] cursor-pointer"
            >
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onRejectClick(item.id, item.source)}
              className="text-[13px] font-medium text-[#E11D48] hover:bg-red-50 focus:bg-red-50 cursor-pointer"
            >
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const getRowClassName = (item: BankTransferBatchRow) => {
    const lower = item.enrolledBy.toLowerCase();

    if (lower.startsWith("referral enrollment")) {
      return "border-b border-[#E7E5E4] bg-[#D9E9FF] hover:bg-[#D9E9FF]";
    }

    
return "border-b border-[#E7E5E4] bg-white hover:bg-[#FFF9FC]";
  };

  return (
    <>
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
      <ViewSlipModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        imageUrl={selectedSlipUrl}
      />
      <ViewTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        user={selectedUser}
        transactions={selectedTransactions}
      />
    </>
  );
}
