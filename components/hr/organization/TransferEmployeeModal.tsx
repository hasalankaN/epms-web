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
import { toast } from "sonner";

interface TransferEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TransferEmployeeModal({
  open,
  onOpenChange,
  onSuccess,
}: TransferEmployeeModalProps) {
  const [employee, setEmployee] = useState("EMP-001");
  const [targetDept, setTargetDept] = useState("Quality Assurance");
  const [targetSupervisor, setTargetSupervisor] = useState("Mahesh Wickramasinghe");
  const [effectiveDate, setEffectiveDate] = useState("2026-04-01");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please enter the organizational transfer rationale.");
      return;
    }

    toast.success(
      `Transfer order issued for ${employee} to ${targetDept} effective ${effectiveDate}!`
    );
    onOpenChange(false);
    setReason("");
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transfer Employee / Reassign Section</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Select Employee</Label>
            <select
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="EMP-001">Kavinda Perera (EMP-001) - Production</option>
              <option value="EMP-002">Nuwan Disanayake (EMP-002) - Quality</option>
              <option value="EMP-003">Sanduni Jayawardena (EMP-003) - Sewing</option>
              <option value="EMP-004">Thilina Fernando (EMP-004) - Maintenance</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Target Department</Label>
              <select
                value={targetDept}
                onChange={(e) => setTargetDept(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Production Line A">Production Line A</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Cutting & Sewing">Cutting & Sewing</option>
                <option value="Warehouse & Logistics">Warehouse & Logistics</option>
                <option value="Maintenance">Maintenance & Engineering</option>
              </select>
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
            <Label>New Reporting Supervisor</Label>
            <select
              value={targetSupervisor}
              onChange={(e) => setTargetSupervisor(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Mahesh Wickramasinghe">Mahesh Wickramasinghe (QA Lead)</option>
              <option value="Chandana Gunasekara">Chandana Gunasekara (Production Mgr)</option>
              <option value="Saman Ratnayake">Saman Ratnayake (Warehouse Head)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>Reason & Official Transfer Note</Label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Line rebalancing for export sportswear order; cross-functional skill advancement"
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
            >
              Authorize Transfer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

