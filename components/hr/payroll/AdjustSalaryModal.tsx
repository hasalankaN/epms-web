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
import { useAdjustSalaryMutation } from "@/hooks/api/salary/useSalary";
import type { EmployeeSalaryRecord } from "@/types/dto/salary.dto";

interface AdjustSalaryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeRecord?: EmployeeSalaryRecord | null;
}

export function AdjustSalaryModal({
  open,
  onOpenChange,
  employeeRecord,
}: AdjustSalaryModalProps) {
  const [basicSalary, setBasicSalary] = useState(
    employeeRecord ? String(employeeRecord.basicSalary) : "75000"
  );
  const [effectiveDate, setEffectiveDate] = useState("2026-04-01");
  const [reason, setReason] = useState("");

  const adjustMutation = useAdjustSalaryMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      return;
    }

    adjustMutation.mutate(
      {
        employeeId: employeeRecord?.employeeId || "EMP-001",
        newBasicSalary: parseFloat(basicSalary) || 0,
        effectiveDate,
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
          <DialogTitle>Adjust Employee Base Compensation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Target Employee</Label>
            <Input
              value={
                employeeRecord
                  ? `${employeeRecord.employeeName} (${employeeRecord.employeeCode})`
                  : "Kavinda Perera (EMP-001)"
              }
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>New Basic Salary (LKR)</Label>
              <Input
                type="number"
                value={basicSalary}
                onChange={(e) => setBasicSalary(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Effective Date</Label>
              <Input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Mandatory Audit Reason / Approval Authority</Label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Annual merit review +12%, Promotion to Senior Technician, Board approval doc ref #2026-PAY-88"
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
              disabled={adjustMutation.isPending}
            >
              {adjustMutation.isPending ? "Adjusting..." : "Confirm Salary Adjustment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

