"use client";

import React, { useState } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

interface ReferralDetail {
  id: string;
  receivedDate: string;
  inquiryId: string;
  studentName: string;
  inquiredOn: string;
  completedDate: string;
}

const MOCK_DATA: ReferralDetail[] = [
  {
    id: "1",
    receivedDate: "2026/01/21",
    inquiryId: "#12334",
    studentName: "Lorem Ipsum",
    inquiredOn: "Course Nme",
    completedDate: "2026/01/25",
  },
  {
    id: "2",
    receivedDate: "2026/01/21",
    inquiryId: "#12334",
    studentName: "Lorem Ipsum",
    inquiredOn: "Batch Name",
    completedDate: "2026/01/25",
  },
];

export function StaffReferralDetails() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalCount = MOCK_DATA.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paginatedData = MOCK_DATA.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: Column<ReferralDetail>[] = [
    {
      header: "Received Date",
      accessorKey: "receivedDate",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[150px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.receivedDate}</div>,
    },
    {
      header: "Inquiry Id",
      accessorKey: "inquiryId",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.inquiryId}</div>,
    },
    {
      header: "Student Name",
      accessorKey: "studentName",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.studentName}</div>,
    },
    {
      header: "Inquired On",
      accessorKey: "inquiredOn",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.inquiredOn}</div>,
    },
    {
      header: "Completed Date",
      accessorKey: "completedDate",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.completedDate}</div>,
    },
  ];

  return (
    <div className="flex flex-col">
      <h2 className="font-inter text-[18px] font-semibold leading-[30px] text-[#0F172B]">
        Referral Details
      </h2>
      
      <div className="mt-4 flex flex-col md:flex-row gap-4 w-full">
        {/* Total Accumulated Commissions */}
        <div 
          className="flex flex-col justify-center items-center gap-2 flex-1 rounded-[8px] py-6 min-w-0"
          style={{
            border: "1px solid #FFCFEA",
            background: "linear-gradient(315deg, #FFCFEA 0.35%, #F8FAFC 99.65%)",
            boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)"
          }}
        >
          <div className="text-[#314158] text-center font-inter text-[14px] font-normal leading-[20px] whitespace-normal break-words max-w-[160px]">
            Total Accumulated Commissions
          </div>
          <div className="text-[#0F172B] text-center font-inter text-[18px] font-semibold leading-[30px]">
            LKR XXXX.00
          </div>
        </div>

        {/* Amount Paid */}
        <div 
          className="flex flex-col justify-center items-center gap-2 flex-1 rounded-[8px] border border-[#E2E8F0] py-6 min-w-0"
        >
          <div className="text-[#314158] text-center font-inter text-[14px] font-normal leading-[20px] whitespace-normal break-words">
            Amount Paid
          </div>
          <div className="text-[#0F172B] text-center font-inter text-[18px] font-semibold leading-[30px]">
            LKR XXXX.00
          </div>
        </div>

        {/* Balance Payment Card */}
        <div 
          className="flex flex-col justify-center items-center gap-2 flex-1 rounded-[8px] border border-[#E2E8F0] py-6 min-w-0"
        >
          <div className="text-[#314158] text-center font-inter text-[14px] font-normal leading-[20px] whitespace-normal break-words">
            Balance Payment
          </div>
          <div className="text-[#0F172B] text-center font-inter text-[18px] font-semibold leading-[30px]">
            LKR XXXX.00
          </div>
        </div>
      </div>

      <div className="mt-4 w-full max-w-full overflow-hidden">
        <DataTable
          data={paginatedData}
          columns={columns}
          keyExtractor={(item) => item.id}
          showCheckboxes={true}
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
