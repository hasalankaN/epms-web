"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Check, X } from "lucide-react";
import { useReviewProductionMutation } from "@/hooks/api/production/useProduction";
import type { ProductionRecord } from "@/types/dto/production.dto";

interface ReviewProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: ProductionRecord | null;
}

export function ReviewProductionModal({
  isOpen,
  onClose,
  record,
}: ReviewProductionModalProps) {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const reviewMutation = useReviewProductionMutation();

  if (!record) return null;

  const handleDecision = (approvalStatus: "APPROVED" | "REJECTED") => {
    if (approvalStatus === "REJECTED" && !comment.trim()) return;

    reviewMutation.mutate(
      {
        recordId: record.id,
        rating,
        supervisorComment: comment || "Approved by supervisor.",
        approvalStatus,
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
            Review Production Output: {record.employeeName}
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Verify actual deliverables against target and record quality rating.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Read-Only Summary Card */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 space-y-2 border border-slate-200 dark:border-slate-800">
            <div className="flex justify-between">
              <span className="text-slate-400">Project / Client:</span>
              <span className="font-bold text-slate-900 dark:text-white">{record.projectName} ({record.clientName})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date Logged:</span>
              <span className="font-semibold">{record.date}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-500">Target vs Actual Output:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {record.actualUnits} / {record.expectedUnits} units ({record.achievementPercentage}%)
              </span>
            </div>
            {record.specialRemarks && (
              <p className="text-slate-500 italic text-[11px] pt-1">
                Employee remarks: "{record.specialRemarks}"
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Deliverable Quality Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400"
                >
                  <Star
                    className={`h-5 w-5 ${
                      star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-2">
                {rating} / 5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Supervisor Comments / Rework Instructions
            </label>
            <Textarea
              placeholder="State code review observations, test findings, or reason if rejecting..."
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
              disabled={reviewMutation.isPending || !comment.trim()}
              className="text-rose-600 border-rose-300 hover:bg-rose-50 text-xs gap-1"
            >
              <X className="h-3.5 w-3.5" /> Reject Record
            </Button>
            <Button
              type="button"
              onClick={() => handleDecision("APPROVED")}
              disabled={reviewMutation.isPending}
              className="bg-[#E60076] hover:bg-[#d0006a] text-white text-xs gap-1"
            >
              <Check className="h-3.5 w-3.5" /> Approve Production
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

