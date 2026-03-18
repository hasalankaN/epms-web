"use client";

import React from "react";

import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { AUTH_INPUT, BUTTON_STYLES, AUTH_TYPOGRAPHY } from "@/lib/constants/theme";

// ===== TYPES =====

interface TransactionItem {
  id: string;
  date: string;
  description: string;
  batchCourseProduct: string;
  amount: string;
}

interface TransactionReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactionSource: string;
  openingCash: string;
  incomeItems: TransactionItem[];
  incomeTotal: string;
  expenseItems: TransactionItem[];
  expenseTotal: string;
  balance: string;
}

// ===== INNER TABLE COMPONENT =====

function ReportTable({ 
  items,
  totalAmount,
  totalBgClass
}: { 
  items: TransactionItem[];
  totalAmount: string;
  totalBgClass: string;
}) {
  return (
    <>
      {/* Desktop/Tablet Table */}
      <div className="hidden sm:block overflow-hidden rounded-[8px] border border-[#E2E8F0]">
        <Table className="min-w-full">
          <TableHeader className="bg-pink-50">
            <TableRow className="border-none hover:bg-pink-50">
              <TableHead className="py-3 pl-4 pr-2 text-[13px] font-semibold text-[#1D293D] w-[100px]">Date</TableHead>
              <TableHead className="py-3 px-2 text-[13px] font-semibold text-[#1D293D] w-[140px]">Description</TableHead>
              <TableHead className="py-3 px-2 text-[13px] font-semibold text-[#1D293D]">Batch/Course/Product</TableHead>
              <TableHead className="py-3 pl-2 pr-4 text-[13px] font-semibold text-[#1D293D] text-right w-[110px]">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="border-b border-[#F1F5F9] last:border-none hover:bg-transparent">
                <TableCell className="py-3 pl-4 pr-2 text-[12px] font-medium text-[#45556C] whitespace-nowrap">{item.date}</TableCell>
                <TableCell className="py-3 px-2 text-[12px] font-medium text-[#45556C]">{item.description}</TableCell>
                <TableCell className="py-3 px-2 text-[12px] font-medium text-[#45556C]">{item.batchCourseProduct}</TableCell>
                <TableCell className="py-3 pl-2 pr-4 text-[12px] font-medium text-[#45556C] text-right whitespace-nowrap">{item.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className={totalBgClass}>
            <TableRow className="border-t border-[#E2E8F0] hover:bg-transparent h-14">
              <TableCell colSpan={3} className="py-3 px-4 text-base font-semibold leading-6 text-[#45556C]">Total</TableCell>
              <TableCell className="py-3 pl-2 pr-4 text-base font-semibold leading-6 text-[#45556C] text-right whitespace-nowrap">{totalAmount}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {/* Mobile Card List */}
      <div className="flex flex-col gap-2 sm:hidden">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-2 rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-[#64748B]">{item.date}</span>
              <span className="text-[12px] font-semibold text-[#1D293D]">{item.amount}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[12px] font-medium text-[#45556C] line-clamp-2">{item.description}</span>
              <span className="text-[10px] font-medium text-[#94A3B8]">{item.batchCourseProduct}</span>
            </div>
          </div>
        ))}
        {/* Mobile Total Card */}
        <div className={cn("flex items-center justify-between rounded-lg border border-[#E2E8F0] p-4 shadow-sm", totalBgClass)}>
          <span className="text-base font-semibold text-[#45556C]">Total</span>
          <span className="text-base font-semibold text-[#45556C]">{totalAmount}</span>
        </div>
      </div>
    </>
  );
}


// ===== MAIN MODAL =====

export function TransactionReportModal({
  isOpen,
  onClose,
  transactionSource,
  openingCash,
  incomeItems,
  incomeTotal,
  expenseItems,
  expenseTotal,
  balance,
}: TransactionReportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        animateChildren={true}
        className="flex max-h-[90vh] w-[95%] max-w-[704px] flex-col gap-0 overflow-hidden rounded-[12px] border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
      >
        {/* ===== HEADER ===== */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 px-6 py-5 shrink-0"
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              Transaction Report
            </DialogTitle>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </motion.div>

        {/* ===== BODY (Scrollable) ===== */}
        <motion.div
          variants={itemVariants}
          className="flex-1 overflow-y-auto px-6 pb-2 custom-scrollbar"
        >
          <div className="flex flex-col gap-3">

            {/* Opening Cash – 16px from header separator already provided by padding above */}
            <div className="space-y-1.5 mt-1">
              <p className={cn(AUTH_TYPOGRAPHY.label, "text-sm font-medium text-[#1D293D] leading-5")}>
                Opening Cash
              </p>
              <div className="relative">
                <Input
                  value={openingCash}
                  readOnly
                  className={cn(
                    AUTH_INPUT.base,
                    "pr-14 bg-white text-[#1D293D]"
                  )}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                  <span className="text-sm font-semibold text-[#1D293D]">LKR</span>
                </div>
              </div>
            </div>

            {/* Income Section – 12px gap */}
            <div className="flex flex-col gap-3 mt-[12px]">
              <p className="text-[14px] font-medium leading-[20px] text-[#1D293D]">
                Income
              </p>

              <ReportTable 
                items={incomeItems} 
                totalAmount={incomeTotal}
                totalBgClass="bg-[#DFFFF0]" 
              />
            </div>

            {/* Expenses Section – 12px gap */}
            <div className="flex flex-col gap-3 mt-[12px]">
              <p className="text-[14px] font-medium leading-[20px] text-[#1D293D]">
                Expenses
              </p>

              <ReportTable 
                items={expenseItems} 
                totalAmount={expenseTotal}
                totalBgClass="bg-[#FFDEDE]" 
              />
            </div>

            {/* Separator – 12px gap before and after */}
            <div className="h-[1px] bg-[#E2E8F0] mt-[12px] mb-[12px]" />

            {/* Balance Row */}
            <div
              className="flex h-14 items-center justify-between rounded-[4px] border-b border-[#E2E8F0] bg-[#F1F5F9] px-4"
            >
              <span className="text-base font-semibold leading-6 text-[#0F172B]">
                Balance
              </span>
              <span className="text-base font-semibold leading-6 text-[#0F172B]">
                {balance}
              </span>
            </div>

          </div>
        </motion.div>

        {/* ===== FOOTER ===== */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E2E8F0] shrink-0 mt-[12px]"
        >
          <Button
            type="button"
            onClick={() => console.log("Export CSV for", transactionSource)}
            className={cn(
              BUTTON_STYLES.primary.md,
              "w-auto px-6 text-sm font-semibold text-white"
            )}
          >
            Export CSV
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
