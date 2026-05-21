"use client";

import React, { useState } from "react";

import { X } from "lucide-react";

import { StatusPopover } from "@/components/common/StatusPopover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AUTH_INPUT,
  AUTH_TYPOGRAPHY,
  BUTTON_STYLES,
} from "@/lib/constants/theme";
import { useAddEnrollmentDiscount } from "@/hooks/api/user-management/useAddEnrollmentDiscount";
import { useEmailEnrollmentInvoice } from "@/hooks/api/user-management/useEmailEnrollmentInvoice";

// ─── Types ────────────────────────────────────────────────────────────────────

interface OneTimeDiscountRecord {
  actualAmount: string;
  offerAmount: string;
  offerBy: string;
}

interface InstallmentItem {
  id: string; // added
  transactionNote: string;
  paymentType?: string;
  paymentMethod?: string;
  bank?: string;
  status: string;
  amount: string;
  offerAmount: string;
  offerBy: string;
  viewSlip?: boolean;
}

interface InstallmentSummary {
  transactionNote: string;
  paymentType: string;
  totalPayment: string;
  discountedAmount: string;
  totalPaid: string;
  dueAmount: string;
  installments: InstallmentItem[];
}

export type DiscountDetails =
  | {
      mode: "one-time";
      enrollmentId: string;
      title: string;
      actualAmount: string;
      discountRecords: OneTimeDiscountRecord[];
    }
  | {
      mode: "installment";
      enrollmentId: string;
      title: string;
      summary: InstallmentSummary;
    };

interface AddDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  details: DiscountDetails | null;
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

const CardField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className={labelClass}>{label}</span>
    <span className={valueClass}>{value}</span>
  </div>
);

// Discount input row shared between both modes
const DiscountInputRow = ({
  enrollmentId,
  installmentId,
}: {
  enrollmentId: string;
  installmentId?: string;
  isPending?: boolean;
}) => {
  const [value, setValue] = useState("");

  const { mutate: addDiscount, isPending: isAdding } =
    useAddEnrollmentDiscount();

  const handleAdd = () => {
    if (!value || isNaN(parseFloat(value))) return;

    addDiscount(
      {
        enrollmentId,
        installment_id: installmentId || "",
        discount_amount: parseFloat(value),
      },
      {
        onSuccess: () => setValue(""),
      },
    );
  };

  return (
    <div className="flex flex-col gap-1.5 mt-2">
      <Label className={cn(AUTH_TYPOGRAPHY.label, "flex items-center gap-0.5")}>
        Add Discount
        <span className="text-red-500 ml-0.5">*</span>
      </Label>
      <div className="flex items-center gap-2">
        <Input
          className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "flex-1")}
          placeholder="eg: 1000"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={isAdding}
        />
        <Button
          className={cn(
            BUTTON_STYLES.outline.md,
            "text-sm font-medium text-[#0F172B] shrink-0",
          )}
          onClick={handleAdd}
          disabled={isAdding || !value}
        >
          {isAdding ? "Adding..." : "Add"}
        </Button>
      </div>
    </div>
  );
};

// Card used for one-time discount records

const OneTimeDiscountCard = ({ record }: { record: OneTimeDiscountRecord }) => (
  <div
    className="w-full flex flex-col gap-2 rounded-[8px] p-3"
    style={{
      border: "1px solid #E2E8F0",
      background: "#F8FAFC",
      boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
    }}
  >
    <div className="flex flex-col gap-0.5">
      <span className={labelClass}>Actual Amount</span>
      <span className={valueClass}>{record.actualAmount}</span>
    </div>
    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
      <CardField label="Offer Amount (Discounted)" value={record.offerAmount} />
      <CardField label="Offer by" value={record.offerBy} />
    </div>
  </div>
);

// Card used for per-installment discount records
const InstallmentDiscountCard = ({
  item,
  enrollmentId,
}: {
  item: InstallmentItem;
  enrollmentId: string;
}) => {
  const isPending =
    item.status === "Pending" || item.status === "PAYMENT_PENDING";

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
      <div className="w-full grid grid-cols-2 gap-y-3 gap-x-4">
        <div className="col-span-2 flex flex-col gap-0.5">
          <span className={labelClass}>Transaction Note</span>
          <span className={valueClass}>{item.transactionNote}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Status</span>
          <div className="inline-flex">
            <StatusPopover
              value={
                item.status === "PAYMENT_PENDING" ? "Pending" : item.status
              }
              options={STATUS_OPTIONS}
              readOnly
            />
          </div>
        </div>
        <CardField label="Amount" value={item.amount} />
      </div>

      {/* Offer Amount + Offer By always at the bottom of the grid */}
      <div className="w-full grid grid-cols-2 gap-x-4 mt-1">
        <CardField label="Offer Amount (Discounted)" value={item.offerAmount} />
        <CardField label="Offer by" value={item.offerBy} />
      </div>

      {isPending && (
        <div className="w-full">
          <DiscountInputRow
            enrollmentId={enrollmentId}
            installmentId={item.id}
          />
        </div>
      )}

      <div className="flex items-center gap-2 mt-2">
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
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────

export function AddDiscountModal({
  isOpen,
  onClose,
  details,
}: AddDiscountModalProps) {
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
        <div className="flex flex-col overflow-y-auto flex-1 pr-1">
          {/* ── ONE-TIME LAYOUT ── */}
          {details.mode === "one-time" && (
            <>
              {/* Actual amount + discount input */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className={labelClass}>Actual Amount</span>
                  <span className={valueClass}>{details.actualAmount}</span>
                </div>
                <DiscountInputRow enrollmentId={details.enrollmentId} />
              </div>

              <div className="w-full h-[1px] bg-[#E2E8F0] mt-[28px] mb-[16px] shrink-0" />

              {/* Existing discount records */}
              <div className="flex flex-col gap-4">
                {details.discountRecords.map((record, i) => (
                  <OneTimeDiscountCard
                    key={`one-time-discount-${i}`}
                    record={record}
                  />
                ))}
              </div>
            </>
          )}

          {/* ── INSTALLMENT LAYOUT ── */}
          {details.mode === "installment" && (
            <>
              {/* Summary header */}
              <div className="flex flex-col gap-3 pt-1">
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
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
              </div>

              <div className="w-full h-[1px] bg-[#E2E8F0] mt-[28px] mb-[16px] shrink-0" />

              {/* Per-installment discount cards */}
              <div className="flex flex-col gap-4">
                {details.summary.installments.map((item) => (
                  <InstallmentDiscountCard
                    key={`installment-discount-${item.id}`}
                    item={item}
                    enrollmentId={details.enrollmentId}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
