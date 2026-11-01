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
import { useCreateBonusMutation } from "@/hooks/api/salary/useSalary";

interface AddBonusModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBonusModal({ open, onOpenChange }: AddBonusModalProps) {
  const [employeeId, setEmployeeId] = useState("EMP-001");
  const [month, setMonth] = useState("2026-03");
  const [amount, setAmount] = useState("15000");
  const [description, setDescription] = useState("");

  const createMutation = useCreateBonusMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    createMutation.mutate(
      {
        employeeId,
        month,
        amount: parseFloat(amount) || 0,
        description,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setDescription("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Allocate Employee Bonus / Special Allowance</DialogTitle>
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
              <option value="EMP-005">Dilani Silva (EMP-005) - Warehouse</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Payroll Month</Label>
              <Input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label>Bonus Amount (LKR)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Bonus Description / Reason</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Sinhala/Tamil New Year Bonus, Peak Production Incentive"
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
              {createMutation.isPending ? "Allocating..." : "Allocate Bonus"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

