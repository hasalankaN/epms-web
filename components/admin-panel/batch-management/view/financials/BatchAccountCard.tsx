"use client";

import React, { useState } from "react";

import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

interface PayOutItem {
  label: string;
  amount: string;
}

interface BatchAccountCardProps {
  totalPayments?: string;
  referralCommissions?: string;
  discounts?: string;
  payOuts?: PayOutItem[];
  totalProfit?: string;
  className?: string;
}

export function BatchAccountCard({
  totalPayments = "+LKR XXXX.00",
  referralCommissions = "-LKR XXXX.00",
  discounts = "-LKR XXXX.00",
  payOuts = [
    { label: "Note Preparations", amount: "-LKR XXXX.00" },
    { label: "Exam Expenses", amount: "-LKR XXXX.00" },
    { label: "Expense Type 01", amount: "-LKR XXXX.00" },
  ],
  totalProfit = "XXXX.00",
  className,
}: BatchAccountCardProps) {
  const [isPayOutsOpen, setIsPayOutsOpen] = useState(true);

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 sm:gap-4 rounded-lg border border-[#E2E8F0] bg-transparent p-4 sm:p-6 shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] w-full",
        className
      )}
    >
      {/* Title */}
      <h3 className="font-inter text-[14px] sm:text-[16px] font-semibold leading-[20px] sm:leading-[24px] text-[#0F172B]">
        Batch Account
      </h3>

      {/* Line Items Container */}
      <div className="flex flex-col w-full gap-3 sm:gap-4">
        {/* Total Payments */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-2 sm:px-4 py-3 sm:py-4">
          <span className="font-inter text-[14px] sm:text-[16px] font-medium leading-[20px] sm:leading-[24px] text-[#1D293D]">
            Total Payments
          </span>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="font-inter text-[14px] sm:text-[16px] font-medium leading-[20px] sm:leading-[24px] text-[#16A34A] text-right">
              {totalPayments}
            </span>
            <ChevronDown className="h-4 w-4 text-[#ffffff]" />
          </div>
        </div>

        {/* Referral Commissions */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-2 sm:px-4 py-3 sm:py-4">
          <span className="font-inter text-[14px] sm:text-[16px] font-medium leading-[20px] sm:leading-[24px] text-[#1D293D]">
            Referral Commissions
          </span>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="font-inter text-[14px] sm:text-[16px] font-medium leading-[20px] sm:leading-[24px] text-[#FB2C36] text-right">
              {referralCommissions}
            </span>
            <ChevronDown className="h-4 w-4 text-[#ffffff]" />
          </div>
        </div>

        {/* Discounts */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-2 sm:px-4 py-3 sm:py-4">
          <span className="font-inter text-[14px] sm:text-[16px] font-medium leading-[20px] sm:leading-[24px] text-[#1D293D]">
            Discounts
          </span>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="font-inter text-[14px] sm:text-[16px] font-medium leading-[20px] sm:leading-[24px] text-[#FB2C36] text-right">
              {discounts}
            </span>
            <ChevronDown className="h-4 w-4 text-[#ffffff]" />
          </div>
        </div>

        {/* Pay Outs (Expenses) - Expandable */}
        <div className="flex flex-col border-b border-[#E2E8F0]">
          <div 
            className="flex items-center justify-between px-2 sm:px-4 py-3 sm:py-4 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setIsPayOutsOpen(!isPayOutsOpen)}
          >
            <span className="font-inter text-[14px] sm:text-[16px] font-medium leading-[20px] sm:leading-[24px] text-[#1D293D]">
              Pay Outs (Expenses)
            </span>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="font-inter text-[14px] sm:text-[16px] font-medium leading-[20px] sm:leading-[24px] text-[#FB2C36] text-right">
                -LKR XXXX.00
              </span>
              <motion.div
                animate={{ rotate: isPayOutsOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-[#90A1B9]" />
              </motion.div>
            </div>
          </div>
          
          {/* Expanded Items with Animation */}
          <AnimatePresence initial={false}>
            {isPayOutsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-2 pb-3 sm:pb-4">
                  {payOuts.map((item, index) => (
                    <div key={index} className="flex items-center justify-between px-2 sm:px-4 pl-6 sm:pl-[47px] py-[2px]">
                      <span className="font-inter text-[14px] font-normal leading-[20px] text-[#45556C]">
                        {item.label}
                      </span>
                      <span className="font-inter text-[14px] font-normal leading-[20px] text-[#45556C]">
                        {item.amount}
                      </span>
                    </div>
                  ))}
                  <div className="h-0" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Total Profit Footer */}
        <div 
          className="flex h-[44px] sm:h-[52px] w-full items-center justify-between gap-2 sm:gap-4 rounded-[4px] px-3 sm:px-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
          style={{ background: "linear-gradient(315deg, #FFCFEA 0.35%, #F8FAFC 99.65%)" }}
        >
          <span className="font-inter text-[16px] sm:text-[18px] font-semibold leading-[24px] sm:leading-[30px] text-[#020618]">
            Total Profit
          </span>
          <span className="font-inter text-[16px] sm:text-[18px] font-semibold leading-[24px] sm:leading-[30px] text-[#020618]">
            {totalProfit}
          </span>
        </div>
      </div>
    </div>
  );
}
