"use client";

import React, { useState, useEffect } from "react";

import { X, CalendarDays as CalendarIcon, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface InquiryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: InquiryDataType | null;
}

export function InquiryDetailsModal({
  isOpen,
  onClose,
  inquiry,
}: InquiryDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date()); // Placeholder for follow-up date
  
  // Reset state when modal opens/closes or inquiry changes
  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);

      // In a real app, parse inquiry.followUp to Date
    }
  }, [isOpen, inquiry]);

  if (!inquiry) return null;

  const handleUpdate = () => {
    toast.success("Inquiry updated successfully");
    setIsEditing(false);

    // onUpdate(formData) could be called here
  };

  const handleDiscard = () => {
    setIsEditing(false);

    // Reset form data logic here
  };

  // Helper to render label with asterisk
  const FieldLabel = ({ children, required = false }: { children: React.ReactNode; required?: boolean }) => (
    <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block")}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[720px] flex-col gap-4 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden">
        {/* ===== HEADER ===== */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
              {isEditing ? "Edit Inquiry" : "View Inquiry"}
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

        {/* ===== BODY ===== */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-6">
            {/* Row 1 */}
            <div className="space-y-1">
              <FieldLabel required>Student Name</FieldLabel>
              <Input
                defaultValue={inquiry.name}
                disabled={!isEditing}
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  !isEditing && "bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100 disabled:cursor-default"
                )}
                placeholder="Enter Student Name"
              />
            </div>
            <div className="space-y-1">
              <FieldLabel>Next Follow-Up Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild disabled={!isEditing}>
                  <div className={cn(
                      "flex h-10 w-full items-center rounded-md border border-gray-300 bg-white transition-all hover:bg-slate-50 cursor-pointer",
                       !isEditing && "bg-[#F1F5F9] border-transparent pointer-events-none cursor-default"
                  )}>
                     <div className="flex h-full items-center justify-center px-3 border-r border-slate-200">
                        <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                     </div>
                     <input 
                       title="Next Follow-Up Date"
                       value={date ? format(date, "dd/MM/yyyy") : ""} 
                       readOnly
                       disabled
                       className={cn(
                         "flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400 pointer-events-none text-[#0F172B]",
                         !isEditing && "disabled:cursor-default" 
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

            {/* Row 2 */}
            <div className="space-y-1">
              <FieldLabel required>Mobile Number</FieldLabel>
              <div className={cn(
                  "flex h-10 w-full items-center rounded-md border border-gray-300 bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                  !isEditing && "bg-[#F1F5F9] border-transparent"
              )}>
                 {isEditing ? (
                    <Select defaultValue="+94">
                      <SelectTrigger className="h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[99999999]">
                        <SelectItem value="+94">🇱🇰 +94</SelectItem>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                        <SelectItem value="+91">🇮🇳 +91</SelectItem>
                        <SelectItem value="+61">🇦🇺 +61</SelectItem>
                      </SelectContent>
                    </Select>
                 ) : (
                   <div className="flex h-full w-[90px] items-center gap-1 rounded-l-md border-r border-slate-200 px-2">
                       <span className="text-lg">🇱🇰</span>
                       <span className="text-sm font-medium text-[#0F172B]">+94</span>
                       <ChevronDown className="h-4 w-4 text-slate-500 ml-auto opacity-50" />
                   </div>
                 )}
                 <input
                    defaultValue={inquiry.phone.replace("+94", "").replace(/\s/g, "")}
                    disabled={!isEditing}
                    className={cn(
                      "flex-1 bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-default disabled:text-[#0F172B]",
                      AUTH_INPUT.placeholder
                    )}
                    placeholder="77 123 4567"
                  />
              </div>
            </div>
            <div className="space-y-1">
              <FieldLabel required>Interested Area</FieldLabel>
               {isEditing ? (
                  <Select defaultValue="Digital Marketing">
                    <SelectTrigger className={AUTH_INPUT.base}>
                      <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent className="z-[99999999]">
                      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                      <SelectItem value="Course">Course</SelectItem>
                    </SelectContent>
                  </Select>
               ) : (
                  <Input 
                    value="Digital Marketing" 
                    disabled 
                    className="bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100" 
                  />
               )}
            </div>

            {/* Row 3 */}
             <div className="space-y-1">
              <FieldLabel required>WhatsApp Number</FieldLabel>
              <div className={cn(
                  "flex h-10 w-full items-center rounded-md border border-gray-300 bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                  !isEditing && "bg-[#F1F5F9] border-transparent"
              )}>
                 {isEditing ? (
                    <Select defaultValue="+94">
                      <SelectTrigger className="h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[99999999]">
                        <SelectItem value="+94">🇱🇰 +94</SelectItem>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                        <SelectItem value="+91">🇮🇳 +91</SelectItem>
                        <SelectItem value="+61">🇦🇺 +61</SelectItem>
                      </SelectContent>
                    </Select>
                 ) : (
                   <div className="flex h-full w-[90px] items-center gap-1 rounded-l-md border-r border-slate-200 px-2">
                       <span className="text-lg">🇱🇰</span>
                       <span className="text-sm font-medium text-[#0F172B]">+94</span>
                       <ChevronDown className="h-4 w-4 text-slate-500 ml-auto opacity-50" />
                   </div>
                 )}
                 <input
                    defaultValue={inquiry.whatsApp.replace("+94", "").replace(/\s/g, "")}
                    disabled={!isEditing}
                    className={cn(
                      "flex-1 bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-default disabled:text-[#0F172B]",
                      AUTH_INPUT.placeholder
                    )}
                    placeholder="77 123 4567"
                  />
              </div>
            </div>
            <div className="space-y-1">
              <FieldLabel required>Assign Staff</FieldLabel>
                {isEditing ? (
                  <Select defaultValue="ruwini">
                    <SelectTrigger className={AUTH_INPUT.base}>
                      <SelectValue placeholder="Select Staff" />
                    </SelectTrigger>
                    <SelectContent className="z-[99999999]">
                      <SelectItem value="ruwini">
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
                ) : (
                  <div className="flex h-10 items-center rounded-md bg-[#F1F5F9] px-3 gap-2">
                     <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden">
                        {/* Avatar placeholder */}
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${"ruwini"}`} alt="avatar" />
                     </div>
                     <span className="text-sm text-[#0F172B] font-medium">Ruwini Gomez</span>
                     <span className="text-sm text-[#64748B]">@ruwini</span>
                  </div>
                )}
            </div>
            
             {/* Row 4 */}
            <div className="space-y-1">
              <FieldLabel>Email</FieldLabel>
              <Input
                defaultValue="user@gmail.com"
                disabled={!isEditing}
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  !isEditing && "bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100"
                )}
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-1">
              <FieldLabel>District</FieldLabel>
               {isEditing ? (
                  <Select defaultValue={inquiry.district}>
                    <SelectTrigger className={AUTH_INPUT.base}>
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent className="z-[99999999]">
                      <SelectItem value="Colombo">Colombo</SelectItem>
                      <SelectItem value="Kandy">Kandy</SelectItem>
                    </SelectContent>
                  </Select>
               ) : (
                 <Input
                    defaultValue={inquiry.district}
                    disabled
                    className="bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100"
                  />
               )}
            </div>

            {/* Row 5 */}
            <div className="space-y-1">
              <FieldLabel>NIC</FieldLabel>
              <Input
                defaultValue="XXXX XXXX XXXX"
                disabled={!isEditing}
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  !isEditing && "bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100"
                )}
                placeholder="Enter NIC number"
              />
            </div>
             <div className="space-y-1">
              <FieldLabel>Branch</FieldLabel>
               {isEditing ? (
                  <Select defaultValue={inquiry.branch}>
                    <SelectTrigger className={AUTH_INPUT.base}>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent className="z-[99999999]">
                      <SelectItem value="Main">Main</SelectItem>
                      <SelectItem value="Branch 2">Branch 2</SelectItem>
                    </SelectContent>
                  </Select>
               ) : (
                 <Input
                    defaultValue={inquiry.branch}
                    disabled
                    className="bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100"
                  />
               )}
            </div>
            
            {/* Notes Full Width */}
            <div className="col-span-1 sm:col-span-2 space-y-1">
              <FieldLabel>Notes</FieldLabel>
              <Textarea
                 defaultValue="Lorem ipsum dolor sit amet consectetur. Elementum montes laoreet aliquam nibh adipiscing. Nec consequat venenatis nulla cras proin orci."
                 disabled={!isEditing}
                 className={cn(
                   "min-h-[100px] resize-none",
                   AUTH_INPUT.placeholder,
                   !isEditing && "bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100"
                 )}
                 placeholder="Add notes describing the inquiry..."
              />
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4">
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                onClick={handleDiscard}
                className={cn(BUTTON_STYLES.secondary.md, "text-sm font-semibold text-[#0F172B] hover:bg-slate-100")}
              >
                Discard
              </Button>
              <Button 
                 onClick={handleUpdate}
                 className={cn(BUTTON_STYLES.primary.md, "text-sm font-semibold text-white")}
              >
                Update Details
              </Button>
            </>
          ) : (
             <Button 
               variant="outline" 
               onClick={() => setIsEditing(true)}
               className={cn(BUTTON_STYLES.outline.md, "text-sm font-semibold text-[#1D293D]")}
             >
               Edit Details
             </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
