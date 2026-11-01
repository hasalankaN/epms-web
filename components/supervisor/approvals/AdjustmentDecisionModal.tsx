"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, ArrowRight } from "lucide-react";
import { useDecideAdjustmentMutation } from "@/hooks/api/attendance/useAttendance";
import type { AttendanceAdjustmentRequest } from "@/types/dto/attendance.dto";

interface AdjustmentDecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  adjustment: AttendanceAdjustmentRequest | null;
}

export function AdjustmentDecisionModal({
  isOpen,
  onClose,
  adjustment,
}: AdjustmentDecisionModalProps) {
  const [comment, setComment] = useState("");
  const decideMutation = useDecideAdjustmentMutation();

  if (!adjustment) return null;

  const handleDecision = (decision: "APPROVED" | "REJECTED") => {
    if (decision === "REJECTED" && !comment.trim()) return;

    decideMutation.mutate(
      {
        id: adjustment.id,
        decision,
        comment: comment || `Adjustment ${decision.toLowerCase()} by supervisor`,
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
            Review Attendance Adjustment: {adjustment.employeeName}
          </DialogTitle>
          <p className="text-xs text-slate-500">Shift Date: {adjustment.date}</p>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Comparison Side-by-Side */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 space-y-3 border border-slate-200 dark:border-slate-800">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
              Punch In / Out Comparison
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-medium">Recorded (Biometric)</span>
                <p className="font-bold text-slate-700 dark:text-slate-300 mt-1">
                  In: {adjustment.currentPunchIn || "None"}
                </p>
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  Out: {adjustment.currentPunchOut || "None"}
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-pink-50/50 dark:bg-pink-950/20 border border-pink-200/60 dark:border-pink-900/40">
                <span className="text-[10px] text-pink-600 dark:text-pink-400 block font-bold">Requested Correction</span>
                <p className="font-bold text-pink-700 dark:text-pink-300 mt-1">
                  In: {adjustment.requestedPunchIn}
                </p>
                <p className="font-bold text-pink-700 dark:text-pink-300">
                  Out: {adjustment.requestedPunchOut}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <p className="text-slate-400 font-medium">Employee Reason:</p>
              <p className="text-slate-700 dark:text-slate-300 italic mt-0.5">"{adjustment.reason}"</p>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Supervisor Notes <span className="text-slate-400 font-normal">(Required if rejecting)</span>
            </label>
            <Textarea
              placeholder="State validation notes or reason if rejecting..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDecision("REJECTED")}
              disabled={decideMutation.isPending || !comment.trim()}
              className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs gap-1"
            >
              <X className="h-3.5 w-3.5" /> Reject Request
            </Button>
            <Button
              type="button"
              onClick={() => handleDecision("APPROVED")}
              disabled={decideMutation.isPending}
              className="bg-[#E60076] hover:bg-[#d0006a] text-white text-xs gap-1"
            >
              <Check className="h-3.5 w-3.5" /> Approve Correction
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

