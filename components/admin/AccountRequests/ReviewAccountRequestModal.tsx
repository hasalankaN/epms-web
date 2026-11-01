"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  useAcceptEmployeeRequestMutation,
  useRejectEmployeeRequestMutation,
} from "@/hooks/api/accountRequests/useAccountRequests";
import type { AccountRequestItem } from "@/types/dto/accountRequest.dto";

interface ReviewAccountRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: AccountRequestItem | null;
}

export function ReviewAccountRequestModal({
  open,
  onOpenChange,
  request,
}: ReviewAccountRequestModalProps) {
  const [decision, setDecision] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [rejectReason, setRejectReason] = useState("");

  const acceptMutation = useAcceptEmployeeRequestMutation();
  const rejectMutation = useRejectEmployeeRequestMutation();

  if (!request) return null;

  const isPending = acceptMutation.isPending || rejectMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (decision === "REJECTED") {
      if (!rejectReason.trim()) return;
      rejectMutation.mutate(
        { id: request.id, reason: rejectReason.trim() },
        {
          onSuccess: () => {
            onOpenChange(false);
            setRejectReason("");
          },
        }
      );
    } else {
      acceptMutation.mutate(request.id, {
        onSuccess: () => {
          onOpenChange(false);
          setRejectReason("");
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Review Employee Account Request
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Summary Banner */}
          <div className="p-4 bg-muted/40 rounded-xl border space-y-2 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-foreground">
                  {request.employeeName}
                </p>
                <p className="text-muted-foreground font-mono">
                  {request.employeeCode} · {request.employeeEmail}
                </p>
              </div>
              <Badge variant="outline" className="text-[#E60076] border-[#E60076]/30">
                {request.proposedRole || "EMPLOYEE"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t text-[11px]">
              <p>
                <span className="font-semibold text-muted-foreground">Department:</span>{" "}
                <span className="text-foreground">{request.departmentName}</span>
              </p>
              <p>
                <span className="font-semibold text-muted-foreground">Position:</span>{" "}
                <span className="text-foreground">{request.positionName || "Team Lead"}</span>
              </p>
              {request.mobileNo && (
                <p>
                  <span className="font-semibold text-muted-foreground">Mobile:</span>{" "}
                  <span className="text-foreground">{request.mobileNo}</span>
                </p>
              )}
              {request.joinDate && (
                <p>
                  <span className="font-semibold text-muted-foreground">Join Date:</span>{" "}
                  <span className="text-foreground">{request.joinDate}</span>
                </p>
              )}
              <p className="col-span-2">
                <span className="font-semibold text-muted-foreground">Requested By:</span>{" "}
                <span className="text-foreground">{request.requestedBy} ({new Date(request.requestedAt).toLocaleDateString()})</span>
              </p>
            </div>
          </div>

          {/* Qualifications & Relatives if present */}
          {request.qualifications && request.qualifications.length > 0 && (
            <div className="space-y-1 text-xs">
              <Label className="text-[11px] font-semibold text-muted-foreground uppercase">
                Qualifications
              </Label>
              <div className="p-2.5 rounded-lg border bg-background space-y-1">
                {request.qualifications.map((q: any, i: number) => (
                  <p key={i} className="text-xs">
                    <span className="font-medium text-foreground">{q.qualification_title}</span>
                    <span className="text-muted-foreground"> — {q.institute} ({q.completed_year})</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Decision Selector */}
          <div className="space-y-2 pt-1">
            <Label className="text-xs font-semibold">Administrative Decision</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision("APPROVED")}
                className={`py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  decision === "APPROVED"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                ✓ Approve & Create Account
              </button>

              <button
                type="button"
                onClick={() => setDecision("REJECTED")}
                className={`py-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  decision === "REJECTED"
                    ? "bg-red-50 border-red-500 text-red-700 dark:bg-red-950/40 dark:text-red-300 ring-2 ring-red-500/20"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                ✕ Reject Request
              </button>
            </div>
          </div>

          {decision === "REJECTED" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Rejection Reason</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="State the reason for rejecting this employee request..."
                rows={3}
                required
                className="text-xs"
              />
            </div>
          )}

          {decision === "APPROVED" && (
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 space-y-1 border border-emerald-200 dark:border-emerald-900/40">
              <p className="font-semibold">Automated Provisioning</p>
              <p className="text-[11px] leading-relaxed">
                Approving this request will immediately create the employee record and portal account, email login credentials to <strong className="underline">{request.employeeEmail}</strong>, and notify HR.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className={
                decision === "APPROVED"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {isPending
                ? "Processing..."
                : decision === "APPROVED"
                  ? "Confirm Approval"
                  : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
