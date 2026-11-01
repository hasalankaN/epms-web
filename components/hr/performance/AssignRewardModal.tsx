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
import { useAssignRewardMutation } from "@/hooks/api/performance/usePerformance";

interface AssignRewardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignRewardModal({
  open,
  onOpenChange,
}: AssignRewardModalProps) {
  const [employeeId, setEmployeeId] = useState("EMP-001");
  const [type, setType] = useState<"BONUS" | "INCENTIVE" | "RECOGNITION">("BONUS");
  const [amount, setAmount] = useState("25000");
  const [reason, setReason] = useState("");

  const assignMutation = useAssignRewardMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assignMutation.mutate(
      {
        employeeId,
        type,
        amount: amount ? parseFloat(amount) : undefined,
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
          <DialogTitle>Assign Employee Reward / Recognition</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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
              <option value="EMP-005">Dilani Silva (EMP-005) - Logistics</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Reward Category</Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="BONUS">Quarterly Merit Bonus</option>
                <option value="INCENTIVE">Production Target Incentive</option>
                <option value="RECOGNITION">Employee of the Month Citation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>Amount (LKR)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Citation & Justification</Label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Achieved 118% monthly production quota with 0% defects across high-volume export order."
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
              disabled={assignMutation.isPending}
            >
              {assignMutation.isPending ? "Assigning..." : "Award Reward"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

