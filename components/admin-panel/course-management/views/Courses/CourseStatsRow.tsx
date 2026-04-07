import React from "react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCourseStats } from "@/hooks/api/courses/useGetCourseStats";

interface CourseStatCardProps {
  title: string;
  value: string | number;
  isLoading?: boolean;
  className?: string;
}

function CourseStatCard({
  title,
  value,
  isLoading,
  className,
}: CourseStatCardProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-1 px-4", className)}
    >
      {/* Title */}
      <span className="text-center font-sans text-[14px] font-normal leading-[20px] text-[#314158]">
        {title}
      </span>
      {/* Value */}
      {isLoading ? (
        <Skeleton className="h-[28px] w-12 rounded-md" />
      ) : (
        <span className="text-center font-sans text-[18px] font-semibold leading-[30px] text-[#020618]">
          {value}
        </span>
      )}
    </div>
  );
}

export function CourseStatsRow() {
  const { data: stats, isLoading } = useGetCourseStats();

  const statsData = [
    { title: "Total Courses", value: stats?.total_courses ?? 0 },
    { title: "Total Enrollments", value: stats?.total_enrollments ?? 0 },
    {
      title: "Total Direct Enrollments",
      value: stats?.direct_enrollments ?? 0,
    },
    {
      title: "Total Referral Enrollments",
      value: stats?.referral_enrollments ?? 0,
    },
  ];

  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop: Flex layout - 4 columns */}
      <div className="hidden items-center justify-between py-3 md:flex">
        {statsData.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <CourseStatCard
              title={stat.title}
              value={stat.value}
              isLoading={isLoading}
              className="flex-1"
            />
            {/* Divider - not after last item */}
            {index < statsData.length - 1 && (
              <div className="h-[60px] w-px bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: 2 columns */}
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
              <CourseStatCard
                title={stat.title}
                value={stat.value}
                isLoading={isLoading}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
