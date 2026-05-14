"use client";

import { useGetBranchById } from "@/hooks/api/branches/useGetBranchById";
import { useGetBatchWiseSummary } from "@/hooks/api/finances/useGetBatchWiseReport";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";
import { BranchGeneralInfo } from "./BranchGeneralInfo";
import { BranchStatCard } from "./BranchStatCard";
import { BranchStaffDetails } from "./staff/BranchStaffDetails";
import { BranchBatchDetails } from "./batches/BranchBatchDetails";

interface BranchDetailsViewProps {
  branchId: string;
}

export function BranchDetailsView({ branchId }: BranchDetailsViewProps) {
  const { data: branch, isLoading } = useGetBranchById(branchId);

  // Staff count
  const { data: staffData } = useGetStaff({ branch_id: branchId, size: 1 });

  // Batch count
  const { data: batchData } = useGetBatches({ branch_id: branchId, size: 1 });

  // Financial summary (income & expenses)
  const { data: financeSummary } = useGetBatchWiseSummary({
    branch_id: branchId,
  });

  function fmtLkr(val: string | null | undefined) {
    const n = parseFloat(val ?? "0");

    return `LKR ${n.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return (
    <div className="px-4 md:px-6 pb-12">
      <div className="flex flex-col gap-4 xl:flex-row xl:gap-6 mt-4">
        {/* Left Side: General Info Card */}
        <BranchGeneralInfo
          isLoading={isLoading}
          name={branch?.name}
          branchType={branch?.branch_type}
          address={branch?.address}
          email={branch?.email}
          phone={branch?.phone}
          whatsApp={branch?.whatsapp}
        />

        {/* Right Side: Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <BranchStatCard
            label="Total No. of Staff"
            value={staffData?.totalResults ?? "—"}
          />
          <BranchStatCard
            label="Total No. of Batches"
            value={batchData?.totalResults ?? "—"}
          />
          <BranchStatCard
            label="Total Income"
            value={fmtLkr(financeSummary?.total_payments)}
          />
          <BranchStatCard
            label="Total Expenses"
            value={fmtLkr(financeSummary?.total_expenses)}
          />
        </div>
      </div>

      {/* Staff Details */}
      <div className="mt-6">
        <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
          Staff Details
        </h2>
      </div>
      <div className="mt-4 w-full">
        <BranchStaffDetails branchId={branchId} />
      </div>

      {/* Batch Details */}
      <div className="mt-6">
        <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
          Batch Details
        </h2>
      </div>
      <div className="mt-4 w-full">
        <BranchBatchDetails branchId={branchId} />
      </div>
    </div>
  );
}
