import React from "react";

import { cn } from "@/lib/utils";
import type { BatchStatus } from "@/types/batch";
import { BATCH_STATUS_CONFIG } from "@/types/batch";
import type { ApiBatchDetail } from "@/hooks/api/batches/useGetBatchById";

const DEFAULT_COVER = "/images/placeholder.jpg";

function formatDate(iso: string) {
  const d = new Date(iso);

  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

interface BatchCoverHeaderProps {
  batch: ApiBatchDetail | null | undefined;
}

export function BatchCoverHeader({ batch }: BatchCoverHeaderProps) {
  const coverImage = batch?.cover_image_url || DEFAULT_COVER;
  const status = (batch?.status as BatchStatus) ?? "Active";

  const statusColors =
    BATCH_STATUS_CONFIG[status] ?? BATCH_STATUS_CONFIG["Active"];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-none flex flex-col justify-end items-start min-h-[200px]",
        "bg-cover bg-center bg-no-repeat",
        "p-6",
        "lg:pt-[120px] lg:pr-[611px] lg:pb-[24px] lg:pl-[26px]",
      )}
      style={{
        backgroundImage: `linear-gradient(270deg, rgba(28, 25, 23, 0.00) 0%, rgba(28, 25, 19, 0.80) 100%), url(${coverImage})`,
      }}
    >
      <div className="flex flex-col items-start w-full">
        {/* Batch Name */}
        <h1 className="font-inter text-[18px] font-medium leading-[30px] text-white">
          {batch?.name ?? "—"}
        </h1>

        {/* Batch Type */}
        {/* <div className="mt-[2px]">
          <span className="font-inter text-[14px] font-normal leading-[20px] text-[#F1F5F9]">
            {batch?.type ?? "—"}
          </span>
        </div> */}

        {/* Status + Date Range */}
        <div className="mt-[10px] flex flex-col items-start gap-[10px]">
          <div
            className="inline-flex h-[24px] items-center justify-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] font-inter"
            style={{
              backgroundColor: statusColors.bg,
              color: statusColors.text,
            }}
          >
            <span>{status}</span>
          </div>

          {batch?.start_date && batch?.end_date && (
            <span className="font-inter text-[12px] font-normal leading-[16px] text-[#CAD5E2]">
              {formatDate(batch.start_date)} - {formatDate(batch.end_date)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
