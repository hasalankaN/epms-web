"use client";

import React, { useState } from "react";

import { format } from "date-fns";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

interface CommissionRow {
  id: string;
  source_type: string;
  commission_type: string;
  amount_snapshot: string;
  status: string;
  created_at: string;
  paid_at: string | null;
}

interface CommissionsSummary {
  total_commissions: string;
  amount_paid: string;
  balance_payment: string;
}

interface EnquiryRow {
  id: string;
  created_at: string;
  student_name?: string;
  inquired_on?: string;
  completed_at?: string;
  status?: string;
}

interface ReferralDetail {
  id: string;
  receivedDate: string;
  inquiryId: string;
  studentName: string;
  inquiredOn: string;
  completedDate: string;
}

interface StaffReferralDetailsProps {
  commissions?: CommissionRow[];
  commissionsSummary?: CommissionsSummary;
  enquiries?: EnquiryRow[];
  isLoading?: boolean;
}

export function StaffReferralDetails({
  commissionsSummary,
  enquiries = [],
  isLoading = false,
}: StaffReferralDetailsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const data: ReferralDetail[] = enquiries.map((e) => ({
    id: e.id,
    receivedDate: e.created_at
      ? format(new Date(e.created_at), "yyyy/MM/dd")
      : "—",
    inquiryId: `#${e.id.split("-")[0].toUpperCase()}`,
    studentName: e.student_name ?? "—",
    inquiredOn: e.inquired_on ?? "—",
    completedDate: e.completed_at
      ? format(new Date(e.completed_at), "yyyy/MM/dd")
      : "—",
  }));

  const totalCount = data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const fmt = (val?: string) =>
    val ? `LKR ${Number(val).toFixed(2)}` : "LKR 0.00";

  const columns: Column<ReferralDetail>[] = [
    {
      header: "Received Date",
      accessorKey: "receivedDate",
      className:
        "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap w-[150px]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C]">
          {item.receivedDate}
        </div>
      ),
    },
    {
      header: "Inquiry Id",
      accessorKey: "inquiryId",
      className:
        "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C]">
          {item.inquiryId}
        </div>
      ),
    },
    {
      header: "Student Name",
      accessorKey: "studentName",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C] line-clamp-2 break-words">
          {item.studentName}
        </div>
      ),
    },
    {
      header: "Inquired On",
      accessorKey: "inquiredOn",
      className: "px-4 py-3 text-[13px] font-semibold text-[#1D293D]",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C]">
          {item.inquiredOn}
        </div>
      ),
    },
    {
      header: "Completed Date",
      accessorKey: "completedDate",
      className:
        "px-4 py-3 text-[13px] font-semibold text-[#1D293D] whitespace-nowrap",
      cell: (item) => (
        <div className="text-[12px] font-medium text-[#45556C]">
          {item.completedDate}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col">
      <h2 className="font-inter text-[18px] font-semibold leading-[30px] text-[#0F172B]">
        Referral Details
      </h2>

      <div className="mt-4 flex flex-col md:flex-row gap-4 w-full">
        <div
          className="flex flex-col justify-center items-center gap-2 flex-1 rounded-[8px] py-6 min-w-0"
          style={{
            border: "1px solid #FFCFEA",
            background:
              "linear-gradient(315deg, #FFCFEA 0.35%, #F8FAFC 99.65%)",
            boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
          }}
        >
          <div className="text-[#314158] text-center font-inter text-[14px] font-normal leading-[20px] whitespace-normal break-words max-w-[160px]">
            Total Accumulated Commissions
          </div>
          <div className="text-[#0F172B] text-center font-inter text-[18px] font-semibold leading-[30px]">
            {fmt(commissionsSummary?.total_commissions)}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-2 flex-1 rounded-[8px] border border-[#E2E8F0] py-6 min-w-0">
          <div className="text-[#314158] text-center font-inter text-[14px] font-normal leading-[20px]">
            Amount Paid
          </div>
          <div className="text-[#0F172B] text-center font-inter text-[18px] font-semibold leading-[30px]">
            {fmt(commissionsSummary?.amount_paid)}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center gap-2 flex-1 rounded-[8px] border border-[#E2E8F0] py-6 min-w-0">
          <div className="text-[#314158] text-center font-inter text-[14px] font-normal leading-[20px]">
            Balance Payment
          </div>
          <div className="text-[#0F172B] text-center font-inter text-[18px] font-semibold leading-[30px]">
            {fmt(commissionsSummary?.balance_payment)}
          </div>
        </div>
      </div>

      <div className="mt-4 w-full max-w-full overflow-hidden">
        <DataTable
          data={paginatedData}
          columns={columns}
          keyExtractor={(item) => item.id}
          showCheckboxes={true}
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
