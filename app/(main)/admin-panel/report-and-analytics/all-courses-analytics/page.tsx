"use client";

import React from "react";

import { AnalyticsTopBar } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsTopBar";
import { AnalyticsStatsRow } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsStatsRow";
import { AnalyticsStudentStats } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsStudentStats";
import { AnalyticsEnrollmentByDistrict } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsEnrollmentByDistrict";
import { AnalyticsBreakdown } from "@/components/admin-panel/report-and-analytics/shared/AnalyticsBreakdown";

const COURSE_STATS = [
  { key: "total-courses", title: "Total Courses", value: "XX" },
  { key: "ongoing-courses", title: "Ongoing Courses", value: "XX" },
  { key: "deactivated-courses", title: "Deactivated Courses", value: "XX" },
];

const BY_LANGUAGE = [
  { label: "Sinhala", value: "XX" },
  { label: "English", value: "XX" },
  { label: "Tamil", value: "XX" },
];

const CATEGORIES = [
  { label: "Category 1", value: "XX" },
  { label: "Category 2", value: "XX" },
  { label: "Category 3", value: "XX" },
];

export default function AllCoursesAnalyticsPage() {
  return (
    <div className="w-full space-y-6 p-4 pb-10 md:p-6">
      <AnalyticsTopBar onExport={() => console.log("Exporting Courses...")} />
      
      <AnalyticsStatsRow stats={COURSE_STATS} />

      <div className="grid grid-cols-1 gap-y-6 md:grid-cols-[1fr,1px,1fr] md:gap-x-12">
        <div className="flex flex-col gap-4">
          <h2 className="border-b border-[#E2E8F0] pb-2 font-inter text-[20px] font-semibold leading-[32px] text-[#020618]">
            Student Statistics
          </h2>
          <AnalyticsStudentStats />
        </div>

        <div className="hidden bg-[#E2E8F0] md:block" />

        <div className="flex flex-col gap-4">
          <h2 className="border-b border-[#E2E8F0] pb-2 font-inter text-[20px] font-semibold leading-[32px] text-[#020618]">
            Enrollment by District
          </h2>
          <AnalyticsEnrollmentByDistrict />
        </div>
      </div>

      <AnalyticsBreakdown
        title="Course wise Breakdown"
        column1Title="By Language"
        column1Items={BY_LANGUAGE}
        column2Title="Category"
        column2Items={CATEGORIES}
      />
    </div>
  );
}
