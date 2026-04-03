"use client";

import React, { useState } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { StatusPopover } from "@/components/common/StatusPopover";

interface EnrolledCourse {
  id: string;
  enrolledDate: string;
  courseCategory: string;
  courseTitle: string;
  assignmentStatus: string;
  courseStatus: string;
  certificateStatus: string;
  paymentType: string;
  paymentStatus: string;
}

const MOCK_DATA: EnrolledCourse[] = [
  {
    id: "1",
    enrolledDate: "2025/01/21",
    courseCategory: "lorem",
    courseTitle: "Lorem Ipsum",
    assignmentStatus: "Completed",
    courseStatus: "Completed",
    certificateStatus: "Issued",
    paymentType: "One Time",
    paymentStatus: "Paid",
  },
  {
    id: "2",
    enrolledDate: "2025/01/21",
    courseCategory: "lorem",
    courseTitle: "Lorem Ipsum",
    assignmentStatus: "80% Completed",
    courseStatus: "80% Completed",
    certificateStatus: "Pending",
    paymentType: "Installment",
    paymentStatus: "Pending XXXX.00",
  },
  {
    id: "3",
    enrolledDate: "2025/01/22",
    courseCategory: "lorem",
    courseTitle: "Pending Course",
    assignmentStatus: "10% Completed",
    courseStatus: "0% Completed",
    certificateStatus: "Pending",
    paymentType: "Installment",
    paymentStatus: "Pending XXXX.00",
  },
];

export function MyStudentEnrolledCourses() {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalCount = MOCK_DATA.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paginatedData = MOCK_DATA.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: Column<EnrolledCourse>[] = [
    {
      header: "Enrolled Date",
      accessorKey: "enrolledDate",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.enrolledDate}</div>,
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
      header: () => <div className="text-center w-full">Assignment Status</div>,
      accessorKey: "assignmentStatus",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const isCompleted = item.assignmentStatus === "Completed";
        const isPartial = item.assignmentStatus.includes("% Completed");

        return (
          <div className={`text-[12px] font-inter text-center font-medium leading-[16px] whitespace-nowrap overflow-hidden text-ellipsis ${isCompleted ? "text-[#16A34A]" : isPartial ? "text-[#2563EB]" : "text-[#45556C]"}`}>
            {item.assignmentStatus}
          </div>
        );
      },
    },
    {
      header: () => <div className="text-center w-full">Course Status</div>,
      accessorKey: "courseStatus",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const isCompleted = item.courseStatus === "Completed";
        const isPartial = item.courseStatus.includes("% Completed");

        return (
          <div className={`text-[12px] font-inter text-center font-medium leading-[16px] whitespace-nowrap overflow-hidden text-ellipsis ${isCompleted ? "text-[#16A34A]" : isPartial ? "text-[#2563EB]" : "text-[#45556C]"}`}>
            {item.courseStatus}
          </div>
        );
      },
    },
    {
      header: () => <div className="text-center w-full">Certificate Status</div>,
      accessorKey: "certificateStatus",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const options = [
          { value: "Issued", label: "Issued", bg: "#DFFFF0", text: "#16A34A" },
          { value: "Pending", label: "Pending", bg: "#FFF7D7", text: "#F59E0B" },
        ];

        return (
          <div className="flex justify-center w-full">
            <StatusPopover value={item.certificateStatus} options={options} readOnly />
          </div>
        );
      },
    },
    {
      header: () => <div className="text-center w-full">Payment Type</div>,
      accessorKey: "paymentType",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-center text-[#45556C]">{item.paymentType}</div>,
    },
    {
      header: () => <div className="text-center w-full">Payment Status</div>,
      accessorKey: "paymentStatus",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => {
        const isCompleted = item.paymentStatus === "Paid" || item.paymentStatus === "Completed";

        return (
          <div className={`text-[12px] font-inter font-medium text-center whitespace-nowrap overflow-hidden text-ellipsis leading-[16px] ${isCompleted ? "text-[#16A34A]" : "text-[#FB2C36]"}`}>
            {item.paymentStatus}
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <h2 className="font-inter text-[18px] font-semibold leading-[30px] text-[#0F172B]">
        Enrolled Course
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
