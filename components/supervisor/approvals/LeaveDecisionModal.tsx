"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, ArrowUpRight } from "lucide-react";
import { useDecideLeaveMutation } from "@/hooks/api/leaves/useLeaves";
import type { LeaveApplication } from "@/types/dto/leave.dto";

interface LeaveDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  leave: LeaveApplication | null;
}

export function LeaveDecisionModal({
  isOpen,
  onClose,
  leave,
}: LeaveDecisionModalProps) {
  const [comment, setComment] = useState("");
  const decideMutation = useDecideLeaveMutation();

  if (!leave) return null;

  const handleDecision = (decision: "APPROVED" | "REJECTED" | "ESCALATED") => {
    if (decision === "REJECTED" && !comment.trim()) return;

    decideMutation.mutate(
      {
        id: leave.id,
        decision,
        comment: comment || `Actioned by supervisor (${decision})`,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
            Review Leave Application: {leave.employeeName}
          </DialogTitle>
          <p className="text-xs text-slate-500">
            {leave.employeeCode} · {leave.type} ({leave.days} day{leave.days === 1 ? "" : "s"})
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Summary Card */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 space-y-2 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Duration:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {leave.fromDate} to {leave.toDate} ({leave.days} days)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Balance After Approval:</span>
              <span
                className={`font-bold ${
                  (leave.balanceAfterApproval ?? 5) < 0 ? "text-rose-600" : "text-emerald-600"
                }`}
              >
                {leave.balanceAfterApproval ?? 4} days remaining
              </span>
            </div>
            <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <p className="text-slate-500 font-medium">Stated Reason:</p>
              <p className="text-slate-700 dark:text-slate-300 italic mt-0.5">"{leave.reason}"</p>
            </div>
            {leave.note && (
              <p className="text-slate-500 text-[11px]">Handover Notes: {leave.note}</p>
            )}
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Decision Comments / Instructions <span className="text-slate-400 font-normal">(Required if rejecting)</span>
            </label>
            <Textarea
              placeholder="State approval conditions or specific reason if rejecting/escalating..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="text-xs"
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDecision("ESCALATED")}
              disabled={decideMutation.isPending}
              className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs gap-1"
            >
              <ArrowUpRight className="h-3.5 w-3.5" /> Escalate to HR
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDecision("REJECTED")}
              disabled={decideMutation.isPending || !comment.trim()}
              className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs gap-1"
            >
              <X className="h-3.5 w-3.5" /> Reject
            </Button>
            <Button
              type="button"
              onClick={() => handleDecision("APPROVED")}
              disabled={decideMutation.isPending}
              className="bg-[#E60076] hover:bg-[#d0006a] text-white text-xs gap-1"
            >
              <Check className="h-3.5 w-3.5" /> Approve Leave
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

