"use client";

import React, { useEffect, useState } from "react";

import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { cn } from "@/lib/utils";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { useUpdateStaffPrivileges } from "@/hooks/api/staff/useUpdateStaffPrivileges";

const PRIVILEGES = [
  { value: "all", label: "All Privileges" },
  { value: "user_management", label: "User Management" },
  { value: "course_management", label: "Course Management" },
  { value: "branch_management", label: "Branch Management" },
] as const;

interface StaffPrivilegesModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffId: string;
  staffName: string;
  currentPrivileges: string[];
}

export function StaffPrivilegesModal({
  isOpen,
  onClose,
  staffId,
  staffName,
  currentPrivileges,
}: StaffPrivilegesModalProps) {
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);
  const { mutateAsync: updatePrivileges, isPending } = useUpdateStaffPrivileges(staffId);

  useEffect(() => {
    if (isOpen) {
      setSelectedPrivileges(currentPrivileges || []);
    }
  }, [isOpen, currentPrivileges]);

  const togglePrivilege = (value: string) => {
    setSelectedPrivileges((prev) => {
      if (value === "all") {
        return prev.includes("all") ? [] : ["all", "user_management", "course_management", "branch_management"];
      }
      
      const newSelection = prev.includes(value)
        ? prev.filter((p) => p !== value && p !== "all")
        : [...prev, value];
      
      // If all individual privileges are selected, also select "all"
      const individualPrivs = ["user_management", "course_management", "branch_management"];
      const allSelected = individualPrivs.every(p => newSelection.includes(p));
      
      if (allSelected && !newSelection.includes("all")) {
        return [...newSelection, "all"];
      }
      
      return newSelection;
    });
  };

  const handleSave = async () => {
    try {
      await updatePrivileges({ privilege_codes: selectedPrivileges });
      onClose();
    } catch (error) {
      console.error("Failed to update privileges:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        animateChildren={true}
        className="flex max-h-[90vh] w-[95%] max-w-[500px] flex-col gap-0 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
      >
        {/* HEADER */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 p-4 sm:p-6 pb-0 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              Update Privileges - {staffName}
            </DialogTitle>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </motion.div>

        {/* BODY */}
        <motion.div variants={itemVariants} className="flex-1 overflow-y-auto p-4 sm:p-6 sm:pt-2 pt-2 custom-scrollbar">
          <div className="grid grid-cols-1 gap-4">
            {PRIVILEGES.map((priv) => (
              <div
                key={priv.value}
                className="flex items-center space-x-3 rounded-lg border border-[#E2E8F0] p-3 transition-colors hover:bg-slate-50"
              >
                <Checkbox
                  id={`priv-${priv.value}`}
                  checked={selectedPrivileges.includes(priv.value)}
                  onCheckedChange={() => togglePrivilege(priv.value)}
                  className="data-[state=checked]:bg-[#0F172B] data-[state=checked]:border-[#0F172B]"
                />
                <label
                  htmlFor={`priv-${priv.value}`}
                  className="text-sm font-medium leading-none text-[#45556C] cursor-pointer"
                >
                  {priv.label}
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FOOTER */}
        <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-[#E2E8F0] mt-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className={cn(
              BUTTON_STYLES.secondary.md,
              "font-inter text-[14px] font-semibold text-[#0F172B] hover:bg-slate-100 bg-[#F1F5F9]"
            )}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending}
            className={cn(
              BUTTON_STYLES.primary.md,
              "px-6 font-inter text-[14px] font-semibold text-white leading-5"
            )}
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
