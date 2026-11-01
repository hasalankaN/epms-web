"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { HrEmployeeRecord } from "./HrEmployeeDirectoryView";

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: HrEmployeeRecord | null;
  onSuccess: (updated: HrEmployeeRecord) => void;
}

export function EditEmployeeModal({
  isOpen,
  onClose,
  employee,
  onSuccess,
}: EditEmployeeModalProps) {
  const [name, setName] = useState(employee?.name || "");
  const [department, setDepartment] = useState(employee?.department || "Technology");
  const [position, setPosition] = useState(employee?.position || "Senior Software Engineer");
  const [status, setStatus] = useState(employee?.status || "ACTIVE");

  if (!employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: HrEmployeeRecord = {
      ...employee,
      name,
      department,
      position,
      status: status as any,
    };
    onSuccess(updated);
    toast.success(`Employee details updated for ${name}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
            Edit Employee Record
          </DialogTitle>
          <p className="text-xs text-slate-500">Employee Code: {employee.code}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-pink-500"
              >
                <option value="Technology">Technology</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Position</label>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Employment Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "ACTIVE" | "INACTIVE" | "ON_LEAVE")}
              className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-pink-500"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="ON_LEAVE">ON LEAVE</option>
            </select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#E60076] hover:bg-[#d0006a] text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
