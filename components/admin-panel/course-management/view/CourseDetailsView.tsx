import React from "react";

import { useGetCourseById } from "@/hooks/api/courses/useGetCourseById";
import { Skeleton } from "@/components/ui/skeleton";

import { CourseCoverHeader } from "../general/CourseCoverHeader";
import { CourseGeneralInfo } from "../general/CourseGeneralInfo";
import { CourseVideoPlayer } from "../general/CourseVideoPlayer";
import { CourseStudentDetails } from "./students/CourseStudentDetails";
import { CourseCertificateStats } from "./certificates/CourseCertificateStats";
import { CourseAllocatedCertificates } from "./certificates/CourseAllocatedCertificates";
import { CourseFeeTypesTable } from "./financials/CourseFeeTypesTable";
import { CourseAccountCard } from "./financials/CourseAccountCard";

export function CourseDetailsView({ courseId }: { courseId: string }) {
  const { data, isLoading } = useGetCourseById(courseId);
  const generalDetails = data?.general_details;
  const feeDetails = data?.fee_details;

  return (
    <div className="mt-3">
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
            className="tiptap font-inter text-[14px] font-normal leading-[20px] text-[#314158] flex-1"
            dangerouslySetInnerHTML={{ __html: generalDetails?.short_description || "No short description provided." }}
          />
        )}
      </div>

      {/* General Info Card */}
      <div className="mt-4 w-full px-4 md:px-6">
        <CourseGeneralInfo data={generalDetails} isLoading={isLoading} />
      </div>

      {/* Video Player & Long Description Row */}
      <div className="mt-4 w-full px-4 md:px-6 flex flex-col md:flex-row gap-4">
        {/* Video Player */}
        <div className="w-full md:w-[370px] shrink-0">
          <CourseVideoPlayer
            url={generalDetails?.intro_video_url || ""}
            title="Course Introduction Video"
            className="h-[210px]"
          />
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
              className="tiptap font-inter text-[14px] font-normal leading-[20px] text-[#314158]"
              dangerouslySetInnerHTML={{ __html: generalDetails?.long_description || "No long description provided." }}
            />
          )}
        </div>
      </div>

      {/* Student Details Title */}
      <div className="mt-6 px-4 md:px-6">
        <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
          Student Details
        </h2>
      </div>

      {/* Student Details Toolbar + Table */}
      <div className="mt-4 w-full px-4 md:px-6">
        <CourseStudentDetails />
      </div>

      {/* Certificate Details Title */}
      <div className="mt-4 px-4 md:px-6">
        <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
          Certificate Details
        </h2>
      </div>

      {/* Certificate Stats Grid */}
      <div className="mt-4 px-4 md:px-6">
        <CourseCertificateStats />
      </div>

      {/* Allocated Certificates Title */}
      <div className="mt-4 px-4 md:px-6">
        <h2 className="font-inter text-[16px] font-semibold leading-[24px] text-[#0F172B]">
          Allocated Certificates
        </h2>
      </div>

      {/* Allocated Certificates Table */}
      <div className="mt-4 w-full px-4 md:px-6">
        <CourseAllocatedCertificates />
      </div>

      {/* Fee Types Added Title */}
      <div className="mt-6 px-4 md:px-6">
        <h2 className="font-inter text-[20px] font-semibold leading-[32px] text-[#0F172B]">
          Fee Types Added
        </h2>
      </div>

      {/* Fee Types Table */}
      <div className="mt-4 w-full px-4 md:px-6">
        <CourseFeeTypesTable fees={feeDetails?.fees} isLoading={isLoading} />
      </div>

      {/* Divider Line */}
      <div className="mt-[15px] px-4 md:px-6 w-full">
        <div className="h-[1px] w-full bg-[#E2E8F0]" />
      </div>

      {/* Account Section */}
      <div className="mt-4 px-4 md:px-6 w-full flex flex-col mb-10">
        <CourseAccountCard />
      </div>
    </div>
  );
}
