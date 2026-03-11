"use client";

import React, { useState } from "react";

import { X } from "lucide-react";

import { StatusPopover } from "@/components/common/StatusPopover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { UpdatePaymentModal } from "@/components/admin-panel/user-management/modals/lecturer/UpdatePaymentModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingPayment {
  status: "Pending";
  expensesDescription: string;
  courseBatch: string;
}

interface PaidPayment {
  status: "Paid";
  expensesNote: string;
  courseBatch: string;
  paymentMethod: string;
  note: string;
  paidAmount: string;
  paidDate: string;
}

type Payment = PendingPayment | PaidPayment;

interface MonthGroup {
  monthLabel: string; // e.g. "December, 2025"
  payments: Payment[];
}

export interface LecturerPaymentHistoryData {
  lecturerName: string;
  groups: MonthGroup[];
}

interface LecturerPaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: LecturerPaymentHistoryData | null;
}

// ─── Style helpers ────────────────────────────────────────────────────────────

const labelClass = "text-[#0F172B] font-inter text-[16px] font-semibold leading-[24px]";
const valueClass = "text-[#90A1B9] font-inter text-[14px] font-normal leading-[20px]";

const STATUS_OPTIONS = [
  { value: "Paid",    label: "Paid",    bg: "#DFFFF0", text: "#16A34A" },
  { value: "Pending", label: "Pending", bg: "#FFF7D7", text: "#F59E0B" },
  { value: "Unpaid",  label: "Unpaid",  bg: "#FFE4E6", text: "#FB2C36" },
];

// ─── Pending Card ─────────────────────────────────────────────────────────────

function PendingCard({ payment, onPay }: { payment: PendingPayment; onPay: () => void }) {
  return (
    <div
      className="w-full flex flex-col items-end gap-2 rounded-[8px] p-3"
      style={{
        border: "1px solid #E2E8F0",
        background: "#F8FAFC",
        boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
      }}
    >
      {/* Fields */}
      <div className="w-full flex flex-col gap-2">
        {/* Expenses Description */}
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Expenses Description</span>
          <span className={valueClass}>{payment.expensesDescription}</span>
        </div>

        {/* Course / Batch */}
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Course/ Batch</span>
          <span className={valueClass}>{payment.courseBatch}</span>
        </div>

        {/* Payment Status */}
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Payment Status</span>
          <div className="inline-flex">
            <StatusPopover value={payment.status} options={STATUS_OPTIONS} readOnly />
          </div>
        </div>
      </div>

      {/* Pay Button */}
      <Button
        className={cn(
          BUTTON_STYLES.primary.md,
          "text-white font-inter text-[14px] font-semibold leading-[20px]"
        )}
        onClick={onPay}
      >
        Pay
      </Button>
    </div>
  );
}

// ─── Paid Card ────────────────────────────────────────────────────────────────

function PaidCard({ payment }: { payment: PaidPayment }) {
  return (
    <div
      className="w-full flex flex-col items-end gap-2 rounded-[8px] p-3"
      style={{
        border: "1px solid #E2E8F0",
        background: "#F8FAFC",
        boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
      }}
    >
      {/* Grid fields */}
      <div className="w-full grid grid-cols-2 gap-y-3 gap-x-4">
        {/* Expenses Note */}
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Expenses Note</span>
          <span className={valueClass}>{payment.expensesNote}</span>
        </div>

        {/* Course / Batch */}
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Course/ Batch</span>
          <span className={valueClass}>{payment.courseBatch}</span>
        </div>

        {/* Payment Method */}
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Payment Method</span>
          <span className={valueClass}>{payment.paymentMethod}</span>
          <span className="text-[14px] font-normal leading-[20px] text-[#0F172B] underline cursor-pointer hover:text-[#E60076]">
            View Receipt
          </span>
        </div>

        {/* Note */}
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Note</span>
          <span className={valueClass}>{payment.note}</span>
        </div>

        {/* Paid Amount */}
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Paid Amount</span>
          <span className={valueClass}>{payment.paidAmount}</span>
        </div>

        {/* Paid Date */}
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Paid Date</span>
          <span className={valueClass}>{payment.paidDate}</span>
        </div>

        {/* Status — full width */}
        <div className="col-span-2 flex flex-col gap-0.5">
          <span className={labelClass}>Status</span>
          <div className="inline-flex">
            <StatusPopover value={payment.status} options={STATUS_OPTIONS} readOnly />
          </div>
        </div>
      </div>

      {/* View Receipt Button */}
      <Button
        className={cn(BUTTON_STYLES.outline.md, "text-sm font-medium text-[#0F172B]")}
        onClick={() => console.log("View Receipt")}
      >
        View Recipt
      </Button>
    </div>
  );
}

// ─── Month Divider ────────────────────────────────────────────────────────────

function MonthDivider({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Separator line */}
      <div className="w-full h-[1px] bg-[#E2E8F0]" />
      {/* Month label */}
      <span
        className="font-inter text-[14px] font-semibold leading-[20px]"
        style={{ color: "#314158" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

export function LecturerPaymentHistoryModal({
  isOpen,
  onClose,
  data,
}: LecturerPaymentHistoryModalProps) {
  const [updatePaymentOpen, setUpdatePaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PendingPayment | null>(null);

  if (!isOpen || !data) return null;

  return (

    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Dialog */}
        <div
          className="relative flex flex-col bg-white rounded-[12px] overflow-hidden"
          style={{
            width: "470px",
            maxHeight: "90vh",
            padding: "24px",
            gap: "16px",
            boxShadow:
              "0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 -mt-1 shrink-0">
            <h2 className="text-lg font-semibold leading-[30px] text-[#0F172B]">
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

          {/* Scrollable body */}
          <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
            {data.groups.map((group, gi) => (
              <React.Fragment key={gi}>
                {/* Month divider — shown between groups (not before first) */}
                {gi > 0 && <MonthDivider label={group.monthLabel} />}

                {/* First group label (no preceding divider) */}
                {gi === 0 && (
                  <span
                    className="font-inter text-[14px] font-semibold leading-[20px]"
                    style={{ color: "#314158" }}
                  >
                    {group.monthLabel}
                  </span>
                )}

                {/* Cards */}
                {group.payments.map((payment, pi) =>
                  payment.status === "Pending" ? (
                    <PendingCard
                      key={pi}
                      payment={payment as PendingPayment}
                      onPay={() => {
                        setSelectedPayment(payment as PendingPayment);
                        setUpdatePaymentOpen(true);
                      }}
                    />
                  ) : (
                    <PaidCard key={pi} payment={payment as PaidPayment} />
                  )
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Update Payment Modal — rendered above the history modal */}
      <UpdatePaymentModal
        isOpen={updatePaymentOpen}
        onClose={() => setUpdatePaymentOpen(false)}
        expensesDescription={selectedPayment?.expensesDescription}
        courseBatch={selectedPayment?.courseBatch}
      />
    </>
  );
}
