"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Check, X } from "lucide-react";
import { useDecideProfileRequestMutation } from "@/hooks/api/profile/useProfile";
import type { ProfileUpdateRequest } from "@/types/dto/profile.dto";

interface ProfileRequestReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: ProfileUpdateRequest | null;
}

export function ProfileRequestReviewModal({
  isOpen,
  onClose,
  request,
}: ProfileRequestReviewModalProps) {
  const [comment, setComment] = useState("");
  const decideMutation = useDecideProfileRequestMutation();

  if (!request) return null;

  const handleDecision = (decision: "APPROVED" | "REJECTED") => {
    if (decision === "REJECTED" && !comment.trim()) return;

    decideMutation.mutate(
      {
        id: request.id,
        decision,
        comment: comment || `Actioned by HR (${decision})`,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
            Review Profile Update: {request.employeeName}
          </DialogTitle>
          <p className="text-xs text-slate-500">
            {request.employeeCode} · {request.departmentName} · Requested on {request.requestedAt}
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Diff Table */}
          <div className="space-y-1.5">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
              Field Differences (Current vs Requested)
            </span>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Profile Attribute</th>
                    <th className="p-3">Current Record</th>
                    <th className="p-3">Requested Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {request.changes.map((ch, idx) => (
                    <tr key={idx} className="bg-pink-50/20 dark:bg-pink-950/10">
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {ch.field}
                      </td>
                      <td className="p-3 text-slate-500 line-through">
                        {ch.oldValue}
                      </td>
                      <td className="p-3 font-bold text-pink-600 dark:text-pink-400">
                        {ch.newValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Stated Reason */}
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">
              Employee's Reason for Request:
            </span>
            <p className="text-slate-700 dark:text-slate-300 italic">"{request.reason}"</p>
          </div>

          {/* Comment */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              HR Review Notes / Verification Feedback <span className="text-slate-400 font-normal">(Required if rejecting)</span>
            </label>
            <Textarea
              placeholder="e.g. Verified residential utility bill / certificate credentials..."
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
              <Check className="h-3.5 w-3.5" /> Approve & Update Profile
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

