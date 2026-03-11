"use client";

import React, { useState } from "react";

import { Plus } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AddPaymentModal } from "./AddPaymentModal";

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

export function BatchPaymentsTable() {
  const totalAmount = "7500.00";
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="border border-[#E4E4E7] rounded-lg bg-white shadow-sm overflow-hidden flex flex-col w-full">
        <Table className="min-w-[500px]">
          <TableHeader className="bg-pink-50">
            <TableRow className="border-none hover:bg-pink-50">
              <TableHead className="text-sm font-semibold text-[#1D293D] font-inter pl-6 py-2 h-auto w-auto">
                Description
              </TableHead>
              <TableHead className="w-[152px] text-sm font-semibold text-[#1D293D] font-inter text-right pr-6 py-2 h-auto shrink-0">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {PAYMENT_ITEMS.map((item) => (
              <TableRow key={item.id} className="border-b border-[#F1F5F9] last:border-none hover:bg-transparent">
                <TableCell 
                  className={cn(
                    "text-sm font-normal font-inter leading-5 break-all px-6 py-3",
                    item.isAdditional ? "text-[#3b4452]" : "text-[#8a99ad]"
                  )}
                >
                  {item.description}
                </TableCell>
                <TableCell 
                  className={cn(
                    "w-[152px] shrink-0 text-sm font-normal font-inter leading-5 text-right px-6 py-3 align-middle",
                    item.isAdditional ? "text-[#3b4452]" : "text-[#8a99ad]"
                  )}
                >
                  {item.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="border-t-[2px] border-t-[#62748E] bg-[#F8FAFC]">
            <TableRow className="hover:bg-[#F8FAFC] border-none">
              <TableCell className="text-[#334155] text-sm font-semibold font-inter leading-6 px-6 py-3">
                Total Course Fee
              </TableCell>
              <TableCell className="w-[152px] shrink-0 text-[#334155] text-sm font-semibold font-inter leading-6 text-right px-6 py-3">
                {totalAmount}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Add New Payment Button */}
      <div className="mt-2 flex justify-end">
          <button 
            type="button" 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#E2E8F0] bg-transparent px-4 py-2 shadow-sm transition-colors hover:bg-[#F1F5F9] focus:border-[#90A1B9] focus:bg-[#F1F5F9] disabled:border-[#F1F5F9] disabled:bg-[#F1F5F9]"
          >
            <Plus className="h-4 w-4 text-[#0F172B]" />
            <span className="font-inter text-[14px] font-semibold leading-[20px] text-[#0F172B]">
              Add New Payment
            </span>
          </button>
      </div>

      <AddPaymentModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        onSave={(data) => console.log("New Payment:", data)} 
      />
    </>
  );
}
