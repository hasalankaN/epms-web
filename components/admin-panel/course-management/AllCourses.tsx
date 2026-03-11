"use client";

import React, { useState, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import type { CourseDataType, CourseStatus } from "@/types/course";

import { CourseStatsRow } from "./views/Courses/CourseStatsRow";
import { CourseTableToolbar } from "./views/Courses/CourseTableToolbar";
import { CourseTable } from "./views/Courses/CourseTable";

// ===== MOCK DATA =====
const mockCourses: CourseDataType[] = Array.from({ length: 100 }, (_, i) => ({
  id: `course-${i + 1}`,
  courseId: `#${String(i + 1).padStart(6, "0")}`,
  courseName: "Marketing",
  courseCategory: i % 4 === 0 ? "Category 1" : i % 4 === 1 ? "Category 2" : i % 4 === 2 ? "Category 3" : "Business St...",
  totalEnroll: 100,
  courseLevel: i % 3 === 0 ? "Beginner" : i % 3 === 1 ? "Intermediate" : "Advanced",
  courseType: "Type",
  language: i % 3 === 0 ? "English" : i % 3 === 1 ? "Sinhala" : "Tamil",
  staff: "Ruwan, Kasun",
  lecturer: "Guhanathan",
  status: (["Active", "Inactive"] as CourseStatus[])[i % 2],
  lastUpdate: "20/04/2026",
}));

export function AllCourses() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ===== URL STATE =====
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  // ===== SHARED STATE =====
  const [data] = useState<CourseDataType[]>(mockCourses);
  const [rowSelection, setRowSelection] = useState<{ [key: string]: boolean }>({});

  // ===== DERIVED VALUES =====

  // ===== HANDLERS =====
  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, pathname, router]);

  return (
    <div className="flex flex-col gap-4">
      {/* Stats Row */}
      <CourseStatsRow />

      {/* Separator Line (24px below) */}
      <div className="mt-4 h-[1px] w-full bg-[#E2E8F0]" />

      {/* Table Toolbar (24px below separator) */}
      <div className="mt-4">
        <CourseTableToolbar />
      </div>

      {/* Course Table (16px below toolbar) */}
      <div className="mt-4">
        <CourseTable
          data={data}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
    </div>
  );
}
