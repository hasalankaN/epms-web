"use client";

import React from "react";

import { useGetBatchById } from "@/hooks/api/batches/useGetBatchById";
import { useGetBatchAnalytics } from "@/hooks/api/batches/useGetBatchAnalytics";
import { BatchCoverHeader } from "./general/BatchCoverHeader";
import { BatchGeneralInfo } from "./general/BatchGeneralInfo";
import { BatchEnrollmentStats } from "./students/BatchEnrollmentStats";
import { BatchStudentDetails } from "./students/BatchStudentDetails";
import { BatchCertificateStats } from "./certificates/BatchCertificateStats";
import { BatchAllocatedCertificates } from "./certificates/BatchAllocatedCertificates";
import { BatchPaymentsTable } from "./financials/BatchPaymentsTable";
import { BatchRevenueCard } from "./financials/BatchRevenueCard";
import { BatchAccountCard } from "./financials/BatchAccountCard";

export function BatchDetailsView({ batchId }: { batchId: string }) {
  const { data: batch, isLoading } = useGetBatchById(batchId);
  const { data: analytics } = useGetBatchAnalytics(batchId);

  const enrollmentStats = analytics?.enrollment_stats;
  const certStats = analytics?.certificate_stats;
  const financialSummary = analytics?.financial_summary;

  return (
    <div className="mt-3">
      {/* Cover Header */}
      <BatchCoverHeader batch={batch} />

      {/* Description */}
      <div className="mt-[12px] flex flex-col gap-1 w-full px-4 md:px-6">
        <h2 className="font-inter text-[12px] font-normal leading-[16px] text-[#90A1B9]">
          Description
        </h2>
        {isLoading ? (
          <div className="space-y-2 mt-1">
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-slate-100" />
          </div>
        ) : (
          <p className="font-inter text-[14px] font-normal leading-[20px] text-[#314158] flex-1">
            {batch?.description ?? "No description provided."}
          </p>
        )}
      </div>

      {/* General Info */}
      <div className="mt-4 w-full px-4 md:px-6">
        <BatchGeneralInfo batch={batch} isLoading={isLoading} />
      </div>

      {/* Enrollment Statistics */}
      <div className="mt-6 px-4 md:px-6">
        <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
          Enrollment Statistics
        </h2>
      </div>
      <div className="mt-4 w-full px-4 md:px-6">
        <BatchEnrollmentStats
          total={enrollmentStats?.total}
          direct={enrollmentStats?.direct}
          referral={enrollmentStats?.referral}
        />
      </div>

      {/* Student Details */}
      <div className="mt-4 px-4 md:px-6">
        <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
          Student Details
        </h2>
      </div>
      <div className="mt-4 w-full px-4 md:px-6">
        <BatchStudentDetails batchId={batchId} />
      </div>

      {/* Certificate Details */}
      <div className="mt-4 px-4 md:px-6">
        <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
          Certificate Details
        </h2>
      </div>
      <div className="mt-4 px-4 md:px-6">
        <BatchCertificateStats
          completedPayments={certStats?.completed_payments}
          issuedCertificates={certStats?.issued_certificates}
          totalDownloads={certStats?.total_downloads}
          pendingCertificates={certStats?.pending_certificates}
        />
      </div>

      {/* Allocated Certificates */}
      <div className="mt-4 px-4 md:px-6">
        <h2 className="font-inter text-[16px] font-semibold leading-[24px] text-[#0F172B]">
          Allocated Certificates
        </h2>
      </div>
      <div className="mt-4 w-full px-4 md:px-6">
        <BatchAllocatedCertificates certificateIds={batch?.certificate_ids} />
      </div>

      {/* Batch Payments */}
      <div className="mt-6 px-4 md:px-6">
        <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
          Batch Payments
        </h2>
      </div>
      <div className="mt-4 w-full px-4 md:px-6">
        <BatchPaymentsTable feeItems={batch?.fee_items} />
      </div>

      {/* Divider */}
      <div className="mt-[15px] px-4 md:px-6 w-full">
        <div className="h-[1px] w-full bg-[#E2E8F0]" />
      </div>

      {/* Revenue + Batch Account */}
      <div className="mt-4 px-4 md:px-6 w-full flex flex-col lg:flex-row gap-4 mb-10">
        <BatchRevenueCard
          completedPercentage={financialSummary?.completed_percentage ?? 0}
          estimatedPayment={financialSummary?.estimated_payment ?? "0.00"}
          pendingPayment={financialSummary?.pending_payment ?? "0.00"}
          className="flex-1"
        />
        <BatchAccountCard
          totalPayments={
            financialSummary
              ? `+LKR ${financialSummary.total_payments}`
              : undefined
          }
          referralCommissions={
            financialSummary
              ? `-LKR ${financialSummary.referral_commissions}`
              : undefined
          }
          discounts={
            financialSummary ? `-LKR ${financialSummary.discounts}` : undefined
          }
          payOuts={financialSummary?.pay_outs?.map((p) => ({
            label: p.label,
            amount: `-LKR ${p.amount}`,
          }))}
          totalProfit={financialSummary?.total_profit}
          className="flex-1"
        />
      </div>
    </div>
  );
}
