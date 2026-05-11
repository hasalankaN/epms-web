"use client";

import React from "react";

import { useGetBatchById } from "@/hooks/api/batches/useGetBatchById";
import { BatchCoverHeader } from "@/components/admin-panel/batch-management/view/general/BatchCoverHeader";
import { BatchGeneralInfo } from "@/components/admin-panel/batch-management/view/general/BatchGeneralInfo";
import { BatchEnrollmentStats } from "@/components/admin-panel/batch-management/view/students/BatchEnrollmentStats";

interface BatchDetailsViewProps {
  batchId: string;
}

export function BatchDetailsView({ batchId }: BatchDetailsViewProps) {
  const { data: batch, isLoading } = useGetBatchById(batchId);

  return (
    <div>
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
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
          </div>
        ) : (
          <p className="font-inter text-[14px] font-normal leading-[20px] text-[#314158] flex-1 text-justify">
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
      <div className="mt-4 w-full px-4 md:px-6 pb-10">
        <BatchEnrollmentStats />
      </div>
    </div>
  );
}
