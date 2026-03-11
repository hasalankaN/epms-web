"use client";

import React from "react";

import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ComplaintDataType } from "@/types/complaint";

// ─── Types ────────────────────────────────────────────────────────────────

interface HistoryItem {
  id: string;
  date: string;
  time: string;
  action: string;
  actionType: "resolved" | "failed" | "progress" | "default";
  updatedBy: string;
}

interface ViewComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: ComplaintDataType | null;
  showSummary?: boolean;
  showHistory?: boolean;
}

// ─── Mock history (swap for real data via props) ───────────────────────────

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: "h1",
    date: "21/11/2025",
    time: "10.35AM",
    action: "Complain Resolved",
    actionType: "resolved",
    updatedBy: "Staff Member Name",
  },
  {
    id: "h2",
    date: "21/11/2025",
    time: "10.35AM",
    action: "Failed Attempt",
    actionType: "failed",
    updatedBy: "Staff Member Name",
  },
  {
    id: "h3",
    date: "21/11/2025",
    time: "10.35AM",
    action: "Moved In Progress",
    actionType: "progress",
    updatedBy: "Staff Member Name",
  },
];

// ─── Helper: action colour ─────────────────────────────────────────────────

function actionColor(type: HistoryItem["actionType"]): string {
  switch (type) {
    case "resolved":  return "#16A34A";
    case "failed":    return "#FB2C36";
    case "progress":  return "#F59E0B";
    default:          return "#64748B";
  }
}

// ─── Info box (the slate-100 read-only card) ───────────────────────────────

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-[80px] rounded-[6px] border border-[#F1F5F9] bg-[#F1F5F9] px-3 py-2"
      style={{ boxShadow: "0 1px 2px 0 rgba(16,24,40,0.05)" }}
    >
      {children}
    </div>
  );
}

// ─── Inline label + value pair ─────────────────────────────────────────────

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-wrap items-baseline gap-1 text-sm leading-5 text-[#1D293D]">
      <span className="font-bold">{label}:</span>
      <span className="font-normal">{value ?? "—"}</span>
    </div>
  );
}

// ─── Section heading ───────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base font-semibold leading-6 text-[#0F172B]">
      {children}
    </p>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export function ViewComplaintModal({
  isOpen,
  onClose,
  complaint,
  showSummary = true,
  showHistory = true,
}: ViewComplaintModalProps) {
  if (!complaint) return null;


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="flex max-h-[90vh] w-[95%] max-w-[720px] flex-col gap-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
      >
        {/* ═══ HEADER ═══════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-4 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="flex-1 text-lg font-semibold leading-7 text-[#0F172B]">
              View Complain – {complaint.idNo} {complaint.complainType}
            </DialogTitle>
            <button
              title="Close"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </div>

        {/* ═══ SCROLLABLE BODY ═══════════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="flex flex-col gap-4">

            {/* ─── Summary card ──────────────────────────────────────────── */}
            {showSummary && (
              <div className="flex items-start gap-7">
                {/* Left: label block */}
                <div className="flex flex-col gap-0.5">
                  <p className="text-base font-semibold leading-6 text-[#0F172B]">
                    Summery
                  </p>
                  <p className="text-sm font-normal leading-5 text-[#90A1B9]">
                    Total Duration: {complaint.submittedDate} – Present
                  </p>
                  <p className="text-sm font-normal leading-5 text-[#90A1B9]">
                    Total Days: XX
                  </p>
                </div>
              </div>
            )}

            {/* ─── Details ───────────────────────────────────────────────── */}
            <div className="flex flex-col gap-1">
              <SectionTitle>Details</SectionTitle>

              <InfoBox>
                <div className="flex flex-col gap-1">
                  <Field label="Assignee" value={complaint.assignee} />
                  <Field label="Submitted Date" value={complaint.submittedDate} />
                  <Field label="Submitted By" value={complaint.submittedBy} />
                  <Field label="Mobile Number" value="070 XXX XXXX" />
                </div>
              </InfoBox>
            </div>

            {/* ─── Message ───────────────────────────────────────────────── */}
            <div
              className="flex min-h-[80px] items-start gap-2.5 self-stretch rounded-[6px] border border-[#F1F5F9] bg-[#F1F5F9] px-3 py-2"
              style={{ boxShadow: "0 1px 2px 0 rgba(16,24,40,0.05)" }}
            >
              <p className="text-sm leading-5 text-[#1D293D]">
                <span className="font-bold">Message:</span>{" "}
                <span className="font-normal">
                  Lorem ipsum dolor sit amet consectetur. Et purus eu lorem odio. Amet faucibus
                  aliquet quam nibh in sed. Sodales viverra dolor venenatis pulvinarfaucibus massa
                  enim a accumsan.
                </span>
              </p>
            </div>

            {/* ─── Notes ─────────────────────────────────────────────────── */}
            <div
              className="flex min-h-[36px] items-center gap-2 self-stretch rounded-[6px] border border-[#F1F5F9] bg-[#F1F5F9] px-3 py-2"
              style={{ boxShadow: "0 1px 2px 0 rgba(16,24,40,0.05)" }}
            >
              <p className="text-sm leading-5 text-[#1D293D]">
                <span className="font-bold">Notes:</span>{" "}
                <span className="font-normal text-[#90A1B9]">-</span>
              </p>
            </div>

            {/* ─── History ───────────────────────────────────────────────── */}
            {showHistory && (
              <div className="mt-[18px] flex flex-col gap-0">
                <SectionTitle>History</SectionTitle>

                <div className="mt-2 flex flex-col divide-y divide-[#F1F5F9]">
                  {MOCK_HISTORY.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-6 px-6 py-4"
                    >
                      {/* Bullet (Doughnut shape) */}
                      <div
                        className="mt-0.5 h-5 w-5 shrink-0 rounded-full border-[5px] bg-white"
                        style={{
                          borderColor: idx === 0 ? "#E60076" : "#CFD6DC",
                        }}
                      />

                      {/* Text block */}
                      <div className="flex flex-col gap-px">
                        <p className="text-sm font-semibold leading-5 text-[#0F172B]">
                          {item.date}&nbsp;|&nbsp;{item.time}
                        </p>
                        <p
                          className="text-xs font-normal leading-4"
                          style={{ color: actionColor(item.actionType) }}
                        >
                          {item.action}
                        </p>
                        <p className="text-xs font-normal leading-4 text-[#90A1B9]">
                          Updated By: {item.updatedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
