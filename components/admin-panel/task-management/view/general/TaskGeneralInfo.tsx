import React from "react";

import { Download } from "lucide-react";

import { StatusPopover } from "@/components/common/StatusPopover";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";

export function TaskGeneralInfo() {
  return (
    <div className="flex flex-col w-full">
      {/* Title */}
      <h1 className="mt-2 md:mt-4 font-inter text-[16px] md:text-[18px] font-medium leading-[24px] md:leading-[30px] text-[#1D293D] break-words">
        Diploma in Digital Marketing - Batch 2
      </h1>

      {/* Status */}
      <div className="mt-3">
        <StatusPopover
          value="Batch Task"
          options={[{ value: "Batch Task", bg: "#FCE7F3", text: "#E60076" }]}
          readOnly
        />
      </div>

      {/* Date Range */}
      <div className="mt-3 font-inter text-[12px] font-normal leading-[16px] text-[#FB2C36]">
        26/01/2026 - 20/04/2026
      </div>

      {/* Task Guidelines Label */}
      <div className="mt-3 font-inter text-[12px] font-normal leading-[16px] text-[#90A1B9]">
        Task Guidelines
      </div>

      {/* Description Text */}
      <div className="mt-1 font-inter text-[13px] md:text-[14px] font-normal leading-[20px] text-[#314158]">
        Lorem ipsum dolor sit amet consectetur. Quis tortor porttitor eget senectus. Non turpis duis ac proin turpis gravida. Vitae mi scelerisque blandit morbi magna. Facilisis aenean lectus arcu sodales rhoncus pellentesque euismod vel at. Diam a sem enim pharetra commodo at. Eget massa pellentesque vel turpis ornare. Arcu ligula mauris scelerisque enim in eu. Porta ultrices ac enim amet diam aliquet est bibendum. Id sollicitudin phasellus facilisis sit sagittis. Id risus risus praesent magna arcu.
      </div>

      {/* Download Button */}
      <div className="mt-4 sm:mt-3 flex sm:block">
        <button className={cn(BUTTON_STYLES.outline.md, "w-full sm:w-auto text-[#0F172B] font-inter text-[14px] font-semibold leading-[20px]")}>
          <Download className="h-4 w-4" />
          Download Materials
        </button>
      </div>

      {/* Separator */}
      <div className="mt-6 h-[1px] w-full bg-[#E2E8F0]" />
    </div>
  );
}
