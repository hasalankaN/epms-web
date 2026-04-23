"use client";

import React, { useState } from "react";
import { format } from "date-fns";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { useGetStaffAssignedCourses } from "@/hooks/api/staff/useGetStaffAssignedCourses";

interface AssignedCourse {
  id: string;
  assignedDate: string;
  courseCategory: string;
  courseTitle: string;
  duration: string;
  courseFee: string;
  noOfEnrollments: string;
}

interface StaffAssignedCoursesProps {
  staffId: string;
}

export function StaffAssignedCourses({ staffId }: StaffAssignedCoursesProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: rawData, isLoading } = useGetStaffAssignedCourses(staffId);

  const data: AssignedCourse[] = (rawData ?? []).map((item) => ({
    id: item.course_id,
    assignedDate: item.course_created_at
      ? format(new Date(item.course_created_at), "yyyy/MM/dd")
      : "—",
    courseCategory: item.category_name ?? "—",
    courseTitle: item.course_name,
    duration: item.lesson_duration ?? "—",
    courseFee: `LKR ${Number(item.base_price).toFixed(2)}`,
    noOfEnrollments: String(item.enrollment_count),
  }));

  const totalCount = data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: Column<AssignedCourse>[] = [
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
