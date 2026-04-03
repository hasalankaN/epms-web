import React from "react";

import { cn } from "@/lib/utils";
import type { BatchStatus } from "@/types/batch";
import { BATCH_STATUS_CONFIG } from "@/types/batch";

export function BatchCoverHeader({ batchId }: { batchId?: string }) {
  // Use batchId to avoid lint error (placeholder for data fetching later)
  if (batchId) {
      console.log("Rendering header for:", batchId);
  }

  // Placeholder image path - user can replace this later
  const COVER_IMAGE_URL = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop";

  const status: BatchStatus = "Active"; // Hardcoded for now, will be prop later
  const statusColors = BATCH_STATUS_CONFIG[status];

  return (
    <div 
        className={cn(
            "relative w-full overflow-hidden rounded-none flex flex-col justify-end items-start",
             "bg-cover bg-center bg-no-repeat",

             // Mobile/Tablet: Standard comfortable padding
             "p-6",

             // Desktop
             "lg:pt-[68px] lg:pr-[611px] lg:pb-[24px] lg:pl-[26px]"
        )}
        style={{
             backgroundImage: `linear-gradient(270deg, rgba(28, 25, 23, 0.00) 0%, rgba(28, 25, 19, 0.80) 100%), url(${COVER_IMAGE_URL})`,
        }}
    >
        <div className="flex flex-col items-start w-full">
            
            {/* Batch Name */}
            <h1 className="font-inter text-[18px] font-medium leading-[30px] text-white">
                Diploma in Digital Marketing - Batch 2
            </h1>

            {/* Diploma Type - "after 2px" */}
            <div className="mt-[2px]">
                <span className="font-inter text-[14px] font-normal leading-[20px] text-[#F1F5F9]">
                    Diploma
                </span>
            </div>

            {/* Valid Status Chip + Date Range Row - "after 10px" */}
            <div className="mt-[10px] flex flex-col items-start gap-[10px]">
                
                {/* Status Pill - replicated from StatusPopover style */}
                <div
                    className={cn(
                        "inline-flex h-[24px] items-center justify-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                        "shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
                        "font-inter" 
                    )}
                    style={{
                        backgroundColor: statusColors.bg,
                        color: statusColors.text
                    }}
                >
                    <span>{status}</span>
                </div>

                {/* Date Range */}
                <span className="font-inter text-[12px] font-normal leading-[16px] text-[#CAD5E2]">
                    26/01/2026 - 20/04/2026
                </span>
            </div>

        </div>
    </div>
  );
}
