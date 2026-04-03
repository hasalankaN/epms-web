import React from "react";

import { cn } from "@/lib/utils";

const enrollmentData = [
  { label: "Total Student Enrollment Using Code", value: "XX" },
  { label: "Total Course Enrollment Using Code", value: "XX" },
  { label: "Total Batch Enrollment Using Code", value: "XX" },
  { label: "Total Product Purchase Using Code", value: "XX" },
];

interface EnrollmentStatsProps {
  className?: string;
}

export function EnrollmentStats({ className }: EnrollmentStatsProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      {enrollmentData.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-start gap-2 rounded-lg border border-[#E2E8F0] p-3 shadow-sm bg-[linear-gradient(315deg,_#FFCFEA_0.35%,_#F8FAFC_99.65%)]"
        >
          <span className="font-sans text-sm font-normal leading-5 text-[#45556C]">
            {item.label}
          </span>
          <span className="font-sans text-[24px] font-semibold leading-[38px] text-[#1D293D]">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
