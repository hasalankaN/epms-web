"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface InquiryStatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

function InquiryStatCard({ title, value, className }: InquiryStatCardProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-1 px-4", className)}>
      {/* Title */}
      <span className="text-center font-sans text-[14px] font-normal leading-[20px] text-[#314158]">
        {title}
      </span>
      {/* Value */}
      <span className="text-center font-sans text-[18px] font-semibold leading-[30px] text-[#020618]">
        {value}
      </span>
    </div>
  );
}

// Dummy data for stats
const statsData = [
  { title: "All Inquiries", value: "300" },
  { title: "Today Inquiry", value: "40" },
  { title: "Today Follow Ups", value: "05" },
  { title: "Pending", value: "05" },
  { title: "In Progress", value: "15" },
  { title: "Completed", value: "25" },
  { title: "No Response", value: "00" },
];

export function AllInquiryStatsRow() {
  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop: Flex layout - 7 columns */}
      <div className="hidden items-center justify-between py-3 lg:flex">
        {statsData.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <InquiryStatCard
              title={stat.title}
              value={stat.value}
              className="flex-1"
            />
            {/* Divider - not after last item */}
            {index < statsData.length - 1 && (
              <div className="h-[60px] w-px bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tablet: Row 1 = 4 items, Row 2 = 3 items (span full width) */}
      <div className="hidden md:block lg:hidden">
        {/* Row 1: First 4 items */}
        <div className="grid grid-cols-4">
          {statsData.slice(0, 4).map((stat, index) => (
            <div
              key={stat.title}
              className={`py-3 ${index !== 0 ? "border-l border-[#E2E8F0]" : ""}`}
            >
              <InquiryStatCard title={stat.title} value={stat.value} />
            </div>
          ))}
        </div>
        {/* Row 2: Last 3 items (span full width) */}
        <div className="grid grid-cols-3 border-t border-[#E2E8F0]">
          {statsData.slice(4).map((stat, index) => (
            <div
              key={stat.title}
              className={`py-3 ${index !== 0 ? "border-l border-[#E2E8F0]" : ""}`}
            >
              <InquiryStatCard title={stat.title} value={stat.value} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: 2 columns, last row (1 item) spans full width */}
      <div className="md:hidden">
        {/* Rows with 2 items each */}
        <div className="grid grid-cols-2">
          {statsData.slice(0, 6).map((stat, index) => (
            <div
              key={stat.title}
              className={`
                py-3
                ${index % 2 !== 0 ? "border-l border-[#E2E8F0]" : ""}
                ${index >= 2 ? "border-t border-[#E2E8F0]" : ""}
              `}
            >
              <InquiryStatCard title={stat.title} value={stat.value} />
            </div>
          ))}
        </div>
        {/* Last row: 1 item spans full width */}
        <div className="border-t border-[#E2E8F0] py-3">
          <InquiryStatCard
            title={statsData[6].title}
            value={statsData[6].value}
          />
        </div>
      </div>
    </div>
  );
}
