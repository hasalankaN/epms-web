"use client";

import React, { useState } from "react";

import { format } from "date-fns";

import type { BankTransferTabType } from "@/app/(main)/admin-panel/approvals/bank-transfers/page";

import { BatchesTable } from "./views/BatchesTable";
import { CoursesTable } from "./views/CoursesTable";
import { ProductsTable } from "./views/ProductsTable";
import { RejectedTable } from "./views/RejectedTable";
import { RejectReasonModal } from "@/components/common/RejectReasonModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

import {
  useGetApprovals,
  type ApprovalTabType,
} from "@/hooks/api/approvals/useGetApprovals";
import { useApprovePayment } from "@/hooks/api/approvals/useApprovePayment";
import { useRejectPayment } from "@/hooks/api/approvals/useRejectPayment";

import type {
  ApprovalsApiBankTransferItem,
  ApprovalsApiRejectedItem,
  BankTransferBatchRow,
  BankTransferCourseRow,
  BankTransferProductRow,
  BankTransferRejectedRow,
} from "@/types/approval";

interface BankTransfersContainerProps {
  activeTab: BankTransferTabType;
  dateRange?: { from?: Date; to?: Date };
}

const TAB_TYPE_MAP: Record<BankTransferTabType, ApprovalTabType> = {
  batches: "BATCH",
  "online-courses": "COURSE",
  products: "PRODUCT",
  rejected: "REJECTED",
};

function safeFormat(dateStr: string) {
  try {
    return format(new Date(dateStr), "MM/dd/yyyy");
  } catch {
    return dateStr;
  }
}

function fmtAmount(amount: number) {
  return Number(amount).toFixed(2);
}

function mapBatchRow(item: ApprovalsApiBankTransferItem): BankTransferBatchRow {
  return {
    id: item.payment_id,
    source: item.source,
    transactionDate: safeFormat(item.transaction_date),
    batchName: item.target_name ?? "—",
    studentName: item.student_full_name,
    enrolledBy: item.display_label,
    whatsApp: item.student_whatsapp ?? "—",
    amount: fmtAmount(item.amount),
    refNo: item.reference_number ?? "—",
    receiptUrl: item.receipt_url,
  };
}

function mapCourseRow(
  item: ApprovalsApiBankTransferItem,
): BankTransferCourseRow {
  return {
    id: item.payment_id,
    source: item.source,
    transactionDate: safeFormat(item.transaction_date),
    courseName: item.target_name ?? "—",
    studentName: item.student_full_name,
    enrolledBy: item.display_label,
    whatsApp: item.student_whatsapp ?? "—",
    amount: fmtAmount(item.amount),
    refNo: item.reference_number ?? "—",
    receiptUrl: item.receipt_url,
  };
}

function mapProductRow(
  item: ApprovalsApiBankTransferItem,
): BankTransferProductRow {
  return {
    id: item.payment_id,
    source: item.source,
    transactionDate: safeFormat(item.transaction_date),
    productName: item.target_name ?? "—",
    studentName: item.student_full_name,
    enrolledBy: item.display_label,
    whatsApp: item.student_whatsapp ?? "—",
    amount: fmtAmount(item.amount),
    refNo: item.reference_number ?? "—",
    receiptUrl: item.receipt_url,
  };
}

function mapRejectedRow(
  item: ApprovalsApiRejectedItem,
): BankTransferRejectedRow {
  const typeLabel =
    item.target_type === "PRODUCT"
      ? "Products"
      : item.target_type === "BATCH"
        ? "Batch"
        : "Course";

  return {
    id: item.payment_id,
    source: item.source,
    date: safeFormat(item.transaction_date),
    transactionFor: item.target_name ?? "—",
    type: typeLabel,
    studentName: item.student_full_name,
    enrolledBy: item.display_label,
    whatsApp: item.student_whatsapp ?? "—",
    amount: fmtAmount(item.amount),
    refNo: item.reference_number ?? "—",
    rejectedReason: "—",
    receiptUrl: item.receipt_url,
  };
}

export function BankTransfersContainer({
  activeTab,
  dateRange,
}: BankTransfersContainerProps) {
  const [pages, setPages] = useState<Record<BankTransferTabType, number>>({
    batches: 1,
    "online-courses": 1,
    products: 1,
    rejected: 1,
  });

  const currentPage = pages[activeTab];
  
  const setCurrentPage = (page: number) =>
    setPages((prev) => ({ ...prev, [activeTab]: page }));

  const { data, isLoading, isError } = useGetApprovals({
    type: TAB_TYPE_MAP[activeTab],
    page: currentPage,
    size: 10,
    dateRange,
  });

  const { mutate: approvePayment, isPending: isApproving } =
    useApprovePayment();

  const { mutate: rejectPayment } = useRejectPayment();

  const [pendingApprove, setPendingApprove] = useState<{
    paymentId: string;
    source: string;
  } | null>(null);

  const [pendingReject, setPendingReject] = useState<{
    paymentId: string;
    source: string;
  } | null>(null);

  const handleApproveClick = (paymentId: string, source: string) =>
    setPendingApprove({ paymentId, source });

  const handleRejectClick = (paymentId: string, source: string) =>
    setPendingReject({ paymentId, source });

  const confirmApprove = () => {
    if (!pendingApprove) return;
    approvePayment(pendingApprove, {
      onSettled: () => setPendingApprove(null),
    });
  };

  const confirmReject = (reason: string) => {
    if (!pendingReject) return;
    rejectPayment(
      { ...pendingReject, reason },
      { onSettled: () => setPendingReject(null) },
    );
  };

  const totalPages = data?.meta?.totalPages ?? 1;
  const totalCount = data?.meta?.total ?? 0;
  const items = data?.data ?? [];

  return (
    <div className="w-full">
      {activeTab === "batches" && (
        <BatchesTable
          data={(items as ApprovalsApiBankTransferItem[]).map(mapBatchRow)}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
          isError={isError}
          onApproveClick={handleApproveClick}
          onRejectClick={handleRejectClick}
        />
      )}
      {activeTab === "online-courses" && (
        <CoursesTable
          data={(items as ApprovalsApiBankTransferItem[]).map(mapCourseRow)}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
          isError={isError}
          onApproveClick={handleApproveClick}
          onRejectClick={handleRejectClick}
        />
      )}
      {activeTab === "products" && (
        <ProductsTable
          data={(items as ApprovalsApiBankTransferItem[]).map(mapProductRow)}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
          isError={isError}
          onApproveClick={handleApproveClick}
          onRejectClick={handleRejectClick}
        />
      )}
      {activeTab === "rejected" && (
        <RejectedTable
          data={(items as ApprovalsApiRejectedItem[]).map(mapRejectedRow)}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={setCurrentPage}
          isLoading={isLoading}
          isError={isError}
        />
      )}

      <DeleteConfirmationModal
        isOpen={!!pendingApprove}
        onClose={() => setPendingApprove(null)}
        onConfirm={confirmApprove}
        title="Approve Payment"
        description="Are you sure you want to approve this bank transfer payment?"
        confirmText={isApproving ? "Approving..." : "Approve Payment"}
        confirmVariant="primary"
      />
      <RejectReasonModal
        isOpen={!!pendingReject}
        onClose={() => setPendingReject(null)}
        onConfirm={confirmReject}
        description="Provide a reason for rejecting this bank transfer payment."
      />
    </div>
  );
}
