"use client";

import React, { useState } from "react";

import { toast } from "sonner";

import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  FileCheck,
  User,
  XCircle,
} from "lucide-react";

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

import type { EscalatedLeaveRequest } from "@/types/hrDashboard";

interface ReviewEscalatedLeaveModalProps {
  request: EscalatedLeaveRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
}

export function ReviewEscalatedLeaveModal({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ReviewEscalatedLeaveModalProps) {
  const [remarks, setRemarks] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!request) return null;

  const handleAction = (isApproved: boolean) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);

      if (isApproved) {
        onApprove(request.id, remarks);
        toast.success(
          `Escalated leave for ${request.employeeName} approved! (#41, #43)`
        );
      } else {
        onReject(request.id, remarks);
        toast.error(
          `Escalated leave for ${request.employeeName} declined.`
        );
      }

      setRemarks("");
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Review Escalated Leave Request</DialogTitle>
              <DialogDescription>
                Supervisor escalated request requiring HR discretionary decision (#41, #43).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Header Card */}
          <div className="p-4 rounded-xl border border-amber-200/60 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                  {request.employeeName}
                </h4>
                <Badge variant="outline" className="text-[11px] font-mono">
                  {request.employeeId}
                </Badge>
              </div>
              <Badge
                variant={
                  request.priority === "URGENT"
                    ? "destructive"
                    : request.priority === "HIGH"
                    ? "Pending"
                    : "secondary"
                }
              >
                {request.priority} Priority
              </Badge>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>Dept: {request.department}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {request.startDate} to {request.endDate} ({request.days} Days)
                </span>
              </div>
            </div>
          </div>

          {/* Leave Type and Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Requested Category
              </span>
              <p className="font-medium text-slate-900 dark:text-white">
                {request.leaveType}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                &ldquo;{request.reason}&rdquo;
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                Supervisor Escalation
              </span>
              <p className="font-medium text-indigo-700 dark:text-indigo-400">
                {request.escalatedBy}
              </p>
              <p className="text-slate-600 dark:text-slate-400 mt-1 italic">
                &ldquo;{request.escalationReason}&rdquo;
              </p>
            </div>
          </div>

          {request.hasAttachment && (
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Supporting Medical / Legal Certificate Attached
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => toast.info("Opening supporting document preview...")}
              >
                View Attachment
              </Button>
            </div>
          )}

          {/* Remarks */}
          <div className="space-y-1.5">
            <Label htmlFor="escalation-remarks" className="text-xs font-semibold">
              HR Decision Notes / Leave Deductions Directive
            </Label>
            <Textarea
              id="escalation-remarks"
              rows={2}
              placeholder="e.g. Approved as Special Paid Leave under exceptional medical clause 4.2..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
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

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isProcessing}
              onClick={() => handleAction(false)}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/30"
            >
              <XCircle className="h-4 w-4 mr-1.5" />
              Decline Leave
            </Button>
            <Button
              type="button"
              disabled={isProcessing}
              onClick={() => handleAction(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Approve Special Leave
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
