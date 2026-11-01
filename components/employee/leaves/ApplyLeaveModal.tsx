"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import { useApplyLeaveMutation } from "@/hooks/api/leaves/useLeaves";
import type { LeaveBalance, LeaveType } from "@/types/dto/leave.dto";

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  balances: LeaveBalance[];
}

export function ApplyLeaveModal({ isOpen, onClose, balances }: ApplyLeaveModalProps) {
  const [leaveType, setLeaveType] = useState<LeaveType>("ANNUAL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const applyMutation = useApplyLeaveMutation();

  const selectedBalance = balances.find((b) => b.type === leaveType);
  const remainingDays = selectedBalance?.remaining ?? 0;

  // Compute days count
  let calculatedDays = 0;
  if (fromDate && toDate && toDate >= fromDate) {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diff = Math.abs(end.getTime() - start.getTime());
    calculatedDays = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  const isExceedingBalance = calculatedDays > remainingDays;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reason.trim() || isExceedingBalance || calculatedDays <= 0) return;

    applyMutation.mutate(
      {
        type: leaveType,
        fromDate,
        toDate,
        reason,
        note,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Apply for Leave
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Submit your leave request. Approval is subject to supervisor review and available balance.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Leave Type Selector */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Leave Category
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
            >
              <option value="ANNUAL">Annual Leave</option>
              <option value="CASUAL">Casual Leave</option>
              <option value="MEDICAL">Medical Leave</option>
              <option value="NO_PAY">No-Pay Leave</option>
              <option value="SPECIAL">Special Leave</option>
            </select>
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className="text-slate-400">Available Balance:</span>
              <span className="font-bold text-pink-600 dark:text-pink-400">
                {remainingDays} days remaining
              </span>
            </div>
          </div>

          {/* Dates Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                From Date
              </label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                To Date
              </label>
              <Input
                type="date"
                min={fromDate}
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          {/* Computed Days */}
          <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-xs">
            <span className="text-slate-500 font-medium">Total Requested Duration:</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {calculatedDays} Working Day{calculatedDays === 1 ? "" : "s"}
            </span>
          </div>

          {/* Balance Warning */}
          {isExceedingBalance && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                Requested days ({calculatedDays}) exceed your remaining balance ({remainingDays}). Submit is disabled.
              </span>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Reason for Leave <span className="text-rose-500">*</span>
            </label>
            <Textarea
              placeholder="State clear purpose of absence..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              className="text-xs"
            />
          </div>

          {/* Optional Note */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Handover / Emergency Notes (Optional)
            </label>
            <Input
              placeholder="e.g. Work covered by Kasun Jayasuriya"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="text-xs"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={applyMutation.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#E60076] hover:bg-[#d0006a] text-white"
              disabled={
                applyMutation.isPending ||
                !fromDate ||
                !toDate ||
                !reason.trim() ||
                isExceedingBalance ||
                calculatedDays <= 0
              }
            >
              {applyMutation.isPending ? "Applying..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

