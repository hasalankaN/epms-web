"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useCreateAdjustmentMutation, useAdjustmentRequestsQuery } from "@/hooks/api/attendance/useAttendance";
import type { AttendanceRecord } from "@/types/dto/attendance.dto";

interface AttendanceAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
}

export function AttendanceAdjustmentModal({
  isOpen,
  onClose,
  record,
}: AttendanceAdjustmentModalProps) {
  const [activeTab, setActiveTab] = useState<"apply" | "history">("apply");
  const [requestedPunchIn, setRequestedPunchIn] = useState("08:30");
  const [requestedPunchOut, setRequestedPunchOut] = useState("17:00");
  const [reason, setReason] = useState("");

  const createMutation = useCreateAdjustmentMutation();
  const { data: adjustmentRequests = [] } = useAdjustmentRequestsQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!record || reason.trim().length < 10) return;

    createMutation.mutate(
      {
        attendanceId: record.id,
        date: record.date,
        requestedPunchIn: requestedPunchIn + " AM",
        requestedPunchOut: requestedPunchOut + " PM",
        reason,
      },
      {
        onSuccess: () => {
          setReason("");
          setActiveTab("history");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
            Attendance Punch Adjustment
          </DialogTitle>
          <div className="flex items-center gap-2 pt-2 border-b border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab("apply")}
              className={`pb-2 px-1 text-xs font-semibold border-b-2 transition-all ${
                activeTab === "apply"
                  ? "border-[#E60076] text-[#E60076]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Request Adjustment
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`pb-2 px-1 text-xs font-semibold border-b-2 transition-all ${
                activeTab === "history"
                  ? "border-[#E60076] text-[#E60076]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              My Requests ({adjustmentRequests.length})
            </button>
          </div>
        </DialogHeader>

        {activeTab === "apply" && record && (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Shift Date:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{record.date} ({record.day})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recorded Punch In:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{record.punchIn || "Missing"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recorded Punch Out:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{record.punchOut || "Missing"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  New Punch In Time
                </label>
                <Input
                  type="time"
                  value={requestedPunchIn}
                  onChange={(e) => setRequestedPunchIn(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  New Punch Out Time
                </label>
                <Input
                  type="time"
                  value={requestedPunchOut}
                  onChange={(e) => setRequestedPunchOut(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Reason for Adjustment <span className="text-rose-500">* (min 10 chars)</span></span>
                <span className="text-[10px] text-slate-400">{reason.length} chars</span>
              </label>
              <Textarea
                placeholder="Explain biometric discrepancy or official client meeting..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                required
                className="text-xs"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={createMutation.isPending}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#E60076] hover:bg-[#d0006a] text-white"
                disabled={createMutation.isPending || reason.trim().length < 10}
              >
                {createMutation.isPending ? "Submitting..." : "Submit to Supervisor"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {activeTab === "history" && (
          <div className="space-y-3 py-2">
            {adjustmentRequests.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No previous adjustment requests found.</p>
            ) : (
              adjustmentRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Date: {req.date}</span>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="text-slate-500">
                    Requested: <strong className="text-slate-700 dark:text-slate-300">{req.requestedPunchIn}</strong> to <strong className="text-slate-700 dark:text-slate-300">{req.requestedPunchOut}</strong>
                  </p>
                  <p className="text-slate-500">
                    <strong>Reason:</strong> {req.reason}
                  </p>
                  {req.decisionComment && (
                    <div className="rounded bg-slate-50 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300">
                      <strong>Supervisor Note:</strong> {req.decisionComment}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

