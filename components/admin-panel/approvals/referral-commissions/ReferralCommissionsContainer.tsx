"use client";

import React, { useState } from "react";

import { format } from "date-fns";

import type { ReferralCommissionTabType } from "@/app/(main)/admin-panel/approvals/referral-commissions/page";
import type {
  CommissionBatchRow,
  CommissionCourseRow,
  CommissionProductRow,
  CommissionRejectedRow,
  CommissionsApiItem,
  RejectedType,
} from "@/types/approval";

import {
  useGetCommissions,
  type CommissionTabType,
} from "@/hooks/api/commissions/useGetCommissions";
import { useApproveCommission } from "@/hooks/api/commissions/useApproveCommission";
import { useRejectCommission } from "@/hooks/api/commissions/useRejectCommission";

import { BatchesTable } from "./views/BatchesTable";
import { CoursesTable } from "./views/CoursesTable";
import { ProductsTable } from "./views/ProductsTable";
import { RejectedTable } from "./views/RejectedTable";

import { RejectReasonModal } from "@/components/common/RejectReasonModal";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

// Map UI tab type to API CommissionTabType
const TAB_TYPE_MAP: Record<ReferralCommissionTabType, CommissionTabType> = {
  batches: "BATCH",
  "online-courses": "COURSE",
  products: "PRODUCT",
  rejected: "REJECTED",
};

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";

  try {
    return format(new Date(dateStr), "dd/MM/yyyy");
  } catch {
    return dateStr;
  }
}

function formatAmount(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "LKR 0.00";
  
return `LKR ${parseFloat(String(value)).toFixed(2)}`;
}

function formatRate(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "0%";
  
return `${value}%`;
}

function mapToBatchRow(item: CommissionsApiItem): CommissionBatchRow {
  return {
    id: item.id,
    date: formatDate(item.transaction_date),
    batchName: item.source_name ?? "—",
    studentName: item.student_full_name ?? "—",
    amount: formatAmount(item.payment_amount),
    referralMember: item.referral_member_name ?? "—",
    commissionRate: formatRate(item.commission_rate),
    commissionAccumulated: formatAmount(item.commission_amount),
  };
}

function mapToCourseRow(item: CommissionsApiItem): CommissionCourseRow {
  return {
    id: item.id,
    date: formatDate(item.transaction_date),
    courseName: item.source_name ?? "—",
    studentName: item.student_full_name ?? "—",
    amount: formatAmount(item.payment_amount),
    referralMember: item.referral_member_name ?? "—",
    commissionRate: formatRate(item.commission_rate),
    commissionAccumulated: formatAmount(item.commission_amount),
  };
}

function mapToProductRow(item: CommissionsApiItem): CommissionProductRow {
  return {
    id: item.id,
    date: formatDate(item.transaction_date),
    productName: item.source_name ?? "—",
    studentName: item.student_full_name ?? "—",
    amount: formatAmount(item.payment_amount),
    referralMember: item.referral_member_name ?? "—",
    commissionRate: formatRate(item.commission_rate),
    commissionAccumulated: formatAmount(item.commission_amount),
  };
}

function mapToRejectedRow(item: CommissionsApiItem): CommissionRejectedRow {
  const typeMap: Record<string, RejectedType> = {
    BATCH: "Batch",
    COURSE: "Course",
    PRODUCT: "Products",
  };

  return {
    id: item.id,
    date: formatDate(item.transaction_date),
    transactionFor: item.source_name ?? "—",
    type: typeMap[item.source_type] ?? "Batch",
    studentName: item.student_full_name ?? "—",
    amount: formatAmount(item.payment_amount),
    referralMember: item.referral_member_name ?? "—",
    comRate: formatRate(item.commission_rate),
    comAccumulated: formatAmount(item.commission_amount),
    rejectedReason: item.rejection_reason ?? "—",
  };
}

interface ReferralCommissionsContainerProps {
  activeTab: ReferralCommissionTabType;
}

export function ReferralCommissionsContainer({
  activeTab,
}: ReferralCommissionsContainerProps) {
  const [pages, setPages] = useState<Record<ReferralCommissionTabType, number>>({
    batches: 1,
    "online-courses": 1,
    products: 1,
    rejected: 1,
  });

  const [pendingApproveId, setPendingApproveId] = useState<string | null>(null);
  const [pendingRejectId, setPendingRejectId] = useState<string | null>(null);

  const apiType = TAB_TYPE_MAP[activeTab];
  const currentPage = pages[activeTab];

  const { data: apiResponse, isLoading, isError } = useGetCommissions({
    type: apiType,
    page: currentPage,
    size: 10,
  });

  const approveCommission = useApproveCommission();
  const rejectCommission = useRejectCommission();

  const items = apiResponse?.data ?? [];
  const meta = apiResponse?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const totalCount = meta?.total ?? 0;

  const handlePageChange = (page: number) => {
    setPages((prev) => ({ ...prev, [activeTab]: page }));
  };

  return (
    <div className="w-full">
      {activeTab === "batches" && (
        <BatchesTable
          data={items.map(mapToBatchRow)}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onApproveClick={(id) => setPendingApproveId(id)}
          onRejectClick={(id) => setPendingRejectId(id)}
          isLoading={isLoading}
          isError={isError}
        />
      )}
      {activeTab === "online-courses" && (
        <CoursesTable
          data={items.map(mapToCourseRow)}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onApproveClick={(id) => setPendingApproveId(id)}
          onRejectClick={(id) => setPendingRejectId(id)}
          isLoading={isLoading}
          isError={isError}
        />
      )}
      {activeTab === "products" && (
        <ProductsTable
          data={items.map(mapToProductRow)}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onApproveClick={(id) => setPendingApproveId(id)}
          onRejectClick={(id) => setPendingRejectId(id)}
          isLoading={isLoading}
          isError={isError}
        />
      )}
      {activeTab === "rejected" && (
        <RejectedTable
          data={items.map(mapToRejectedRow)}
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          isError={isError}
        />
      )}

      <DeleteConfirmationModal
        isOpen={!!pendingApproveId}
        onClose={() => setPendingApproveId(null)}
        onConfirm={() => {
          if (!pendingApproveId) return;
          approveCommission.mutate(
            { id: pendingApproveId },
            { onSettled: () => setPendingApproveId(null) },
          );
        }}
        title="Confirm Approval"
        description="Are you sure you want to approve this referral commission payment?"
        confirmText="Approve Payment"
        confirmVariant="primary"
      />

      <RejectReasonModal
        isOpen={!!pendingRejectId}
        onClose={() => setPendingRejectId(null)}
        onConfirm={(reason) => {
          if (!pendingRejectId) return;
          rejectCommission.mutate(
            { id: pendingRejectId, reason },
            { onSettled: () => setPendingRejectId(null) },
          );
        }}
        description="Are you sure you want to reject this referral commission payment?"
      />
    </div>
  );
}
