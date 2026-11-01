"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ChangeRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: { id: string; name: string; role?: string } | null;
  onSuccess: (empId: string, newRole: string) => void;
}

export function ChangeRoleModal({
  isOpen,
  onClose,
  employee,
  onSuccess,
}: ChangeRoleModalProps) {
  const [role, setRole] = useState(employee?.role || "EMPLOYEE");

  if (!employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(employee.id, role);
    toast.success(`Role updated to ${role} for ${employee.name}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
            Change System Access Role
          </DialogTitle>
          <p className="text-xs text-slate-500">Employee: {employee.name}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              System Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-pink-500"
            >
              <option value="EMPLOYEE">Employee (Standard Self-Service)</option>
              <option value="SUPERVISOR">Supervisor (Team Leader Access)</option>
              <option value="HR">HR Manager (HR Management Access)</option>
              <option value="ADMIN">Administrator (Full Admin Access)</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#E60076] hover:bg-[#d0006a] text-white">
              Save Role
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

