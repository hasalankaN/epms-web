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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDecideAccountRequestMutation } from "@/hooks/api/accountRequests/useAccountRequests";
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
  const [adminComment, setAdminComment] = useState("");
  const [username, setUsername] = useState(
    request?.proposedUsername || `emp.${request?.employeeCode?.toLowerCase() || "001"}`
  );
  const [tempPassword, setTempPassword] = useState("Welcome@2026");

  const decideMutation = useDecideAccountRequestMutation();

  if (!request) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (decision === "REJECTED" && !adminComment.trim()) {
      return;
    }

    decideMutation.mutate(
      {
        id: request.id,
        decision,
        adminComment:
          decision === "APPROVED"
            ? `Account provisioned with username: ${username}`
            : adminComment,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setAdminComment("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Account Provisioning Request</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1">
            <p className="font-semibold text-foreground">{request.employeeName} ({request.employeeCode})</p>
            <p className="text-muted-foreground">{request.departmentName} • Requested by: {request.requestedBy}</p>
            <p className="text-muted-foreground"><span className="font-medium text-foreground">Action:</span> {request.type.replace("_", " ")}</p>
            <p className="text-muted-foreground"><span className="font-medium text-foreground">Requested Role:</span> {request.proposedRole || "Default"}</p>
            <p className="text-muted-foreground"><span className="font-medium text-foreground">HR Justification:</span> {request.reason}</p>
          </div>

          <div className="space-y-2">
            <Label>Administrative Decision</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision("APPROVED")}
                className={`py-2 rounded-lg border text-xs font-semibold transition-colors ${
                  decision === "APPROVED"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                Approve & Provision
              </button>

              <button
                type="button"
                onClick={() => setDecision("REJECTED")}
                className={`py-2 rounded-lg border text-xs font-semibold transition-colors ${
                  decision === "REJECTED"
                    ? "bg-red-50 border-red-500 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                Reject Request
              </button>
            </div>
          </div>

          {decision === "APPROVED" ? (
            <div className="space-y-3 pt-1 border-t">
              <div className="space-y-1.5">
                <Label>Generated Login Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Temporary Initial Password</Label>
                <Input
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 pt-1 border-t">
              <Label>Rejection Audit Comment (Mandatory)</Label>
              <textarea
                rows={3}
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder="Specify reason for decline (e.g. Incompatible role segregation of duties)..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={
                decision === "APPROVED"
                  ? "bg-[#E60076] hover:bg-[#c40064] text-white"
                  : "bg-destructive hover:bg-destructive/90 text-white"
              }
              disabled={decideMutation.isPending}
            >
              {decideMutation.isPending
                ? "Processing..."
                : decision === "APPROVED"
                ? "Provision Account"
                : "Reject Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

