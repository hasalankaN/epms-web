import React from "react";

import { cn } from "@/lib/utils";
import { type CourseStatus, COURSE_STATUS_CONFIG } from "@/types/course";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseCoverHeaderProps {
  courseId?: string;
  name?: string;
  status?: string;
  startDate?: string | null;
  endDate?: string | null;
  coverImageUrl?: string | null;
  isLoading?: boolean;
}

export function CourseCoverHeader({
  name,
  status,
  startDate,
  endDate,
  coverImageUrl,
  isLoading,
}: CourseCoverHeaderProps) {
  // Use a fallback image if coverImageUrl is null
  const COVER_IMAGE_URL = coverImageUrl || "/images/placeholder.jpg";

  const courseStatus: CourseStatus = (status as CourseStatus) || "Active";
  const statusColors = COURSE_STATUS_CONFIG[courseStatus] || COURSE_STATUS_CONFIG.Active;

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full rounded-none" />;
  }

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-none flex flex-col justify-end items-start min-h-[200px]",
        "bg-cover bg-center bg-no-repeat",
        "p-6",
        "lg:pt-[120px] lg:pr-[611px] lg:pb-[24px] lg:pl-[26px]"
      )}
      style={{
        backgroundImage: `linear-gradient(270deg, rgba(28, 25, 23, 0.00) 0%, rgba(28, 25, 19, 0.80) 100%), url(${COVER_IMAGE_URL})`,
      }}
    >
      <div className="flex flex-col items-start w-full mt-2">
        {/* Course Name */}
        <h1 className="font-inter text-[18px] font-medium leading-[30px] text-white">
          {name || "Course Name"}
        </h1>

        {/* Valid Status Chip + Date Range Row */}
        <div className="mt-[10px] flex flex-col items-start gap-[10px]">
          {/* Status Pill */}
          <div
            className={cn(
              "inline-flex h-[24px] items-center justify-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              "shadow-[0_1px_2_px_0_rgba(16,24,40,0.05)]",
              "font-inter"
            )}
            style={{
              backgroundColor: statusColors.bg,
              color: statusColors.text,
            }}
          >
            <span>{courseStatus}</span>
          </div>

          {/* Date Range */}
          <span className="font-inter text-[12px] font-normal leading-[16px] text-[#CAD5E2]">
            {startDate || "TBD"} - {endDate || "TBD"}
          </span>
        </div>
      </div>
    </div>
  );
}
