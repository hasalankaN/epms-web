"use client";

import React, { useState, useEffect } from "react";

import { toast } from "sonner";

import { AlertCircle, Send } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { AttendanceIssueEmployee } from "@/types/hrDashboard";

interface NotifyAttendanceIssueModalProps {
  employee: AttendanceIssueEmployee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNoticeSent?: (employeeId: string, type: string) => void;
}

export function NotifyAttendanceIssueModal({
  employee,
  open,
  onOpenChange,
  onNoticeSent,
}: NotifyAttendanceIssueModalProps) {
  const [noticeType, setNoticeType] = useState("FIRST_WARNING");
  const [customMessage, setCustomMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (employee) {
      if (employee.severity === "CRITICAL") {
        setNoticeType("FORMAL_WARNING");
        setCustomMessage(
          `Dear ${employee.name},\n\nOur attendance records indicate that you have recorded ${employee.lateCount} late punch-ins and ${employee.absentCount} unexcused absences this month. This violates the EPMS standard working hours compliance policy.\n\nPlease schedule an in-person meeting with HR operations by tomorrow.`
        );
      } else {
        setNoticeType("ADVISORY_NOTICE");
        setCustomMessage(
          `Dear ${employee.name},\n\nThis is a friendly advisory reminder regarding your recent attendance check-in records (${employee.lateCount} late arrivals recorded). Please ensure regular clock-ins within the grace period.`
        );
      }
    }
  }, [employee]);

  if (!employee) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      onOpenChange(false);

      if (onNoticeSent) {
        onNoticeSent(employee.employeeId, noticeType);
      }

      toast.success(
        `Attendance notification dispatched to ${employee.name}! (#34)`
      );
    }, 450);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Notify Employee of Attendance Issue</DialogTitle>
              <DialogDescription>
                Issue compliance notices & warnings for irregular check-ins (#34).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Employee stats card */}
          <div className="p-3.5 rounded-xl border border-red-200/60 bg-red-50/30 dark:border-red-900/40 dark:bg-red-950/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                  {employee.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {employee.employeeId} • {employee.department}
                </p>
              </div>
              <Badge
                variant={
                  employee.severity === "CRITICAL"
                    ? "destructive"
                    : "Pending"
                }
              >
                {employee.severity}
              </Badge>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px]">Lateness Count</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {employee.lateCount} Days Late
                </span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 block text-[10px]">Unexcused Absences</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {employee.absentCount} Days Absent
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Recent: {employee.lastOccurrence}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Notice Classification</Label>
            <Select value={noticeType} onValueChange={setNoticeType}>
              <SelectTrigger>
                <SelectValue placeholder="Select Notice Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADVISORY_NOTICE">
                  Informal Advisory Reminder
                </SelectItem>
                <SelectItem value="FIRST_WARNING">
                  First Attendance Warning (Level 1)
                </SelectItem>
                <SelectItem value="FORMAL_WARNING">
                  Formal Compliance Warning Letter (Level 2)
                </SelectItem>
                <SelectItem value="HR_HEARING_CALL">
                  Mandatory HR Hearing Summons
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notice-body" className="text-xs font-semibold">
              Notice Content
            </Label>
            <Textarea
              id="notice-body"
              rows={4}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="pt-2 flex sm:justify-between items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSending}
            onClick={handleSend}
            className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5"
          >
            <Send className="h-4 w-4" />
            {isSending ? "Sending Notice..." : "Dispatch Notice to Employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
