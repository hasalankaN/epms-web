"use client";

import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CERTIFICATES_DATA = [
  {
    id: "free",
    description: "Free Certificate",
    amount: "Free",
  },
  {
    id: "uk",
    description: "UK Certificate",
    amount: "500.00",
  },
];

export function CourseAllocatedCertificates() {
  return (
    <div className="border border-[#E4E4E7] rounded-lg bg-white shadow-sm overflow-hidden flex flex-col w-full">
      <Table className="min-w-[500px]">
        <TableHeader className="bg-pink-50">
          <TableRow className="border-none hover:bg-pink-50">
            <TableHead className="text-sm font-semibold text-[#1D293D] font-inter pl-6 py-2 h-auto w-auto">
              Description
            </TableHead>
            <TableHead className="w-[152px] text-sm font-semibold text-[#1D293D] font-inter text-right pr-6 py-2 h-auto shrink-0">
              Amount (LKR)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {CERTIFICATES_DATA.map((item) => (
            <TableRow key={item.id} className="border-b border-[#F1F5F9] last:border-none hover:bg-transparent">
              <TableCell className="text-[#45556C] text-sm font-normal font-inter leading-5 break-all px-6 py-3">
                {item.description}
              </TableCell>
              <TableCell className="w-[152px] shrink-0 text-right px-6 py-3 align-middle">
                <span className="inline-flex items-center justify-center rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                  {item.amount}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
