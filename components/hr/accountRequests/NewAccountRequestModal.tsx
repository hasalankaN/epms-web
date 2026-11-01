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
import { useCreateAccountRequestMutation } from "@/hooks/api/accountRequests/useAccountRequests";
import type { AccountRequestType } from "@/types/dto/accountRequest.dto";

interface NewAccountRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAccountRequestModal({
  open,
  onOpenChange,
}: NewAccountRequestModalProps) {
  const [type, setType] = useState<AccountRequestType>("CREATE_ACCOUNT");
  const [employeeId, setEmployeeId] = useState("EMP-001");
  const [proposedRole, setProposedRole] = useState("EMPLOYEE");
  const [reason, setReason] = useState("");

  const createMutation = useCreateAccountRequestMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    createMutation.mutate(
      {
        type,
        employeeId,
        proposedRole: type !== "DEACTIVATE_ACCOUNT" ? proposedRole : undefined,
        reason,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setReason("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Account Request to Admin</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Request Type</Label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as AccountRequestType)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="CREATE_ACCOUNT">Provision New Portal Account</option>
              <option value="CHANGE_ROLE">Change System Security Role</option>
              <option value="DEACTIVATE_ACCOUNT">Deactivate User Account (Offboarding)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>Employee</Label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="EMP-001">Kavinda Perera (EMP-001) - Production</option>
              <option value="EMP-002">Nuwan Disanayake (EMP-002) - Quality</option>
              <option value="EMP-003">Sanduni Jayawardena (EMP-003) - Sewing</option>
              <option value="EMP-004">Thilina Fernando (EMP-004) - Maintenance</option>
              <option value="EMP-005">Dilani Silva (EMP-005) - Warehouse</option>
            </select>
          </div>

          {type !== "DEACTIVATE_ACCOUNT" && (
            <div className="space-y-1.5">
              <Label>Target System Role</Label>
              <select
                value={proposedRole}
                onChange={(e) => setProposedRole(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="EMPLOYEE">Employee (Self-Service)</option>
                <option value="SUPERVISOR">Supervisor (Line Approvals)</option>
                <option value="HR">HR Officer (Personnel Ops)</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Official Justification</Label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Employee promoted to Assistant Line Lead; requires supervisor roster & approval rights."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

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
              className="bg-[#E60076] hover:bg-[#c40064] text-white"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Submitting..." : "Send to Administrator"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

