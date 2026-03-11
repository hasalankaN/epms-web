"use client";

import React, { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import type { BankTransferRejectedRow } from "@/types/approval";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewSlipModal } from "@/components/admin-panel/approvals/bank-transfers/modals/ViewSlipModal";
import { ViewTransactionModal, type UserSummaryData, type TransactionDetails } from "@/components/admin-panel/approvals/bank-transfers/modals/ViewTransactionModal";

interface RejectedTableProps {
  data: BankTransferRejectedRow[];
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isError?: boolean;
}

export function RejectedTable({
  data,
  currentPage,
  onPageChange,
  isLoading = false,
  isError = false,
}: RejectedTableProps) {
  const itemsPerPage = 10;
  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSlipUrl, setSelectedSlipUrl] = useState<string | undefined>(undefined);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummaryData | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<TransactionDetails[]>([]);

  const handleViewSlip = (url?: string) => {
    setSelectedSlipUrl(url);
    setIsViewModalOpen(true);
  };

  const handleViewTransaction = (item: BankTransferRejectedRow) => {
    // Mock user data based on the row
    setSelectedUser({
      name: item.studentName,
      studentId: "STU-2026-001", // Placeholder
      registeredDate: "10/01/2026", // Placeholder
      email: "student@example.com", // Placeholder
      phone: item.whatsApp || "+94 70 000 0000",
      whatsapp: item.whatsApp || "+94 70 000 0000",
    });

    // Mock transaction data based on the row
    setSelectedTransactions([
      {
        id: "tx-1",
        transactionDate: item.date,
        transactionId: "#12345",
        amount: item.amount,
        invoiceUrl: "#",
      }
    ]);

    setIsTransactionModalOpen(true);
  };

  const columns: Column<BankTransferRejectedRow>[] = [
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
      header: "Enrolled By",
      accessorKey: "enrolledBy",
      className: "px-2 py-2 w-[200px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.enrolledBy}</div>,
    },
    {
      header: () => (
        <span className="flex items-center gap-1">
          <i className="whatsapp-logo h-4 w-4 text-[#64748B]" /> WhatsApp
        </span>
      ),
      accessorKey: "whatsApp",
      className: "px-2 py-2 w-[150px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.whatsApp}</div>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "px-2 py-2 w-[100px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.amount}</div>,
    },
    {
      header: "Ref. No",
      accessorKey: "refNo",
      className: "px-2 py-2 w-[100px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.refNo}</div>,
    },
    {
      header: "Rejected Reason",
      accessorKey: "rejectedReason",
      className: "px-2 py-2 w-[140px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.rejectedReason}</div>,
    },
    {
      header: "Bank Receipt",
      accessorKey: "bankReceipt",
      className: "px-2 py-2 w-[100px]",
      cell: (item) => (
        <button 
           onClick={() => handleViewSlip()}
           className="text-[12px] font-semibold text-[#E60076] hover:underline whitespace-nowrap bg-transparent border-none p-0 cursor-pointer"
        >
          {item.bankReceipt}
        </button>
      ),
    },
    {
      header: "Action",
      id: "actions",
      className: "px-2 py-2 w-[60px]",
      cell: (item) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 transition-colors">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
                <span className="sr-only">Open menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] p-1 rounded-xl shadow-lg border border-[#E2E8F0]">
              <DropdownMenuItem 
                 onClick={() => handleViewTransaction(item)}
                 className="text-[13px] font-medium text-[#0F172B] hover:bg-[#FDF2F8] focus:bg-[#FDF2F8] cursor-pointer"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] font-medium text-[#0F172B] hover:bg-[#FDF2F8] focus:bg-[#FDF2F8] cursor-pointer">
                Approve
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const getRowClassName = (item: BankTransferRejectedRow) => {
    if (item.enrolledBy.startsWith("Student Referral")) {
      return "border-b border-[#E7E5E4] bg-[#D9E9FF] hover:bg-[#D9E9FF]";
    }

    if (item.enrolledBy.startsWith("Agent Referral")) {
      return "border-b border-[#E7E5E4] bg-[#FFF7D7] hover:bg-[#FFF7D7]";
    }

    return "border-b border-[#E7E5E4] bg-white hover:bg-[#FFF9FC]";
  };

  return (
    <>
    <DataTable
      data={paginatedData}
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
