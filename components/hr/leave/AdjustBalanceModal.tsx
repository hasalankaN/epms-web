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
import { toast } from "sonner";
import { useAdjustLeaveBalanceMutation } from "@/hooks/api/leaves/useLeaves";
import type { LeaveType } from "@/types/dto/leave.dto";

interface AdjustBalanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultEmployee?: { id: string; name: string; code: string };
}

export function AdjustBalanceModal({
  open,
  onOpenChange,
  defaultEmployee,
}: AdjustBalanceModalProps) {
  const [employeeId, setEmployeeId] = useState(defaultEmployee?.id || "EMP-001");
  const [leaveType, setLeaveType] = useState<LeaveType>("ANNUAL");
  const [newBalance, setNewBalance] = useState("14");
  const [reason, setReason] = useState("");

  const adjustMutation = useAdjustLeaveBalanceMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Mandatory adjustment reason is required for compliance audit.");
      return;
    }

    adjustMutation.mutate(
      {
        employeeId,
        leaveType,
        newBalance: parseFloat(newBalance) || 0,
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
          <DialogTitle>Adjust Employee Leave Balance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="adjEmp">Employee</Label>
            <Input
              id="adjEmp"
              value={defaultEmployee ? `${defaultEmployee.name} (${defaultEmployee.code})` : employeeId}
              disabled={Boolean(defaultEmployee)}
              onChange={(e) => setEmployeeId(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="adjType">Leave Type</Label>
              <select
                id="adjType"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="ANNUAL">Annual Leave</option>
                <option value="CASUAL">Casual Leave</option>
                <option value="MEDICAL">Medical Leave</option>
                <option value="SPECIAL">Special Leave</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="newDays">New Remaining Days</Label>
              <Input
                id="newDays"
                type="number"
                step="0.5"
                min="0"
                max="90"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="adjReason">Audit Reason for Adjustment *</Label>
            <textarea
              id="adjReason"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g., Prior year carryover reconciliation, Disciplinary reduction, Compensatory credit"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
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
              disabled={adjustMutation.isPending}
            >
              {adjustMutation.isPending ? "Saving..." : "Save Adjustment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

