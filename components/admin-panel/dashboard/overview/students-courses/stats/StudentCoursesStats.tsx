"use client";

import React from "react";

import { StudentCourseStatCard } from "./StudentCourseStatCard";

export function StudentCoursesStats() {
  const stats = [
    { title: "Total Inquiries", value: "35,000" },
    { title: "Total Student Enrollments", value: "10,670" },
    { title: "Total Students Count", value: "2340" },
    { title: "Total Lecturers Count", value: "45" },
    { title: "Total Staff Members", value: "75" },
    { title: "Total Products", value: "15" },
    { title: "Total Batches", value: "55" },
    { title: "Total Courses", value: "255" },
  ];

  return (
    <div className="w-full rounded-[8px] border border-[#E2E8F0] bg-transparent">
      {/* Desktop: Flex layout - 8 columns */}
      <div className="hidden items-center justify-between py-3 lg:flex">
        {stats.map((stat, index) => (
          <React.Fragment key={stat.title}>
            <StudentCourseStatCard
              title={stat.title}
              value={stat.value}
              className="flex-1"
            />
            {/* Divider - not after last item */}
            {index < stats.length - 1 && (
              <div className="h-[102px] w-px bg-[#E2E8F0]" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Tablet: Grid layout - 4 columns (2 rows) */}
      <div className="hidden grid-cols-4 md:grid lg:hidden">
        {stats.map((stat, index) => (
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
            <StudentCourseStatCard
              title={stat.title}
              value={stat.value}
            />
          </div>
        ))}
      </div>

      {/* Mobile: Grid layout - 2 columns (4 rows) */}
      <div className="grid grid-cols-2 md:hidden">
        {stats.map((stat, index) => (
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
            <StudentCourseStatCard
              title={stat.title}
              value={stat.value}
            />
          </div>
        ))}
      </div>
    </div>
  );

}
