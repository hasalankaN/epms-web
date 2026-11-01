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
import { useApplyLeaveMutation } from "@/hooks/api/leaves/useLeaves";

interface SpecialLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpecialLeaveModal({ open, onOpenChange }: SpecialLeaveModalProps) {
  const [employeeCode, setEmployeeCode] = useState("EMP-001");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const applyMutation = useApplyLeaveMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate || !reason.trim()) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    applyMutation.mutate(
      {
        type: "SPECIAL",
        fromDate,
        toDate,
        reason: `[Granted by HR for ${employeeCode}] ${reason}`,
        note: note || undefined,
      },
      {
        onSuccess: () => {
          toast.success(`Special leave granted to ${employeeCode}`);
          onOpenChange(false);
          setReason("");
          setNote("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Grant Special Leave</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="empSelect">Employee</Label>
            <select
              id="empSelect"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="EMP-001">Kavinda Perera (EMP-001) - Production</option>
              <option value="EMP-002">Nuwan Disanayake (EMP-002) - Quality Assurance</option>
              <option value="EMP-003">Sanduni Jayawardena (EMP-003) - Cutting & Sewing</option>
              <option value="EMP-004">Thilina Fernando (EMP-004) - Maintenance</option>
              <option value="EMP-005">Dilani Silva (EMP-005) - Warehouse & Logistics</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="specFrom">From Date</Label>
              <Input
                id="specFrom"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="specTo">To Date</Label>
              <Input
                id="specTo"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="specReason">Official Justification / Reason</Label>
            <Input
              id="specReason"
              placeholder="e.g. Bereavement, National sports representation, Compassionate"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="specNote">Internal HR Note (Optional)</Label>
            <textarea
              id="specNote"
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Special board approval or documentation references..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
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
              disabled={applyMutation.isPending}
            >
              {applyMutation.isPending ? "Granting..." : "Grant Special Leave"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

