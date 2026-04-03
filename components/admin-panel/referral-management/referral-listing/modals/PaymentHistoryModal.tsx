"use client";

import React from "react";

import { X } from "lucide-react";

import { StatusPopover } from "@/components/common/StatusPopover";

export interface PaymentHistoryTransaction {
  id: string;
  description: string;
  courseBatch: string;
  amount: string;
  status: string;
  paidDate?: string;
}

export interface PaymentHistoryGroup {
  monthYear: string;
  transactions: PaymentHistoryTransaction[];
}

interface PaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyGroups: PaymentHistoryGroup[] | null;
}

const STATUS_OPTIONS = [
  { value: "Paid", label: "Paid", bg: "#DFFFF0", text: "#16A34A" },
  { value: "Pending", label: "Pending", bg: "#FFF7D7", text: "#F59E0B" },
];

const labelClass = "text-[#0F172B] font-inter text-[16px] font-semibold leading-[24px]";
const valueClass = "text-[#90A1B9] font-inter text-[14px] font-normal leading-[20px]";

export function PaymentHistoryModal({ isOpen, onClose, historyGroups }: PaymentHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col bg-white rounded-[12px] overflow-hidden"
        style={{
          width: "470px",
          maxHeight: "90vh",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col gap-4 p-6 pb-0 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold leading-[30px] text-[#0F172B] font-inter">
              Payment History
            </h2>
            <button
              title="close"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </div>

        {/* Scrollable body */}
        <div className="flex flex-col gap-6 overflow-y-auto flex-1 p-6 pt-5">
          {historyGroups?.map((group, gIdx) => (
            <div key={gIdx} className="flex flex-col gap-3">
              <h3 className="text-[14px] font-semibold leading-[20px] text-[#314158] font-inter mb-0.5">
                {group.monthYear}
              </h3>
              
              <div className="flex flex-col gap-3">
                {group.transactions.map((tx, tIdx) => (
                  <div
                    key={tIdx}
                    className="flex flex-col gap-3 p-4 rounded-[8px]"
                    style={{
                      border: "1px solid #E2E8F0",
                      background: "#FAFAFA",
                    }}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className={labelClass}>Payment Description</span>
                      <span className={valueClass}>{tx.description}</span>
                    </div>
                    
                    <div className="flex flex-col gap-0.5">
                      <span className={labelClass}>Course/ Batch</span>
                      <span className={valueClass}>{tx.courseBatch}</span>
                    </div>
                    
                    <div className="flex flex-col gap-0.5">
                      <span className={labelClass}>Amount</span>
                      <span className={valueClass}>{tx.amount}</span>
                    </div>
                    
                    <div className="flex flex-col gap-0.5">
                      <span className={labelClass}>Payment Status</span>
                      <div className="inline-flex mt-0.5">
                        <StatusPopover value={tx.status} options={STATUS_OPTIONS} readOnly />
                      </div>
                    </div>
                    
                    {tx.status === "Paid" && (
                      <div className="flex flex-col gap-3 pt-1">
                        <div className="flex flex-col gap-0.5">
                          <span className={labelClass}>Paid Date</span>
                          <span className={valueClass}>{tx.paidDate}</span>
                        </div>
                        <div className="flex justify-end">
                          <button className="text-[14px] font-semibold leading-[20px] text-[#0F172B] font-inter transition-colors hover:text-[#E60076]">
                            View Receipt
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
