"use client";

import React, { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import type { CommissionBatchRow } from "@/types/approval";
import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewTransactionModal, type UserSummaryData, type TransactionDetails } from "@/components/admin-panel/approvals/bank-transfers/modals/ViewTransactionModal";
import { RejectReasonModal } from "@/components/common/RejectReasonModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

interface BatchesTableProps {
  data: CommissionBatchRow[];
  currentPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isError?: boolean;
}

export function BatchesTable({
  data,
  currentPage,
  onPageChange,
  isLoading = false,
  isError = false,
}: BatchesTableProps) {
  const itemsPerPage = 10;
  const filteredData = useMemo(() => data || [], [data]);
  const totalCount = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSummaryData | null>(null);
  const [selectedTransactions, setSelectedTransactions] = useState<TransactionDetails[]>([]);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRejectItem, setSelectedRejectItem] = useState<CommissionBatchRow | null>(null);

  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedApproveItem, setSelectedApproveItem] = useState<CommissionBatchRow | null>(null);

  const handleViewTransaction = (item: CommissionBatchRow) => {
    // Mock user data based on the row
    setSelectedUser({
      name: item.studentName,
      studentId: "STU-2026-001", // Placeholder
      registeredDate: "10/01/2026", // Placeholder
      email: "student@example.com", // Placeholder
      phone: "+94 70 000 0000", // Placeholder
      whatsapp: "+94 70 000 0000", // Placeholder
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

  const handleReject = (item: CommissionBatchRow) => {
    setSelectedRejectItem(item);
    setIsRejectModalOpen(true);
  };

  const handleApprove = (item: CommissionBatchRow) => {
    setSelectedApproveItem(item);
    setIsApproveModalOpen(true);
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const columns: Column<CommissionBatchRow>[] = [
    {
      header: "Date",
      accessorKey: "date",
      className: "px-2 py-2 w-[80px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.date}</div>,
    },
    {
      header: "Batch Name",
      accessorKey: "batchName",
      className: "px-2 py-2 w-[150px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.batchName}</div>,
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
      header: "Commission Rate",
      accessorKey: "commissionRate",
      className: "px-2 py-2 w-[120px] text-center",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap text-center">{item.commissionRate}</div>,
    },
    {
      header: "Commission Accumulated",
      accessorKey: "commissionAccumulated",
      className: "px-2 py-2 w-[180px] text-center",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap text-center">{item.commissionAccumulated}</div>,
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
          <DropdownMenuContent align="end" className="w-[160px] p-1 rounded-xl shadow-lg border border-[#E2E8F0]">
            <DropdownMenuItem 
               onClick={() => handleViewTransaction(item)}
               className="text-[13px] font-medium text-[#0F172B] hover:bg-[#FDF2F8] focus:bg-[#FDF2F8] cursor-pointer"
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleApprove(item)}
              className="text-[13px] font-medium text-[#0F172B] hover:bg-[#FDF2F8] focus:bg-[#FDF2F8] cursor-pointer"
            >
              Approve
            </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleReject(item)}
                className="text-[13px] font-medium text-[#E11D48] hover:bg-red-50 focus:bg-red-50 cursor-pointer"
              >
                Reject
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const getRowClassName = (item: CommissionBatchRow) => {
    if (item.referralMember.startsWith("Student Referral")) {
      return "border-b border-[#E7E5E4] bg-[#D9E9FF] hover:bg-[#D9E9FF]";
    }

    if (item.referralMember.startsWith("Agent Referral")) {
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
      <ViewTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        user={selectedUser}
        transactions={selectedTransactions}
      />
      <RejectReasonModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={(reason) => {
          console.log("Reject reason:", reason, "for item:", selectedRejectItem);
        }}
        description="Are you sure you want to reject this referral commission payment?"
      />
      <DeleteConfirmationModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={() => {
          console.log("Approved item:", selectedApproveItem);
          setIsApproveModalOpen(false);
        }}
        title="Confirm Action"
        description="Are you sure you want to approve this referral comission payment?"
        confirmText="Approve Payment"
        confirmVariant="primary"
      />
    </>
  );
}
