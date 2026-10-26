"use client";

import React, { useEffect, useState } from "react";
import { Building2, Phone, MapPin, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { DepartmentItem, CreateDepartmentDto, UpdateDepartmentDto } from "@/types/dto/department.dto";

interface DepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDepartmentDto | UpdateDepartmentDto) => Promise<void> | void;
  initialData?: DepartmentItem | null;
  isLoading?: boolean;
}

export function DepartmentModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: DepartmentModalProps) {
  const isEditing = !!initialData;

  const [departmentName, setDepartmentName] = useState("");
  const [location, setLocation] = useState("");
  const [deptPhone, setDeptPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setDepartmentName(initialData.departmentName || "");
      setLocation(initialData.location || "");
      setDeptPhone(initialData.deptPhone || "");
    } else {
      setDepartmentName("");
      setLocation("");
      setDeptPhone("");
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!departmentName.trim()) {
      errs.departmentName = "Department name is required";
    }
    if (!location.trim()) {
      errs.location = "Location is required";
    }
    if (!deptPhone.trim()) {
      errs.deptPhone = "Department phone is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && initialData) {
      await onSubmit({
        id: initialData.id,
        departmentName: departmentName.trim(),
        location: location.trim(),
        deptPhone: deptPhone.trim(),
      });
    } else {
      await onSubmit({
        departmentName: departmentName.trim(),
        location: location.trim(),
        deptPhone: deptPhone.trim(),
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-slate-900 dark:text-white">
                {isEditing ? "Edit Department" : "Create New Department"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing
                  ? "Update department details and office contact information."
                  : "Add an organizational department to manage workforce assignments."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Department Name */}
          <div className="space-y-1.5">
            <Label htmlFor="departmentName" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Department Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="departmentName"
                placeholder="e.g. Marketing, Engineering, HR"
                value={departmentName}
                onChange={(e) => {
                  setDepartmentName(e.target.value);
                  if (errors.departmentName) setErrors((prev) => ({ ...prev, departmentName: "" }));
                }}
                className={`pl-9 text-xs h-10 ${
                  errors.departmentName ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.departmentName && (
              <p className="text-[11px] text-red-500 font-medium">{errors.departmentName}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label htmlFor="deptLocation" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Office Location / Floor <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="deptLocation"
                placeholder="e.g. Building B - Level 3, Colombo 03"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
                }}
                className={`pl-9 text-xs h-10 ${
                  errors.location ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.location && (
              <p className="text-[11px] text-red-500 font-medium">{errors.location}</p>
            )}
          </div>

          {/* Dept Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="deptPhone" className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Department Phone / Extension <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="deptPhone"
                placeholder="e.g. +94 11 234 5678 or Ext 104"
                value={deptPhone}
                onChange={(e) => {
                  setDeptPhone(e.target.value);
                  if (errors.deptPhone) setErrors((prev) => ({ ...prev, deptPhone: "" }));
                }}
                className={`pl-9 text-xs h-10 ${
                  errors.deptPhone ? "border-red-500 focus-visible:ring-red-500" : ""
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.deptPhone && (
              <p className="text-[11px] text-red-500 font-medium">{errors.deptPhone}</p>
            )}
          </div>

          <DialogFooter className="pt-3 gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="text-xs h-9 bg-indigo-600 hover:bg-indigo-500 text-white min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Department"
              ) : (
                "Create Department"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
