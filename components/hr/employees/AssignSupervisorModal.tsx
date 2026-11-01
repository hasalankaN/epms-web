"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AssignSupervisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: { id: string; name: string; supervisor: string } | null;
  onSuccess: (empId: string, newSupervisor: string) => void;
}

export function AssignSupervisorModal({
  isOpen,
  onClose,
  employee,
  onSuccess,
}: AssignSupervisorModalProps) {
  const [supervisor, setSupervisor] = useState("Kanishka Bandara");

  if (!employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(employee.id, supervisor);
    toast.success(`Supervisor updated to ${supervisor} for ${employee.name}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
            Assign Reporting Supervisor
          </DialogTitle>
          <p className="text-xs text-slate-500">Employee: {employee.name}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Select Supervisor
            </label>
            <select
              value={supervisor}
              onChange={(e) => setSupervisor(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-pink-500"
            >
              <option value="Kanishka Bandara">Kanishka Bandara (Lead Architect - Tech)</option>
              <option value="Dr. Asanka Pathirana">Dr. Asanka Pathirana (VP Engineering)</option>
              <option value="Chamari Atapattu">Chamari Atapattu (HR Manager)</option>
              <option value="Rohan De Silva">Rohan De Silva (Finance Director)</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#E60076] hover:bg-[#d0006a] text-white">
              Assign Supervisor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

