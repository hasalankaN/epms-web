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

const PAYMENT_ITEMS = [
  {
    id: "reg",
    description: "Registration Fee",
    amount: "1000.00",
    isAdditional: false,
  },
  {
    id: "course",
    description: "Course Fee",
    amount: "5000.00",
    isAdditional: false,
  },
  {
    id: "uk",
    description: "UK Certificate Fee",
    amount: "500.00",
    isAdditional: true,
  },
  {
    id: "exam",
    description: "Exam Fee",
    amount: "2000.00",
    isAdditional: true,
  },
];

export function CourseFeeTypesTable() {
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
          {PAYMENT_ITEMS.map((item) => (
            <TableRow key={item.id} className="border-b border-[#F1F5F9] last:border-none hover:bg-transparent">
              <TableCell 
                className="text-[14px] font-normal font-inter leading-[20px] text-[#90A1B9] overflow-hidden text-ellipsis whitespace-nowrap px-6 py-4"
              >
                {item.description}
              </TableCell>
              <TableCell 
                className="w-[152px] shrink-0 text-[14px] font-normal font-inter leading-[20px] text-[#90A1B9] text-right align-middle px-6 py-4"
              >
                {item.amount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
