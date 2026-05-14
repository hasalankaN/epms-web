"use client";

import React from "react";

import { useGetCourseById } from "@/hooks/api/courses/useGetCourseById";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseCoverHeader } from "@/components/admin-panel/course-management/general/CourseCoverHeader";
import { CourseGeneralInfo } from "@/components/admin-panel/course-management/general/CourseGeneralInfo";
import { CourseVideoPlayer } from "@/components/admin-panel/course-management/general/CourseVideoPlayer";

interface CourseDetailsViewProps {
  courseId: string;
}

export function CourseDetailsView({ courseId }: CourseDetailsViewProps) {
  const { data, isLoading } = useGetCourseById(courseId);
  const generalDetails = data?.general_details;

  return (
    <div>
      {/* Header Section */}
      <CourseCoverHeader
        name={generalDetails?.name}
        status={data?.status}
        startDate={generalDetails?.start_date}
        endDate={generalDetails?.end_date}
        coverImageUrl={generalDetails?.cover_image_url}
        isLoading={isLoading}
      />

      {/* Description Section */}
      <div className="mt-[12px] flex flex-col gap-1 w-full px-4 md:px-6">
        <h2 className="font-inter text-[12px] font-normal leading-[16px] text-[#90A1B9]">
          Short Description
        </h2>
        {isLoading ? (
          <Skeleton className="h-10 w-full rounded" />
        ) : (
          <div 
            className="font-inter text-[14px] font-normal leading-[20px] text-[#314158] text-justify"
          >
            {generalDetails?.short_description || "No short description provided."}
          </div>
        )}
      </div>

      {/* Course Info Cards */}
      <div className="mt-4 px-4 md:px-6">
        <CourseGeneralInfo data={generalDetails} isLoading={isLoading} />
      </div>

      {/* Video + Long Description Section */}
      <div className="mt-6 flex flex-col lg:flex-row gap-6 px-4 md:px-6 pb-10">
        {/* Video Player */}
        <div className="w-full lg:w-[460px] shrink-0">
          {!isLoading && generalDetails?.intro_video_url ? (
            <CourseVideoPlayer 
              url={generalDetails.intro_video_url} 
            />
          ) : (
            <div className="w-full aspect-video rounded bg-slate-100 animate-pulse flex items-center justify-center">
              <span className="text-slate-400 text-xs italic">No video available</span>
            </div>
          )}
        </div>

        {/* Long Description */}
        <div className="flex flex-col gap-1 flex-1">
          <h2 className="font-inter text-[12px] font-normal leading-[16px] text-[#90A1B9]">
            Long Description
          </h2>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div 
              className="tiptap font-inter text-[14px] font-normal leading-[20px] text-[#314158] text-justify"
              dangerouslySetInnerHTML={{ __html: generalDetails?.long_description || "No long description provided." }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
