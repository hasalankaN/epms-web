import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApiCourseFee } from "@/hooks/api/courses/useGetCourseById";

interface CourseFeeTypesTableProps {
  fees?: ApiCourseFee[];
  isLoading?: boolean;
}

export function CourseFeeTypesTable({ fees, isLoading }: CourseFeeTypesTableProps) {
  const displayFees = fees && fees.length > 0 ? fees : [];

  return (
    <div className="border border-[#E4E4E7] rounded-lg bg-white shadow-sm overflow-hidden flex flex-col w-full">
      <Table className="min-w-[500px]">
        <TableHeader className="bg-pink-50">
          <TableRow className="border-none hover:bg-pink-50">
            <TableHead className="text-[14px] font-semibold text-[#1D293D] font-inter pl-6 py-3 h-auto w-auto">
              Description
            </TableHead>
            <TableHead className="w-[152px] text-[14px] font-semibold text-[#1D293D] font-inter text-right pr-6 py-3 h-auto shrink-0">
              Amount (LKR)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i} className="border-b border-[#F1F5F9] last:border-none">
                <TableCell className="px-6 py-4">
                  <Skeleton className="h-5 w-40 rounded" />
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <Skeleton className="h-5 w-20 rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : displayFees.length > 0 ? (
            displayFees.map((fee, idx) => (
              <TableRow
                key={idx}
                className="border-b border-[#F1F5F9] last:border-none hover:bg-transparent"
              >
                <TableCell className="text-[14px] font-inter leading-[20px] text-[#90A1B9] overflow-hidden text-ellipsis whitespace-nowrap px-6 py-4">
                  Course Fee {idx + 1} ({fee.duration_years} Years)
                </TableCell>
                <TableCell className="w-[152px] shrink-0 text-[14px] font-inter leading-[20px] text-[#314158] font-medium text-right align-middle px-6 py-4">
                  {fee.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={2}
                className="h-24 text-center text-[#90A1B9] font-inter"
              >
                No fee details available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
