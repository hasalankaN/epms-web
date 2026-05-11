"use client";

import React, { useState } from "react";

import { CoursesAndBatchesToolbar } from "./CoursesAndBatchesToolbar";
import { CoursesTable } from "./CoursesTable";
import type { ReferralCourseDataType } from "@/types/referral-products";

const mockCourses: ReferralCourseDataType[] = Array.from({ length: 15 }, (_, i) => ({
  id: `course-${i + 1}`,
  courseId: "#000001",
  courseName: "Lorem Ipsum",
  category: "Online",
  level: (["Beginner", "Intermediate", "Advanced"] as const)[i % 3],
  type: "Diploma",
  subject: "Subject",
  price: "LKR XXXX.00",
  directCommissionRate: "LKR XXXX.00",
  teamCommissionRate: "LKR XXXX.00",
  status: (["Upcoming", "Active", "Inactive", "Completed"] as const)[i % 4],
}));

export function CoursesTabContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedData = mockCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      <CoursesAndBatchesToolbar 
        placeholder="Search by Courses Name/ID, Course category..." 
        onSearch={(val) => console.log("Searching courses:", val)}
      />
      <CoursesTable
        data={paginatedData}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalResults={mockCourses.length}
      />
    </div>
  );
}
