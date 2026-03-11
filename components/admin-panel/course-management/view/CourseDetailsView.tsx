"use client";

import React from "react";

import { CourseCoverHeader } from "./general/CourseCoverHeader";
import { CourseGeneralInfo } from "./general/CourseGeneralInfo";
import { CourseVideoPlayer } from "./general/CourseVideoPlayer";
import { CourseStudentDetails } from "./students/CourseStudentDetails";
import { CourseCertificateStats } from "./certificates/CourseCertificateStats";
import { CourseAllocatedCertificates } from "./certificates/CourseAllocatedCertificates";
import { CourseFeeTypesTable } from "./financials/CourseFeeTypesTable";
import { CourseAccountCard } from "./financials/CourseAccountCard";

export function CourseDetailsView({ courseId }: { courseId: string }) {
  return (
    <div className="mt-3"> 
      {/* 
         Header Section 
         Spacing: 12px from top elements (mt-3 = 12px since 1 = 4px)
      */}
      <CourseCoverHeader courseId={courseId} />
      
      {/* Description Section */}
      <div className="mt-[12px] flex flex-col gap-1 w-full px-4 md:px-6"> 
          <h2 className="font-inter text-[12px] font-normal leading-[16px] text-[#90A1B9]">
            Short Description
          </h2>
          <p className="font-inter text-[14px] font-normal leading-[20px] text-[#314158] flex-1">
            Lorem ipsum dolor sit amet consectetur. Quis tortor porttitor eget senectus. Non turpis duis ac proin turpis gravida.
          </p>
      </div>

      {/* General Info Card */}
      <div className="mt-4 w-full px-4 md:px-6">
         <CourseGeneralInfo />
      </div>

      {/* Video Player & Long Description Row */}
      <div className="mt-4 w-full px-4 md:px-6 flex flex-col md:flex-row gap-4">
        {/* Video Player */}
        <div className="w-full md:w-[370px] shrink-0">
          <CourseVideoPlayer 
            url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            title="Course Introduction Video"
            className="h-[210px]"
          />
        </div>

        {/* Long Description */}
        <div className="flex flex-col gap-1 flex-1">
          <h2 className="font-inter text-[12px] font-normal leading-[16px] text-[#90A1B9]">
            Long Description
          </h2>
          <p className="font-inter text-[14px] font-normal leading-[20px] text-[#314158]">
            Lorem ipsum dolor sit amet consectetur. Quis tortor porttitor eget senectus. Non turpis duis ac proin turpis gravida. Vitae mi scelerisque blandit morbi magna. Facilisis aenean lectus arcu sodales rhoncus pellentesque euismod vel at. Diam a sem enim pharetra commodo at. Eget massa pellentesque vel turpis ornare. Arcu ligula mauris scelerisque enim in eu. Porta ultrices ac enim amet diam aliquet est bibendum. Id sollicitudin phasellus facilisis sit sagittis. Id risus risus praesent magna arcu.
          </p>
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
          <CourseFeeTypesTable />
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
