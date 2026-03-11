"use client";

import React from "react";

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SubmissionData {
  type: string;
  total: number;
  pending: number;
  completed: number;
}

interface SubmissionOverviewProps {
  data?: SubmissionData[];
  className?: string;
}

const defaultData: SubmissionData[] = [
  { type: "Assignment Submissions", total: 1000, pending: 100, completed: 900 },
  { type: "Task Submissions", total: 5000, pending: 1000, completed: 4000 },
  { type: "Complaint Submissions", total: 100, pending: 2, completed: 98 },
];

export function SubmissionOverview({
  data = defaultData,
  className,
}: SubmissionOverviewProps) {
  return (
    <div className={cn("flex flex-col justify-end gap-4", className)}>
      {/* Title */}
      <h3 className="font-sans text-[16px] font-semibold leading-[24px] text-[#1D293D]">
        Submission Overview
      </h3>

      {/* Table */}
      <div className="overflow-hidden rounded-[8px] border border-[#E4E4E7] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
        <Table>
          <TableHeader>
            <TableRow className="h-10 border-b border-[#E7E7EB] bg-[#FDF2F8] hover:bg-[#FDF2F8]">
              <TableHead className="flex-1 px-6 py-2 text-center font-sans text-[14px] font-semibold leading-[20px] text-[#1D293D]">
                Submission Type
              </TableHead>
              <TableHead className="flex-1 px-6 py-2 text-center font-sans text-[14px] font-semibold leading-[20px] text-[#1D293D]">
                Total
              </TableHead>
              <TableHead className="flex-1 px-6 py-2 text-center font-sans text-[14px] font-semibold leading-[20px] text-[#1D293D]">
                Pending
              </TableHead>
              <TableHead className="flex-1 px-6 py-2 text-center font-sans text-[14px] font-semibold leading-[20px] text-[#1D293D]">
                Completed
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.type}
                className="border-b border-[#E2E8F0] hover:bg-transparent"
              >
                <TableCell className="flex-1 px-6 py-2 text-center font-sans text-[14px] font-normal leading-[20px] text-[#45556C]">
                  {row.type}
                </TableCell>
                <TableCell className="flex-1 px-6 py-2 text-center font-sans text-[14px] font-normal leading-[20px] text-[#45556C]">
                  {row.total.toLocaleString()}
                </TableCell>
                <TableCell className="flex-1 px-6 py-2 text-center font-sans text-[14px] font-normal leading-[20px] text-[#45556C]">
                  {row.pending.toLocaleString()}
                </TableCell>
                <TableCell className="flex-1 px-6 py-2 text-center font-sans text-[14px] font-normal leading-[20px] text-[#45556C]">
                  {row.completed.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
