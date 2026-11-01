"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAttendanceRecordMutation } from "@/hooks/api/attendance/useAttendance";
import type { AttendanceRecord } from "@/types/dto/attendance.dto";

interface EditAttendanceRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | null;
}

export function EditAttendanceRecordModal({
  isOpen,
  onClose,
  record,
}: EditAttendanceRecordModalProps) {
  const [punchIn, setPunchIn] = useState("08:30 AM");
  const [punchOut, setPunchOut] = useState("05:00 PM");
  const [reason, setReason] = useState("");

  const updateMutation = useUpdateAttendanceRecordMutation();

  if (!record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    updateMutation.mutate(
      {
        id: record.id,
        payload: { punchIn, punchOut, reason },
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
            Manual Punch Override: {record.employeeName}
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Shift Date: {record.date} ({record.day})
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Adjusted Punch In Time
              </label>
              <Input
                value={punchIn}
                onChange={(e) => setPunchIn(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Adjusted Punch Out Time
              </label>
              <Input
                value={punchOut}
                onChange={(e) => setPunchOut(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Supervisor Justification Reason <span className="text-rose-500">*</span>
            </label>
            <Textarea
              placeholder="State reason for manual time adjustment (e.g. verified client field visit, scanner malfunction)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
              className="text-xs"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={updateMutation.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#E60076] hover:bg-[#d0006a] text-white"
              disabled={updateMutation.isPending || !reason.trim()}
            >
              {updateMutation.isPending ? "Saving..." : "Save Override"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

