"use client";

import React, { useState, useEffect } from "react";
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
import { useUpdateLeavePolicyMutation } from "@/hooks/api/leaves/useLeaves";
import type { LeavePolicy } from "@/types/dto/leave.dto";

interface EditPolicyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: LeavePolicy | null;
}

export function EditPolicyModal({
  open,
  onOpenChange,
  policy,
}: EditPolicyModalProps) {
  const [daysPerYear, setDaysPerYear] = useState(14);
  const [carryForward, setCarryForward] = useState(false);
  const [maxCarryForwardDays, setMaxCarryForwardDays] = useState(0);
  const [rulesDescription, setRulesDescription] = useState("");

  const updateMutation = useUpdateLeavePolicyMutation();

  useEffect(() => {
    if (policy) {
      setDaysPerYear(policy.daysPerYear);
      setCarryForward(policy.carryForward);
      setMaxCarryForwardDays(policy.maxCarryForwardDays);
      setRulesDescription(policy.rulesDescription);
    }
  }, [policy]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policy) return;

    updateMutation.mutate(
      {
        id: policy.id,
        payload: {
          daysPerYear: Number(daysPerYear),
          carryForward,
          maxCarryForwardDays: carryForward ? Number(maxCarryForwardDays) : 0,
          rulesDescription,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  if (!policy) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Policy: {policy.label}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="polDays">Annual Quota (Days per year)</Label>
            <Input
              id="polDays"
              type="number"
              min="0"
              max="120"
              value={daysPerYear}
              onChange={(e) => setDaysPerYear(Number(e.target.value))}
              required
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="carryCheck"
              checked={carryForward}
              onChange={(e) => setCarryForward(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#E60076] focus:ring-[#E60076]"
            />
            <Label htmlFor="carryCheck" className="text-sm font-medium cursor-pointer">
              Allow Carry Forward to Next Financial Year
            </Label>
          </div>

          {carryForward && (
            <div className="space-y-1.5 pl-6 border-l-2 border-primary/20">
              <Label htmlFor="maxCarry">Max Carry Forward Cap (Days)</Label>
              <Input
                id="maxCarry"
                type="number"
                min="1"
                max="30"
                value={maxCarryForwardDays}
                onChange={(e) => setMaxCarryForwardDays(Number(e.target.value))}
                required={carryForward}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="polDesc">Rules & Eligibility Notes</Label>
            <textarea
              id="polDesc"
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={rulesDescription}
              onChange={(e) => setRulesDescription(e.target.value)}
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
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Updating..." : "Save Policy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

