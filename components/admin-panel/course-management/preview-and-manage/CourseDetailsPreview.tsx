"use client";

import React from "react";

import { CourseCoverHeader } from "./general/CourseCoverHeader";
import { CourseGeneralInfo } from "./general/CourseGeneralInfo";
import { CourseVideoPlayer } from "./general/CourseVideoPlayer";
import { CourseStructure } from "./course-structure/CourseStructure";

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
          <h2 className="font-inter text-[14px] font-medium leading-[20px] text-[#1D293D] mb-1">
            Course Introduction Video <span className="text-[#DC2626]">*</span>
          </h2>
          <CourseVideoPlayer 
            url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            showTitle={false}
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

      {/* Course Structure Section - 16px gap (mt-4) */}
      <div className="mt-4 w-full px-4 md:px-6">
        <CourseStructure />
      </div>
    </div>
  );
}

