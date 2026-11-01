"use client";

import React, { useState } from "react";

import { toast } from "sonner";

import { CheckCircle2, XCircle, UserCheck, ArrowRight } from "lucide-react";

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

import type { ProfileUpdateRequest } from "@/types/hrDashboard";

interface ReviewProfileUpdateModalProps {
  request: ProfileUpdateRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
}

export function ReviewProfileUpdateModal({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: ReviewProfileUpdateModalProps) {
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
          `Profile updates for ${request.employeeName} approved! (#30)`
        );
      } else {
        onReject(request.id, remarks);
        toast.error(
          `Profile update request for ${request.employeeName} rejected.`
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
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Review Profile Update Request</DialogTitle>
              <DialogDescription>
                Validate employee self-service changes against master HR files (#30).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Employee Header */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                  {request.employeeName}
                </h4>
                <Badge variant="outline" className="text-[11px] font-mono">
                  {request.employeeId}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {request.department} Department • Submitted: {request.requestDate}
              </p>
            </div>
            <Badge variant="Pending">Pending HR Approval</Badge>
          </div>

          {/* Diff comparison table */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Requested Modifications (Current vs New)
            </Label>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
              {request.changes.map((change, idx) => (
                <div key={idx} className="p-3 text-xs grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                  <div className="md:col-span-2 font-medium text-slate-600 dark:text-slate-400">
                    {change.field}
                  </div>
                  <div className="md:col-span-3 flex items-center gap-2 flex-wrap">
                    <span className="line-through text-red-500/80 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded text-[11px]">
                      {change.oldValue}
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded text-[11px]">
                      {change.newValue}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Remark */}
          <div className="space-y-1.5">
            <Label htmlFor="review-remarks" className="text-xs font-semibold">
              HR Officer Notes / Reason (Optional for Rejection)
            </Label>
            <Textarea
              id="review-remarks"
              rows={2}
              placeholder="e.g. Verified with NIC/utility bill copy..."
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
              Reject Request
            </Button>
            <Button
              type="button"
              disabled={isProcessing}
              onClick={() => handleAction(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Approve & Update Roster
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
