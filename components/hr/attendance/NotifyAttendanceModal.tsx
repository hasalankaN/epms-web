"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bell } from "lucide-react";
import { toast } from "sonner";
import type { AttendanceRecord } from "@/types/dto/attendance.dto";

interface NotifyAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecords: AttendanceRecord[];
}

export function NotifyAttendanceModal({
  isOpen,
  onClose,
  selectedRecords,
}: NotifyAttendanceModalProps) {
  const [issueType, setIssueType] = useState<"LATE" | "EARLY" | "ABSENT" | "MISSING">("LATE");
  const [message, setMessage] = useState(
    "Please be informed that your check-in time was flagged. Kindly verify your punch with your supervisor or submit an adjustment request."
  );

  const recipientNames = Array.from(
    new Set(selectedRecords.map((r) => r.employeeName || "Employee"))
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Dispatched attendance notifications to ${recipientNames.length} employees.`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-[#E60076]" />
            Notify Employees of Attendance Discrepancy
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Send immediate email & portal alerts to selected employees.
          </p>
        </DialogHeader>

        <form onSubmit={handleSend} className="space-y-4 py-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Discrepancy Category
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value as any)}
              className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-pink-500"
            >
              <option value="LATE">Late Arrival Notice</option>
              <option value="EARLY">Early Departure Inquiry</option>
              <option value="ABSENT">Unexplained Absence Warning</option>
              <option value="MISSING">Missing Punch Out Biometric</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Recipients ({recipientNames.length})
            </label>
            <div className="mt-1 max-h-20 overflow-y-auto rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2 border border-slate-200 dark:border-slate-800 flex flex-wrap gap-1">
              {recipientNames.map((name, i) => (
                <span
                  key={i}
                  className="rounded bg-white dark:bg-slate-900 px-2 py-0.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Notification Message
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              className="text-xs"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#E60076] hover:bg-[#d0006a] text-white gap-1.5">
              <Send className="h-3.5 w-3.5" /> Send Notifications
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

