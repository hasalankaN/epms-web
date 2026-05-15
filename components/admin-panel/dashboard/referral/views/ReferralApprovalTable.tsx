"use client";

import React from "react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";

export interface ReferralApprovalRow {
  id: string;
  date: string;
  batchName: string;
  studentName: string;
  amount: string;
  referralMember: string;
  commissionRate: string;
  commissionAccumulated: string;
}

const columns: Column<ReferralApprovalRow>[] = [
  {
    header: "Date",
    accessorKey: "date",
    className: "px-2 py-2 w-[80px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.date}
      </div>
    ),
  },
  {
    header: "Batch Name",
    accessorKey: "batchName",
    className: "px-2 py-2 w-[150px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.batchName}
      </div>
    ),
  },
  {
    header: "Student Name",
    accessorKey: "studentName",
    className: "px-2 py-2 w-[150px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.studentName}
      </div>
    ),
  },
  {
    header: "Amount",
    accessorKey: "amount",
    className: "px-2 py-2 w-[100px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap">
        {item.amount}
      </div>
    ),
  },
  {
    header: "Referral Member",
    accessorKey: "referralMember",
    className: "px-2 py-2 w-[200px] whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap w-[180px]">
        {item.referralMember}
      </div>
    ),
  },
  {
    header: "Commission Rate",
    accessorKey: "commissionRate",
    className: "px-2 py-2 w-[120px] text-center whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap text-center">
        {item.commissionRate}
      </div>
    ),
  },
  {
    header: "Commission Accumulated",
    accessorKey: "commissionAccumulated",
    className: "px-2 py-2 w-[180px] text-center whitespace-nowrap",
    cell: (item) => (
      <div className="text-[12px] font-medium text-[#45556C] whitespace-nowrap text-center">
        {item.commissionAccumulated}
      </div>
    ),
  },
];

interface Props {
  data?: ReferralApprovalRow[];
}

export function ReferralApprovalTable({ data }: Props) {
  const getRowClassName = (item: ReferralApprovalRow) => {
    if (item.referralMember.startsWith("Student Referral")) {
      return "border-b border-[#E7E5E4] bg-[#D9E9FF] hover:bg-[#D9E9FF]";
    }

    if (item.referralMember.startsWith("Agent Referral")) {
      return "border-b border-[#E7E5E4] bg-[#FFF7D7] hover:bg-[#FFF7D7]";
    }

    return "border-b border-[#E7E5E4] bg-white hover:bg-[#FFF9FC]";
  };

  return (
    <div className="mt-[10px] w-full rounded-lg border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
      <DataTable
        data={data ?? []}
        columns={columns}
        keyExtractor={(item) => item.id}
        showCheckboxes={false}
        rowClassName={getRowClassName}
        hideBorder={true}
        tableContainerClassName="h-auto"
      />
      <div className="flex w-full items-center justify-center border-t border-[#E2E8F0] bg-white py-4 px-2">
        <span className="text-[14px] font-normal leading-[20px] text-[#6B7280] font-sans">
          View of first 5 Row
        </span>
      </div>
    </div>
  );
}
