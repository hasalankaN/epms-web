"use client";

import React from "react";

import type { DashboardStudentCourseStats } from "@/hooks/api/dashboard/useGetDashboardOverview";

import { StudentCourseStatCard } from "./StudentCourseStatCard";

interface StudentCoursesStatsProps {
  stats?: DashboardStudentCourseStats;
}

export function StudentCoursesStats({ stats }: StudentCoursesStatsProps) {
  const statItems = [
    {
      title: "Total Inquiries",
      value: stats ? stats.totalInquiries.toLocaleString() : "—",
    },
    {
      title: "Total Student Enrollments",
      value: stats ? stats.totalEnrollments.toLocaleString() : "—",
    },
    {
      title: "Total Students Count",
      value: stats ? stats.totalStudents.toLocaleString() : "—",
    },
    {
      title: "Total Lecturers Count",
      value: stats ? stats.totalLecturers.toLocaleString() : "—",
    },
    {
      title: "Total Staff Members",
      value: stats ? stats.totalStaff.toLocaleString() : "—",
    },
    {
      title: "Total Products",
      value: stats ? stats.totalProducts.toLocaleString() : "—",
    },
    {
      title: "Total Batches",
      value: stats ? stats.totalBatches.toLocaleString() : "—",
    },
    {
      title: "Total Courses",
      value: stats ? stats.totalCourses.toLocaleString() : "—",
    },
  ];

  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop: Flex layout - 8 columns */}
      <div className="hidden items-center justify-between py-3 lg:flex">
        {statItems.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <StudentCourseStatCard
              title={stat.title}
              value={stat.value}
              className="flex-1"
            />
            {/* Divider - not after last item */}
            {index < statItems.length - 1 && (
              <div className="h-[102px] w-px bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tablet: Grid layout - 4 columns (2 rows) */}
      <div className="hidden grid-cols-4 md:grid lg:hidden">
        {statItems.map((stat, index) => (
          <div
            key={stat.title}
            className={`
              py-3
              ${/* Add left border for items not in the first column */ ""}
              ${index % 4 !== 0 ? "border-l border-[#E2E8F0]" : ""}
              ${/* Add top border for items in the second row (index >= 4) */ ""}
              ${index >= 4 ? "border-t border-[#E2E8F0]" : ""}
            `}
          >
            <StudentCourseStatCard title={stat.title} value={stat.value} />
          </div>
        ))}
      </div>

      {/* Mobile: Grid layout - 2 columns (4 rows) */}
      <div className="grid grid-cols-2 md:hidden">
        {statItems.map((stat, index) => (
          <div
            key={stat.title}
            className={`
              py-3
              ${/* Add left border for items in the right column */ ""}
              ${index % 2 !== 0 ? "border-l border-[#E2E8F0]" : ""}
              ${/* Add top border for items not in the first row */ ""}
              ${index >= 2 ? "border-t border-[#E2E8F0]" : ""}
            `}
          >
            <StudentCourseStatCard title={stat.title} value={stat.value} />
          </div>
        ))}
      </div>
    </div>
  );
}
