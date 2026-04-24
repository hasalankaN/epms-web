"use client";

import React, { useMemo } from "react";

import { format } from "date-fns";

import { X } from "lucide-react";

import { StatusPopover } from "@/components/common/StatusPopover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { useGetLecturerById } from "@/hooks/api/lecturers/useGetLecturerById";
import { useRecordLecturerSalaryPayment } from "@/hooks/api/lecturers/useRecordLecturerSalaryPayment";
import type { LecturerSalaryPayment } from "@/hooks/api/lecturers/useGetLecturerById";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingCard {
  kind: "pending";
  payment: LecturerSalaryPayment;
}

interface PaidCard {
  kind: "paid";
  payment: LecturerSalaryPayment;
}

type PaymentCard = PendingCard | PaidCard;

interface MonthGroup {
  monthLabel: string;
  cards: PaymentCard[];
}

export interface LecturerPaymentHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecturerId: string | null;
  lecturerName?: string;
}

// ─── Style helpers ────────────────────────────────────────────────────────────

const labelClass =
  "text-[#0F172B] font-inter text-[16px] font-semibold leading-[24px]";

const valueClass =
  "text-[#90A1B9] font-inter text-[14px] font-normal leading-[20px]";

const STATUS_OPTIONS = [
  { value: "Paid", label: "Paid", bg: "#DFFFF0", text: "#16A34A" },
  { value: "Pending", label: "Pending", bg: "#FFF7D7", text: "#F59E0B" },
];

// ─── Pending Card ─────────────────────────────────────────────────────────────

function PendingPaymentCard({
  card,
  lecturerId,
}: {
  card: PendingCard;
  lecturerId: string;
}) {
  const { mutate: recordPayment, isPending } =
    useRecordLecturerSalaryPayment(lecturerId);

  const handlePay = () => {
    recordPayment({
      description: card.payment.description,
      source_type: card.payment.source_type as "MONTHLY" | "COURSE" | "BATCH",
      source_id: card.payment.source_id ?? undefined,
      amount: Number(card.payment.amount),
      period: card.payment.period ?? undefined,
      paid_date: new Date().toISOString(),
    });
  };

  return (
    <div
      className="w-full flex flex-col items-end gap-2 rounded-[8px] p-3"
      style={{
        border: "1px solid #E2E8F0",
        background: "#F8FAFC",
        boxShadow: "0 1px 2px 0 rgba(16,24,40,0.05)",
      }}
    >
      <div className="w-full flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Expenses Description</span>
          <span className={valueClass}>{card.payment.description}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Course/ Batch</span>
          <span className={valueClass}>
            {card.payment.source_type} {card.payment.period ?? ""}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Amount</span>
          <span className={valueClass}>
            LKR {Number(card.payment.amount).toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Payment Status</span>
          <div className="inline-flex">
            <StatusPopover value="Pending" options={STATUS_OPTIONS} readOnly />
          </div>
        </div>
      </div>
      <Button
        className={cn(
          BUTTON_STYLES.primary.md,
          "text-white font-inter text-[14px] font-semibold leading-[20px]",
        )}
        disabled={isPending}
        onClick={handlePay}
      >
        {isPending ? "Paying…" : "Pay"}
      </Button>
    </div>
  );
}

// ─── Paid Card ────────────────────────────────────────────────────────────────

function PaidPaymentCard({ card }: { card: PaidCard }) {
  const p = card.payment;

  return (
    <div
      className="w-full flex flex-col items-end gap-2 rounded-[8px] p-3"
      style={{
        border: "1px solid #E2E8F0",
        background: "#F8FAFC",
        boxShadow: "0 1px 2px 0 rgba(16,24,40,0.05)",
      }}
    >
      <div className="w-full grid grid-cols-2 gap-y-3 gap-x-4">
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Expenses Note</span>
          <span className={valueClass}>{p.description}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Course/ Batch</span>
          <span className={valueClass}>
            {p.source_type} {p.period ?? ""}
          </span>
        </div>
        {p.receipt_url && (
          <div className="flex flex-col gap-0.5">
            <span className={labelClass}>Payment Method</span>
            <a
              href={p.receipt_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-normal leading-[20px] text-[#0F172B] underline hover:text-[#E60076]"
            >
              View Receipt
            </a>
          </div>
        )}
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Paid Amount</span>
          <span className={valueClass}>LKR {Number(p.amount).toFixed(2)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className={labelClass}>Paid Date</span>
          <span className={valueClass}>
            {p.paid_date ? format(new Date(p.paid_date), "yyyy/MM/dd") : "—"}
          </span>
        </div>
        <div className="col-span-2 flex flex-col gap-0.5">
          <span className={labelClass}>Status</span>
          <div className="inline-flex">
            <StatusPopover value="Paid" options={STATUS_OPTIONS} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Month Divider ────────────────────────────────────────────────────────────

function MonthDivider({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-[1px] bg-[#E2E8F0]" />
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
  lecturerId,
}: LecturerPaymentHistoryModalProps) {
  const { data: detail, isLoading } = useGetLecturerById(
    isOpen ? lecturerId : null,
  );

  const groups = useMemo<MonthGroup[]>(() => {
    const history = detail?.salaryHistory ?? [];

    if (!history.length) return [];

    const map = new Map<string, PaymentCard[]>();

    for (const p of history) {
      const monthKey = format(new Date(p.created_at), "MMMM, yyyy");

      const card: PaymentCard =
        p.status === "PAID"
          ? { kind: "paid", payment: p }
          : { kind: "pending", payment: p };

      if (!map.has(monthKey)) map.set(monthKey, []);
      map.get(monthKey)!.push(card);
    }

    return Array.from(map.entries()).map(([monthLabel, cards]) => ({
      monthLabel,
      cards,
    }));
  }, [detail?.salaryHistory]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
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

        <div className="flex flex-col gap-4 overflow-y-auto flex-1 pr-1">
          {isLoading && (
            <p className="text-sm text-[#90A1B9] text-center py-8">
              Loading payment history…
            </p>
          )}
          {!isLoading && groups.length === 0 && (
            <p className="text-sm text-[#90A1B9] text-center py-8">
              No payment history found.
            </p>
          )}
          {!isLoading &&
            groups.map((group, gi) => (
              <React.Fragment key={gi}>
                {gi === 0 ? (
                  <span
                    className="font-inter text-[14px] font-semibold leading-[20px]"
                    style={{ color: "#314158" }}
                  >
                    {group.monthLabel}
                  </span>
                ) : (
                  <MonthDivider label={group.monthLabel} />
                )}
                {group.cards.map((card, ci) =>
                  card.kind === "pending" ? (
                    <PendingPaymentCard
                      key={ci}
                      card={card}
                      lecturerId={lecturerId!}
                    />
                  ) : (
                    <PaidPaymentCard key={ci} card={card} />
                  ),
                )}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}

// Keep legacy export shape for any other consumers
export type { LecturerPaymentHistoryModalProps as LecturerPaymentHistoryData };
