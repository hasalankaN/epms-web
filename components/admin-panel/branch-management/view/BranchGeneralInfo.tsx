import React from "react";

import type { BranchRow } from "@/types/branch";

import { StatusPopover } from "@/components/common/StatusPopover";

const BRANCH_STATUS_OPTIONS = [
  { value: "TYPE_1", bg: "#FCE7F3", text: "#E60076", label: "Main" },
  { value: "TYPE_2", bg: "#FCE7F3", text: "#E60076", label: "Sub" },
  { value: "TYPE_3", bg: "#FCE7F3", text: "#E60076", label: "Regional" },
];

interface BranchGeneralInfoProps {
  branch: BranchRow;
}

export function BranchGeneralInfo({ branch }: BranchGeneralInfoProps) {
  return (
    <div className="flex w-full flex-col items-start justify-center gap-3 rounded-lg border border-[#E2E8F0] p-3 xl:w-[648px] xl:flex-shrink-0">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-medium leading-[30px] text-[#1D293D] font-inter">
          {branch.name}
        </h2>
        <StatusPopover
          value={branch.branch_type}
          options={BRANCH_STATUS_OPTIONS}
          readOnly
        />
      </div>

      <div className="flex w-full flex-col gap-1 mt-1">
        <span className="text-xs font-normal leading-4 text-[#90A1B9] font-inter">
          Branch Address
        </span>
        <span className="text-sm font-normal leading-5 text-[#314158] font-inter">
          No. XX/X <br />
          Road Name, City, Postal Office. <br />
          Postal Code.
        </span>
      </div>

      <div className="flex w-full flex-col gap-1 mt-1">
        <span className="text-xs font-normal leading-4 text-[#90A1B9] font-inter">
          Branch Email
        </span>
        <span className="text-sm font-normal leading-5 text-[#314158] font-inter">
          branch@gmail.com
        </span>
      </div>

      <div className="flex w-full items-start gap-8 mt-1">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-normal leading-4 text-[#90A1B9] font-inter">
            Contact Number
          </span>
          <span className="text-sm font-normal leading-5 text-[#314158] font-inter">
            +70 XXX XXXX
          </span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs font-normal leading-4 text-[#90A1B9] font-inter">
            WhatsApp Number
          </span>
          <span className="text-sm font-normal leading-5 text-[#314158] font-inter">
            +70 XXX XXXX
          </span>
        </div>
      </div>
    </div>
  );
}
