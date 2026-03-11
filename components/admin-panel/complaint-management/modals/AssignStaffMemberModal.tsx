"use client";

import React, { useState } from "react";

import { X, UserPlus } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import type { ComplaintDataType } from "@/types/complaint";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

interface AssignStaffMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: ComplaintDataType | null;
}

export function AssignStaffMemberModal({
  isOpen,
  onClose,
  complaint,
}: AssignStaffMemberModalProps) {
  const [staff, setStaff] = useState("");

  if (!complaint) return null;

  const handleSave = () => {
    if (!staff) {
      toast.warning("Please select a staff member");

      return;
    }

    // Handle assignment logic
    toast.success(`Complaint assigned to ${staff}`);

    onClose();
  };

  const FieldLabel = ({ children, required = false }: { children: React.ReactNode; required?: boolean }) => (
    <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block")}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[500px] flex-col gap-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] outline-none [&>button]:hidden">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
              Assign Staff Member
            </DialogTitle>
            <button
              title="Close"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </div>

        {/* ===== FORM ===== */}
        <div className="flex flex-col gap-4">
          
          {/* Staff Member Field */}
          <div className="space-y-1">
            <FieldLabel required>Staff Member</FieldLabel>
            <Select onValueChange={setStaff}>
              <SelectTrigger className={cn(AUTH_INPUT.base, "w-full text-left font-normal")}>
                <SelectValue placeholder={
                   <span className="flex items-center gap-2 text-[#90A1B9]">
                      <UserPlus className="h-4 w-4" />
                      Select a team member
                   </span>
                } />
              </SelectTrigger>
              <SelectContent className="z-[99999999]">
                <SelectItem value="Kalpa Perera">
                  <div className="flex items-center gap-2">
                     <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${"kalpa"}`} alt="avatar" />
                     </div>
                     <span className="text-[#0F172B]">Kalpa Perera</span>
                     <span className="text-[#64748B]">@kalpa</span>
                  </div>
                </SelectItem>
                <SelectItem value="Supun Silva">
                  <div className="flex items-center gap-2">
                     <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${"supun"}`} alt="avatar" />
                     </div>
                     <span className="text-[#0F172B]">Supun Silva</span>
                     <span className="text-[#64748B]">@supun</span>
                  </div>
                </SelectItem>
                <SelectItem value="Ruwini Gomez">
                  <div className="flex items-center gap-2">
                     <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${"ruwini"}`} alt="avatar" />
                     </div>
                     <span className="text-[#0F172B]">Ruwini Gomez</span>
                     <span className="text-[#64748B]">@ruwini</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Spacer */}
          <div className="h-2"></div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              className={cn(BUTTON_STYLES.primary.md, "w-auto px-10 font-inter text-[14px] font-semibold leading-[20px] bg-[#E60076] hover:bg-[#D0006A]")}
            >
              Save
            </Button>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}
