"use client";

import React from "react";

import { OverviewStats } from "./overview/stats/OverviewStats";
import { FinancialSummary } from "./overview/financial/FinancialSummary";
import { StudentCoursesStats } from "./overview/students-courses/stats/StudentCoursesStats";
import { EnrollmentPieChart } from "./overview/students-courses/charts/EnrollmentPieChart";
import { TrendsChart } from "./overview/students-courses/charts/TrendsChart";
import { CertificatesProgress } from "./overview/students-courses/CertificatesProgress";
import { UpcomingClasses } from "./overview/students-courses/UpcomingClasses";
import { SubmissionOverview } from "./overview/students-courses/SubmissionOverview";

export function OverviewSection() {
  return (
    <div className="flex flex-col gap-4">
      <OverviewStats />
      <FinancialSummary />
      
      {/* Students & Courses Header */}
      <div className="mt-2 w-full border-b border-[#E2E8F0]">
        <h2 className="font-sans text-[20px] font-semibold leading-[32px] text-[#1D293D]">
          Students & Courses
        </h2>
      </div>
      
      {/* Students & Courses Stats */}
      <StudentCoursesStats />
      
      {/* Charts Row - Responsive layout */}
      <div className="flex w-full flex-col gap-4 md:flex-row md:items-stretch">
        <div className="w-full md:w-1/2">
          <EnrollmentPieChart className="h-full" />
        </div>
        <div className="w-full md:w-1/2">
          <TrendsChart className="h-full" />
        </div>
      </div>
      
      {/* Certificates Progress */}
      <CertificatesProgress />
      
      {/* Upcoming Classes & Submission Overview Row */}
      <div className="flex w-full flex-col gap-4 md:flex-row md:items-stretch">
        <div className="w-full md:w-1/3">
          <UpcomingClasses className="h-full" />
        </div>
        <div className="w-full md:w-2/3">
          <SubmissionOverview className="h-full" />
        </div>
      </div>
    </div>
  );
}
