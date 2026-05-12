"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEnrollmentSummary } from "@/hooks/api/enrollments/useGetEnrollmentSummary";

interface EnrollStatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

function EnrollStatCard({ title, value, className }: EnrollStatCardProps) {
  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-[4px] self-stretch px-4", className)}>
      {/* Title */}
      <span className="text-center font-inter text-[14px] font-normal leading-[20px] text-[#314158]">
        {title}
      </span>
      {/* Value */}
      <span className="text-center font-inter text-[18px] font-semibold leading-[30px] text-[#020618]">
        {value}
      </span>
    </div>
  );
}

function EnrollStatsRowSkeleton() {
  const skeletonItems = Array.from({ length: 8 });

  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop (xl+) Skeleton */}
      <div className="hidden items-center justify-between py-3 xl:flex overflow-x-auto">
        {skeletonItems.map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-1 flex-col items-center justify-center gap-[4px] px-4 min-w-[140px]">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-10" />
            </div>
            {index < skeletonItems.length - 1 && (
              <div className="h-[60px] w-px shrink-0 bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tablet/Small Desktop Skeleton */}
      <div className="hidden md:block xl:hidden">
        <div className="grid grid-cols-4">
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center justify-center gap-[8px] py-4",
                index % 4 !== 0 && "border-l border-[#E2E8F0]",
                index >= 4 && "border-t border-[#E2E8F0]"
              )}
            >
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-8" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Skeleton */}
      <div className="md:hidden">
        <div className="grid grid-cols-2">
          {skeletonItems.map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center justify-center gap-[8px] py-4",
                index % 2 !== 0 && "border-l border-[#E2E8F0]",
                index >= 2 && "border-t border-[#E2E8F0]"
              )}
            >
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EnrollStatsRow() {
  const { data: summary, isLoading, isError } = useGetEnrollmentSummary();

  if (isLoading) {
    return <EnrollStatsRowSkeleton />;
  }

  const formatValue = (val: number | undefined): string => {
    if (isError || val === undefined) return "00";
    
    return val.toString().padStart(2, "0");
  };

  const statsData = [
    { title: "All Enrollments", value: formatValue(summary?.all) },
    { title: "Batch Enrollments", value: formatValue(summary?.batches) },
    { title: "Course Enrollments", value: formatValue(summary?.courses) },
    { title: "Pending", value: formatValue(summary?.pending) },
    { title: "On Going", value: formatValue(summary?.ongoing) },
    { title: "Completed", value: formatValue(summary?.completed) },
    { title: "Hold", value: formatValue(summary?.hold) },
    { title: "Dropped", value: formatValue(summary?.dropped) },
  ];

  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop (xl+): Flex layout - 8 columns */}
      <div className="hidden items-center justify-between py-3 xl:flex overflow-x-auto">
        {statsData.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <EnrollStatCard
              title={stat.title}
              value={stat.value}
              className="flex-shrink-0 min-w-[140px]"
            />
            {/* Divider - not after last item */}
            {index < statsData.length - 1 && (
              <div className="h-[60px] w-px shrink-0 bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tablet/Small Desktop (md to xl): 4 columns grid, 2 rows */}
      <div className="hidden md:block xl:hidden">
        <div className="grid grid-cols-4">
          {statsData.map((stat, index) => (
            <div
              key={stat.title}
              className={`
                py-3
                ${index % 4 !== 0 ? "border-l border-[#E2E8F0]" : ""}
                ${index >= 4 ? "border-t border-[#E2E8F0]" : ""}
              `}
            >
              <EnrollStatCard title={stat.title} value={stat.value} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile (<md): 2 columns grid, 4 rows */}
      <div className="md:hidden">
        <div className="grid grid-cols-2">
          {statsData.map((stat, index) => (
            <div
              key={stat.title}
              className={`
                py-3
                ${index % 2 !== 0 ? "border-l border-[#E2E8F0]" : ""}
                ${index >= 2 ? "border-t border-[#E2E8F0]" : ""}
              `}
            >
              <EnrollStatCard title={stat.title} value={stat.value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
