"use client";

import React from "react";

import { useGetBatchSummary } from "@/hooks/api/batches/useGetBatchSummary";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface BatchStatCardProps {
  title: string;
  value: string | number;
  className?: string;
}

function BatchStatCard({ title, value, className }: BatchStatCardProps) {
  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-[4px] self-stretch px-4", className)}>
      <span className="text-center font-inter text-[14px] font-normal leading-[20px] text-[#314158]">
        {title}
      </span>
      <span className="text-center font-inter text-[18px] font-semibold leading-[30px] text-[#020618]">
        {value}
      </span>
    </div>
  );
}

function BatchStatsRowSkeleton() {
  const skeletonItems = Array.from({ length: 4 });

  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop & Tablet Skeleton */}
      <div className="hidden items-center justify-between py-3 md:flex">
        {skeletonItems.map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-1 flex-col items-center justify-center gap-[4px] px-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-7 w-12" />
            </div>
            {index < skeletonItems.length - 1 && (
              <div className="h-[60px] w-px bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
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
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BatchStatsRow() {
  const { data, isLoading, isError } = useGetBatchSummary({});

  if (isLoading) {
    return <BatchStatsRowSkeleton />;
  }

  const formatValue = (val: number | undefined): string => {
    if (isError || val === undefined) return "00";
    
    return val.toString().padStart(2, "0");
  };

  const statsData = [
    { title: "Total Number of Batches", value: formatValue(data?.total_batches) },
    { title: "Active Number of Batches", value: formatValue(data?.ongoing_batches) },
    { title: "Completed Number of Batches", value: formatValue(data?.completed_batches) },
    { title: "Online Number of Batches", value: formatValue(data?.online_batches) },
  ];

  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      <div className="hidden items-center justify-between py-3 md:flex">
        {statsData.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <BatchStatCard title={stat.title} value={stat.value} className="flex-1" />
            {index < statsData.length - 1 && (
              <div className="h-[60px] w-px bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="md:hidden">
        <div className="grid grid-cols-2">
          {statsData.map((stat, index) => (
            <div
              key={stat.title}
              className={cn(
                "py-3",
                index % 2 !== 0 && "border-l border-[#E2E8F0]",
                index >= 2 && "border-t border-[#E2E8F0]"
              )}
            >
              <BatchStatCard title={stat.title} value={stat.value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
