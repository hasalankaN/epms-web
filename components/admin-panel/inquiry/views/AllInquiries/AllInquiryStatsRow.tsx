"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEnquiryDashboard } from "@/hooks/api/enquiries/useGetEnquiryDashboard";

interface InquiryStatCardProps {
  title: string;
  value: string | number;
  className?: string;
  isLoading?: boolean;
}

function InquiryStatCard({ title, value, className, isLoading }: InquiryStatCardProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-1 px-4", className)}>
      {/* Title */}
      <span className="text-center font-sans text-[14px] font-normal leading-[20px] text-[#314158]">
        {title}
      </span>
      {/* Value */}
      {isLoading ? (
        <Skeleton className="h-[28px] w-10 rounded-md" />
      ) : (
        <span className="text-center font-sans text-[18px] font-semibold leading-[30px] text-[#020618]">
          {typeof value === "number" ? value.toString().padStart(2, "0") : value}
        </span>
      )}
    </div>
  );
}

export function AllInquiryStatsRow() {
  const { data, isLoading } = useGetEnquiryDashboard();

  const statsData = [
    { title: "All Inquiries", value: data?.total ?? 0 },
    { title: "Today Inquiry", value: data?.today ?? 0 },
    { title: "Today Follow Ups", value: data?.today_follow_ups ?? 0 },
    { title: "Pending", value: data?.pending ?? 0 },
    { title: "In Progress", value: data?.in_progress ?? 0 },
    { title: "Completed", value: data?.completed ?? 0 },
    { title: "No Response", value: data?.no_response ?? 0 },
  ];

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
              isLoading={isLoading}
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
              <InquiryStatCard title={stat.title} value={stat.value} isLoading={isLoading} />
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
              <InquiryStatCard title={stat.title} value={stat.value} isLoading={isLoading} />
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
              <InquiryStatCard title={stat.title} value={stat.value} isLoading={isLoading} />
            </div>
          ))}
        </div>
        {/* Last row: 1 item spans full width */}
        <div className="border-t border-[#E2E8F0] py-3">
          <InquiryStatCard
            title={statsData[6].title}
            value={statsData[6].value}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
