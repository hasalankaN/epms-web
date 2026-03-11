"use client";

import React, { useState } from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

interface ReferralDetail {
  id: string;
  date: string;
  usedFor: string;
  studentName: string;
  amount: string;
  commissionGained: string;
}

const MOCK_DATA: ReferralDetail[] = [
  {
    id: "1",
    date: "2025/01/21",
    usedFor: "Lorem Ipsum",
    studentName: "Lorem Ipsum",
    amount: "XXXX.00",
    commissionGained: "XXXX.00",
  },
  {
    id: "2",
    date: "2025/01/21",
    usedFor: "Lorem Ipsum",
    studentName: "Lorem Ipsum",
    amount: "XXXX.00",
    commissionGained: "XXXX.00",
  },
];

export function StudentReferralDetails() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalCount = MOCK_DATA.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paginatedData = MOCK_DATA.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: Column<ReferralDetail>[] = [
    {
      header: "Date",
      accessorKey: "date",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis w-[120px]",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.date}</div>,
    },
    {
      header: "Used For",
      accessorKey: "usedFor",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.usedFor}</div>,
    },
    {
      header: "Student Name",
      accessorKey: "studentName",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.studentName}</div>,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.amount}</div>,
    },
    {
      header: "Commission Gained",
      accessorKey: "commissionGained",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap overflow-hidden text-ellipsis",
      cell: (item) => <div className="text-[12px] font-medium text-[#45556C]">{item.commissionGained}</div>,
    },
  ];

  return (
    <div className="flex flex-col">
      <h2 className="font-inter text-[18px] font-semibold leading-[30px] text-[#0F172B]">
        Referral Details
      </h2>
      
      <div className="mt-4 flex flex-col md:flex-row gap-4 w-full">
        {/* Referral Code Card */}
        <div 
          className="flex flex-col justify-center items-center gap-2 flex-1 rounded-[8px] py-6"
          style={{
            border: "1px solid #FFCFEA",
            background: "linear-gradient(315deg, #FFCFEA 0.35%, #F8FAFC 99.65%)",
            boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)"
          }}
        >
          <div className="text-[#314158] text-center font-inter text-[14px] font-normal leading-[20px]">
            Referral Code
          </div>
          <div className="text-[#0F172B] text-center font-inter text-[18px] font-semibold leading-[30px]">
            ####
          </div>
        </div>

        {/* Total Commissions Earned Card */}
        <div 
          className="flex flex-col justify-center items-center gap-2 flex-1 rounded-[8px] border border-[#E2E8F0] py-6"
        >
          <div className="text-[#314158] text-center font-inter text-[14px] font-normal leading-[20px]">
            Total Commissions Earned
          </div>
          <div className="text-[#0F172B] text-center font-inter text-[18px] font-semibold leading-[30px]">
            LKR XXXX.00
          </div>
        </div>

        {/* No of Referrals Card */}
        <div 
          className="flex flex-col justify-center items-center gap-2 flex-1 rounded-[8px] border border-[#E2E8F0] py-6"
        >
          <div className="text-[#314158] text-center font-inter text-[14px] font-normal leading-[20px]">
            No of Referrals
          </div>
          <div className="text-[#0F172B] text-center font-inter text-[18px] font-semibold leading-[30px]">
            40
          </div>
        </div>
      </div>

      <div className="mt-4 w-full max-w-full overflow-hidden">
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
