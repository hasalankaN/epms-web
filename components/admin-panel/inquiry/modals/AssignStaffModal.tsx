"use client";

import React, { useState } from "react";

import { format } from "date-fns";
import { X, CalendarDays as CalendarIcon, UserPlus } from "lucide-react";

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";

import { cn } from "@/lib/utils";
import type { InquiryDataType } from "@/types/inquiry";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: InquiryDataType | null;
}

export function AssignStaffModal({
  isOpen,
  onClose,
  inquiry,
}: AssignStaffModalProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [staff, setStaff] = useState("");

  if (!inquiry) return null;

  const handleAddMember = () => {
    // Handle assignment logic
    console.log("Assigning staff", staff, "Date", date);
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
          
          {/* Assign Staff Field */}
          <div className="space-y-1">
            <FieldLabel required>Assign Staff</FieldLabel>
            <Select onValueChange={setStaff}>
              <SelectTrigger className={cn(AUTH_INPUT.base, "w-full text-left font-normal")}>
                <SelectValue placeholder={
                   <span className="flex items-center gap-2 text-[#90A1B9] italic">
                      <UserPlus className="h-4 w-4" />
                      Select a team member
                   </span>
                } />
              </SelectTrigger>
              <SelectContent className="z-[99999999]">
                <SelectItem value="kalpa">
                  <div className="flex items-center gap-2">
                     <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${"kalpa"}`} alt="avatar" />
                     </div>
                     <span className="text-[#0F172B]">Kalpa Perera</span>
                     <span className="text-[#64748B]">@kalpa</span>
                  </div>
                </SelectItem>
                <SelectItem value="supun">
                  <div className="flex items-center gap-2">
                     <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${"supun"}`} alt="avatar" />
                     </div>
                     <span className="text-[#0F172B]">Supun Silva</span>
                     <span className="text-[#64748B]">@supun</span>
                  </div>
                </SelectItem>
                <SelectItem value="ruwini">
                  <div className="flex items-center gap-2">
                     <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${"ruwini"}`} alt="avatar" />
                     </div>
                     <span className="text-[#0F172B]">Ruwini Gomez</span>
                     <span className="text-[#64748B]">@ruwini</span>
                  </div>
                </SelectItem>
                <SelectItem value="maneesha">
                  <div className="flex items-center gap-2">
                     <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden shrink-0">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${"maneesha"}`} alt="avatar" />
                     </div>
                     <span className="text-[#0F172B]">Maneesha Fernando</span>
                     <span className="text-[#64748B]">@maneesha</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Next Follow-Up Date Field */}
          <div className="space-y-1">
            <FieldLabel>Next Follow-Up Date</FieldLabel>
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex h-10 w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white hover:bg-slate-50 transition-colors">
                   <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
                      <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                   </div>
                   <input 
                     value={date ? format(date, "dd/MM/yyyy") : ""} 
                     readOnly
                     placeholder="Pick a date"
                     className={cn(
                       "flex-1 cursor-pointer bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic pointer-events-none"
                     )}
                   />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[99999999]" align="start">
                <DateRangeCalendar
                  mode="single"
                  startDate={date || null}
                  endDate={null}
                  onDateChange={(start) => setDate(start || undefined)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Spacer */}
          <div className="h-2"></div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleAddMember}
              className={cn(BUTTON_STYLES.primary.full, "w-auto px-6 font-inter text-[14px] font-semibold leading-[20px]")}
            >
              Add Member
            </Button>
          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}
