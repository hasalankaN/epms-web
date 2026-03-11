import React from "react";

import { cn } from "@/lib/utils";
import type { CourseStatus } from "@/types/course";
import { COURSE_STATUS_CONFIG } from "@/types/course";

export function CourseCoverHeader({ courseId }: { courseId?: string }) {
  // Use courseId to avoid lint error (placeholder for data fetching later)
  if (courseId) {
      console.log("Rendering header for:", courseId);
  }

  // Placeholder image path - user can replace this later
  const COVER_IMAGE_URL = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop";
  
  const status: CourseStatus = "Active"; // Hardcoded for now, will be prop later
  const statusColors = COURSE_STATUS_CONFIG[status];

  return (
    <div 
        className={cn(
            "relative w-full overflow-hidden rounded-none flex flex-col justify-end items-start",
             "bg-cover bg-center bg-no-repeat",

             // Mobile/Tablet: Standard comfortable padding
             "p-6",

             // Desktop
             "lg:pt-[68px] lg:pr-[611px] lg:pb-[24px] lg:pl-[26px]"
        )}
        style={{
             backgroundImage: `linear-gradient(270deg, rgba(28, 25, 23, 0.00) 0%, rgba(28, 25, 19, 0.80) 100%), url(${COVER_IMAGE_URL})`,
        }}
    >
        <div className="flex flex-col items-start w-full mt-2">
            
            {/* Course Name */}
            <h1 className="font-inter text-[18px] font-medium leading-[30px] text-white">
                Marketing Course
            </h1>

            {/* Valid Status Chip + Date Range Row - "after 10px" */}
            <div className="mt-[10px] flex flex-col items-start gap-[10px]">
                
                {/* Status Pill - replicated from StatusPopover style */}
                <div
                    className={cn(
                        "inline-flex h-[24px] items-center justify-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                        "shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]",
                        "font-inter" 
                    )}
                    style={{
                        backgroundColor: statusColors.bg,
                        color: statusColors.text
                    }}
                >
                    <span>{status}</span>
                </div>

                {/* Date Range */}
                <span className="font-inter text-[12px] font-normal leading-[16px] text-[#CAD5E2]">
                    26/01/2026 - 20/04/2026
                </span>
            </div>

        </div>
    </div>
  );
}
