"use client";

import React from "react";

import { X } from "lucide-react";

import { StatusPopover } from "@/components/common/StatusPopover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { useEmailEnrollmentInvoice } from "@/hooks/api/user-management/useEmailEnrollmentInvoice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OneTimeTransaction {
  transactionNote: string;
  paymentType: "One-Time";
  paymentMethod: string;
  bank: string;
  accountInfo?: string; // added
  viewSlip?: boolean;
  status: string;
  paidAmount: string;
}

interface InstallmentSummary {
  paymentType: "Installment";
  transactionNote: string;
  totalPayment: string;
  discountedAmount: string;
  totalPaid: string;
  dueAmount: string;
  installments: InstallmentTransaction[];
}

interface InstallmentTransaction {
  id: string; // added
  transactionNote: string;
  paymentType: string;
  paymentMethod: string;
  bank: string;
  accountInfo?: string; // added
  status: string;
  paidAmount: string;
}

export type PaymentDetails =
  | {
      mode: "one-time";
      title: string;
      enrollmentId: string;
      transactions: OneTimeTransaction[];
    }
  | {
      mode: "installment";
      title: string;
      enrollmentId: string;
      summary: InstallmentSummary;
    };

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: PaymentDetails | null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "Paid", label: "Paid", bg: "#DFFFF0", text: "#16A34A" },
  { value: "Pending", label: "Pending", bg: "#FFF7D7", text: "#F59E0B" },
  { value: "Unpaid", label: "Unpaid", bg: "#FFE4E6", text: "#FB2C36" },
];

const labelClass =
  "text-[#0F172B] font-inter text-[16px] font-semibold leading-[24px]";

const valueClass =
  "text-[#90A1B9] font-inter text-[14px] font-normal leading-[20px]";

const CardField = ({ label, value }: { label: string; value?: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className={labelClass}>{label}</span>
    {value && <span className={valueClass}>{value}</span>}
  </div>
);

const TransactionCard = ({
  tx,
  enrollmentId,
}: {
  tx: OneTimeTransaction | InstallmentTransaction;
  enrollmentId: string;
}) => {
  const isPending = tx.status === "Pending" || tx.status === "PAYMENT_PENDING";

  const { mutate: emailInvoice, isPending: isEmailing } =
    useEmailEnrollmentInvoice();

  return (
    <div
      className="w-full flex flex-col items-end gap-2 rounded-[8px] p-3"
      style={{
        border: "1px solid #E2E8F0",
        background: "#F8FAFC",
        boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
      }}
    >
      {isPending ? (
        /* Pending layout: Transaction Note | (empty), Status | Amount */
        <div className="w-full grid grid-cols-2 gap-y-3 gap-x-4">
          {/* Transaction Note — spans both columns */}
          <div className="col-span-2 flex flex-col gap-0.5">
            <span className={labelClass}>Transaction Note</span>
            <span className={valueClass}>{tx.transactionNote}</span>
          </div>
          {/* Status */}
          <div className="flex flex-col gap-0.5">
            <span className={labelClass}>Status</span>
            <div className="inline-flex">
              <StatusPopover
                value={tx.status}
                options={STATUS_OPTIONS}
                readOnly
              />
            </div>
          </div>
          {/* Amount */}
          <div className="flex flex-col gap-0.5">
            <span className={labelClass}>Amount</span>
            <span className={valueClass}>{tx.paidAmount}</span>
          </div>
        </div>
      ) : (
        /* Paid / default layout: full 6-field grid */
        <div className="w-full grid grid-cols-2 gap-y-3 gap-x-4">
          {/* Transaction Note */}
          <div className="flex flex-col gap-0.5">
            <span className={labelClass}>Transaction Note</span>
            <span className={valueClass}>{tx.transactionNote}</span>
          </div>
          {/* Payment Type */}
          <div className="flex flex-col gap-0.5">
            <span className={labelClass}>Payment Type</span>
            <span className={valueClass}>{tx.paymentType}</span>
          </div>
          {/* Payment Method */}
          <div className="flex flex-col gap-0.5">
            <span className={labelClass}>Payment Method</span>
            <span className={valueClass}>{tx.paymentMethod}</span>
            {"viewSlip" in tx && tx.viewSlip && (
              <span className="text-[14px] font-normal leading-[20px] text-[#0F172B] underline cursor-pointer hover:text-[#E60076]">
                View Slip
              </span>
            )}
          </div>
          {/* Bank */}
          <div className="flex flex-col gap-0.5">
            <span className={labelClass}>Bank</span>
            <span className={valueClass}>{tx.bank}</span>
          </div>
          {/* Account Info */}
          {"accountInfo" in tx && tx.accountInfo && (
            <div className="flex flex-col gap-0.5">
              <span className={labelClass}>Account Info</span>
              <span className={valueClass}>{tx.accountInfo}</span>
            </div>
          )}
          {/* Status */}
          <div className="flex flex-col gap-0.5">
            <span className={labelClass}>Status</span>
            <div className="inline-flex">
              <StatusPopover
                value={tx.status}
                options={STATUS_OPTIONS}
                readOnly
              />
            </div>
          </div>
          {/* Paid Amount */}
          <div className="flex flex-col gap-0.5">
            <span className={labelClass}>Paid Amount</span>
            <span className={valueClass}>{tx.paidAmount}</span>
          </div>
        </div>
      )}

      {/* View Invoice — on all cards */}
      <Button
        className={cn(
          BUTTON_STYLES.outline.md,
          "text-sm font-medium text-[#0F172B]",
        )}
        onClick={() => emailInvoice({ enrollmentId })}
        disabled={isEmailing}
      >
        {isEmailing ? "Sending..." : "Email Invoice"}
      </Button>
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────

export function PaymentDetailsModal({
  isOpen,
  onClose,
  details,
}: PaymentDetailsModalProps) {
  if (!isOpen || !details) return null;

  return (
    /* Backdrop */
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
            {details.title} Payment Details
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
          {details.mode === "one-time" &&
            details.transactions.map((tx, i) => (
              <TransactionCard
                key={`payment-txn-${i}`}
                tx={tx}
                enrollmentId={details.enrollmentId}
              />
            ))}

          {details.mode === "installment" && (
            <>
              {/* Installment summary card — no border/bg */}
              <div className="w-full grid grid-cols-2 gap-y-3 gap-x-4 px-1">
                <CardField
                  label="Transaction Note"
                  value={details.summary.transactionNote}
                />
                <CardField
                  label="Payment Type"
                  value={details.summary.paymentType}
                />
                <CardField
                  label="Total Payment"
                  value={details.summary.totalPayment}
                />
                <CardField
                  label="Discounted Amount"
                  value={details.summary.discountedAmount}
                />
                <CardField
                  label="Total Paid"
                  value={details.summary.totalPaid}
                />
                <CardField
                  label="Due Amount"
                  value={details.summary.dueAmount}
                />
              </div>

              {/* Per-installment cards */}
              {details.summary.installments.map((tx) => (
                <TransactionCard
                  key={`installment-txn-${tx.id}`}
                  tx={tx}
                  enrollmentId={details.enrollmentId}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
