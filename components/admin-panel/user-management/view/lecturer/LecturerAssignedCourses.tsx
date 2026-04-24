"use client";

import React, { useState } from "react";

import { format } from "date-fns";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import type { LecturerAssignedCourse } from "@/hooks/api/lecturers/useGetLecturerById";

interface CourseRow {
  id: string;
  assignedDate: string;
  courseCategory: string;
  courseTitle: string;
  duration: string;
  courseFee: string;
  noOfEnrollments: string;
}

interface LecturerAssignedCoursesProps {
  courses: LecturerAssignedCourse[];
  isLoading?: boolean;
}

export function LecturerAssignedCourses({ courses, isLoading = false }: LecturerAssignedCoursesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const data: CourseRow[] = courses.map((c) => ({
    id: c.id,
    assignedDate: c.created_at ? format(new Date(c.created_at), "yyyy/MM/dd") : "—",
    courseCategory: c.category_name ?? "—",
    courseTitle: c.name,
    duration: c.lesson_duration ?? "—",
    courseFee: `LKR ${Number(c.base_price).toFixed(2)}`,
    noOfEnrollments: String(c.enrollment_count),
  }));

  const totalCount = data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: Column<CourseRow>[] = [
    {
      header: "Assigned Date",
      accessorKey: "assignedDate",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.assignedDate}</div>,
    },
    {
      header: "Course Category",
      accessorKey: "courseCategory",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.courseCategory}</div>,
    },
    {
      header: "Course Title",
      accessorKey: "courseTitle",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C] line-clamp-2 break-words">{item.courseTitle}</div>,
    },
    {
      header: "Duration",
      accessorKey: "duration",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.duration}</div>,
    },
    {
      header: "Course Fee",
      accessorKey: "courseFee",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.courseFee}</div>,
    },
    {
      header: "No of Enrollments",
      accessorKey: "noOfEnrollments",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.noOfEnrollments}</div>,
    },
  ];

  return (
    <div className="flex flex-col">
      <h2 className="font-inter text-[18px] font-semibold leading-[30px] text-[#0F172B]">
        Assigned Course
      </h2>

      <div className="mt-[8px] w-full max-w-full overflow-hidden">
        <DataTable
          data={paginatedData}
          columns={columns}
          keyExtractor={(item) => item.id}
          showCheckboxes={false}
          isLoading={isLoading}
          tableContainerClassName="h-auto"
          pagination={{
            variant: "simple",
            totalCount,
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
}
