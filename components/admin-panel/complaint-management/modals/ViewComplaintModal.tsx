"use client";

import React from "react";

import { format } from "date-fns";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";
import type { ComplaintDataType } from "@/types/complaint";
import { useGetComplaintById } from "@/hooks/api/complaints/useGetComplaintById";

// ─── Types ────────────────────────────────────────────────────────────────

interface ViewComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: ComplaintDataType | null;
  showSummary?: boolean;
  showHistory?: boolean;
}

// ─── Helper: action colour ─────────────────────────────────────────────────

function getStatusColor(status: string | null): string {
  switch (status?.toUpperCase()) {
    case "RESOLVED": return "#16A34A";
    case "FAILED": return "#FB2C36";
    case "IN_PROGRESS": return "#F59E0B";
    default: return "#64748B"; // PENDING, etc
  }
}

function formatStatus(status: string | null): string {
  if (!status) {
    return "—";
  }

  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
  complaint: listComplaint,
  showSummary = true,
  showHistory = true,
}: ViewComplaintModalProps) {

  const { data, isLoading } = useGetComplaintById(isOpen ? listComplaint?.id ?? null : null);

  const handleClose = () => {
    onClose();
  };

  const complaintData = data?.complaint;
  const history = data?.history || [];
  const turnaroundTime = data?.turnaround_time;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        isLoading={isLoading}
        animateChildren={true}
        className="flex max-h-[90vh] w-[95%] max-w-[720px] flex-col gap-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
      >
        {/* ═══ HEADER ═══════════════════════════════════════════════════════ */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="flex-1 text-lg font-semibold leading-7 text-[#0F172B]">
              View Complain – {`${complaintData?.complaint_id || listComplaint?.id || ''} `.trim()}
            </DialogTitle>
            <button
              title="Close"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </motion.div>

        {/* ═══ SCROLLABLE BODY ═══════════════════════════════════════════════ */}
        <motion.div variants={itemVariants} className="flex-1 overflow-y-auto pr-1 mt-4">
          {!isLoading && !data ? (
            <div className="h-full w-full flex items-center justify-center min-h-[300px] text-slate-500">
              Failed to load complaint details.
            </div>
          ) : isLoading || !data ? (
            <div className="h-full w-full min-h-[300px]" />
          ) : (
            <div className="flex flex-col gap-4">

              {/* ─── Summary card ──────────────────────────────────────────── */}
              {showSummary && (
                <div className="flex items-start gap-7">
                  {/* Left: label block */}
                  <div className="flex flex-col gap-0.5">
                    <p className="text-base font-semibold leading-6 text-[#0F172B]">
                      Summary
                    </p>
                    <p className="text-sm font-normal leading-5 text-[#90A1B9]">
                      Total Duration: {turnaroundTime ? turnaroundTime : (complaintData?.filed_at ? `${format(new Date(complaintData.filed_at), "dd/MM/yyyy")} – Present` : "—")}
                    </p>
                  </div>
                </div>
              )}

              {/* ─── Details ───────────────────────────────────────────────── */}
              <div className="flex flex-col gap-1">
                <SectionTitle>Details</SectionTitle>

                <InfoBox>
                  <div className="flex flex-col gap-1">
                    <Field label="Assignee" value={complaintData?.assignee_name} />
                    <Field label="Submitted Date" value={complaintData?.filed_at ? format(new Date(complaintData.filed_at), "dd/MM/yyyy") : undefined} />
                    <Field label="Submitted By" value={complaintData?.holder_name} />
                    <Field label="Mobile Number" value={complaintData?.mobile_number} />
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
                    {complaintData?.description || "No message provided."}
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
                  <span className="font-normal text-[#90A1B9]">{complaintData?.notes || "-"}</span>
                </p>
              </div>

              {/* ─── History ───────────────────────────────────────────────── */}
              {showHistory && history.length > 0 && (
                <div className="mt-[18px] flex flex-col gap-0">
                  <SectionTitle>History</SectionTitle>

                  <div className="mt-2 flex flex-col divide-y divide-[#F1F5F9]">
                    {history.map((item, idx) => (
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
                            {format(new Date(item.created_at), "dd/MM/yyyy | hh.mm a")}
                          </p>
                          <p
                            className="text-xs font-normal leading-4"
                            style={{ color: getStatusColor(item.new_status) }}
                          >
                            {item.note || `Status changed to ${formatStatus(item.new_status)}`}
                          </p>
                          <p className="text-xs font-normal leading-4 text-[#90A1B9]">
                            Updated By: {item.updated_by}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
