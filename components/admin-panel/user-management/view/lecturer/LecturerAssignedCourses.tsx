"use client";

import React, { useState } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

interface AssignedCourse {
  id: string;
  assignedDate: string;
  courseCategory: string;
  courseTitle: string;
  duration: string;
  courseFee: string;
  noOfEnrollments: string;
}

const MOCK_DATA: AssignedCourse[] = [
  {
    id: "1",
    assignedDate: "2025/01/21",
    courseCategory: "lorem",
    courseTitle: "Lorem Ipsum",
    duration: "24 Weeks",
    courseFee: "XXXX.00",
    noOfEnrollments: "300",
  },
  {
    id: "2",
    assignedDate: "2025/01/21",
    courseCategory: "lorem",
    courseTitle: "Lorem Ipsum",
    duration: "24 Weeks",
    courseFee: "XXXX.00",
    noOfEnrollments: "300",
  },
];

export function LecturerAssignedCourses() {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalCount = MOCK_DATA.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paginatedData = MOCK_DATA.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: Column<AssignedCourse>[] = [
    {
      header: "Assigned Date",
      accessorKey: "assignedDate",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.assignedDate}</div>,
    },
    {
      header: "Course Category",
      accessorKey: "courseCategory",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.courseCategory}</div>,
    },
    {
      header: "Course Title",
      accessorKey: "courseTitle",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.courseTitle}</div>,
    },
    {
      header: "Duration",
      accessorKey: "duration",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.duration}</div>,
    },
    {
      header: "Course Fee",
      accessorKey: "courseFee",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.courseFee}</div>,
    },
    {
      header: "No of Enrollments",
      accessorKey: "noOfEnrollments",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
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
          tableContainerClassName="h-auto"
          pagination={{
            variant: "simple",
            totalCount: totalCount,
            currentPage: currentPage,
            totalPages: totalPages,
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
}
