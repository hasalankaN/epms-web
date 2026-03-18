import React from "react";

import { StatusPopover } from "@/components/common/StatusPopover";
import { Skeleton } from "@/components/ui/skeleton";

const BRANCH_STATUS_OPTIONS = [
  { bg: "#FCE7F3", text: "#E60076", value: "MAIN"},
  { bg: "#EEF2FF", text: "#6366F1", value: "DEVOTIONAL"},
  { bg: "#F1F5F9", text: "#64748B", value: "CITY"},
];

interface BranchGeneralInfoProps {
  isLoading?: boolean;
  name?: string;
  branchType?: string;
  address?: string;
  email?: string;
  phone?: string;
  whatsApp?: string;
}

export function BranchGeneralInfo({ 
  isLoading,
  name = "-",
  branchType = "MAIN",
  address = "-",
  email = "-",
  phone = "-",
  whatsApp = "-",
}: BranchGeneralInfoProps) {
  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-start justify-center gap-3 rounded-lg border border-[#E2E8F0] p-3 xl:w-[648px] xl:shrink-0 bg-white">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="h-7 w-48 rounded" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>

        <div className="flex w-full flex-col gap-2 mt-1">
           <Skeleton className="h-4 w-24 rounded" />
           <Skeleton className="h-14 w-full max-w-[300px] rounded" />
        </div>

        <div className="flex w-full flex-col gap-2 mt-1">
           <Skeleton className="h-4 w-24 rounded" />
           <Skeleton className="h-5 w-40 rounded" />
        </div>

        <div className="flex w-full items-start gap-8 mt-1">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-5 w-32 rounded" />
          </div>
          
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-5 w-32 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-start justify-center gap-3 rounded-lg border border-[#E2E8F0] p-3 xl:w-[648px] xl:shrink-0 bg-white">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-medium leading-[30px] text-[#1D293D] font-inter">
          {name}
        </h2>
        <StatusPopover
          value={branchType}
          options={BRANCH_STATUS_OPTIONS}
          readOnly
        />
      </div>

      <div className="flex w-full flex-col gap-1 mt-1">
        <span className="text-xs font-normal leading-4 text-[#90A1B9] font-inter">
          Branch Address
        </span>
        <span className="text-sm font-normal leading-5 text-[#314158] font-inter whitespace-pre-line">
          {address}
        </span>
      </div>

      <div className="flex w-full flex-col gap-1 mt-1">
        <span className="text-xs font-normal leading-4 text-[#90A1B9] font-inter">
          Branch Email
        </span>
        <span className="text-sm font-normal leading-5 text-[#314158] font-inter">
          {email}
        </span>
      </div>

      <div className="flex w-full items-start gap-8 mt-1">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-normal leading-4 text-[#90A1B9] font-inter">
            Contact Number
          </span>
          <span className="text-sm font-normal leading-5 text-[#314158] font-inter">
            {phone}
          </span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-normal leading-4 text-[#90A1B9] font-inter">
            WhatsApp Number
          </span>
          <span className="text-sm font-normal leading-5 text-[#314158] font-inter">
            {whatsApp || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
