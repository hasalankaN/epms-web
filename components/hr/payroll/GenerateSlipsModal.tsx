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
import { Input } from "@/components/ui/input";
import { useGenerateSalarySlipsMutation } from "@/hooks/api/salary/useSalary";

interface GenerateSlipsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GenerateSlipsModal({
  open,
  onOpenChange,
}: GenerateSlipsModalProps) {
  const [month, setMonth] = useState("2026-03");
  const generateMutation = useGenerateSalarySlipsMutation();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateMutation.mutate(month, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Monthly Salary Slips</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleGenerate} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Payroll Cycle Month</Label>
            <Input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>

          <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1.5 text-muted-foreground">
            <p className="font-semibold text-foreground">Statutory Payroll Deductions Automatically Computed:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>EPF Employee Contribution: 8% of Basic Salary</li>
              <li>EPF Employer Contribution: 12% of Basic Salary</li>
              <li>ETF Employer Contribution: 3% of Basic Salary</li>
              <li>Overtime calculation verified from biometric attendance times</li>
              <li>No-pay leave deductions synchronized from Leave Module</li>
            </ul>
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
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? "Generating..." : "Generate Slips For All Staff"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

