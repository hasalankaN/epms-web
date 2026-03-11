
import React, { useState } from "react";

import { format } from "date-fns";
import { X, CalendarDays as CalendarIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";
import { StatusPopover } from "@/components/common/StatusPopover";

import { cn } from "@/lib/utils";
import type { InquiryDataType } from "@/types/inquiry";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { INQUIRY_STATUS_CONFIG } from "@/types/inquiry";

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: InquiryDataType | null;
}

export function FollowUpModal({
  isOpen,
  onClose,
  inquiry,
}: FollowUpModalProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [note, setNote] = useState("");

  if (!inquiry) return null;

  // Mock activities data - in real app, fetch from API based on inquiry.id
  const activities = [
    {
      id: 1,
      text: "The student didn't answer the phone.",
      timestamp: new Date("2026-06-01T10:51:00"),
    },
    {
      id: 2,
      text: "The student didn't answer the phone.",
      timestamp: new Date("2026-06-01T10:51:00"),
    },
    {
      id: 3,
      text: "The student didn't answer the phone.",
      timestamp: new Date("2026-06-01T10:51:00"),
    },
    {
      id: 4,
      text: "The student didn't answer the phone.",
      timestamp: new Date("2026-06-01T10:51:00"),
    },
    {
      id: 5,
      text: "The student didn't answer the phone.",
      timestamp: new Date("2026-06-01T10:51:00"),
    },
  ];

  const statusOptions = Object.entries(INQUIRY_STATUS_CONFIG).map(([status, config]) => ({
    value: status,
    bg: config.bg,
    text: config.text,
  }));

  const FieldLabel = ({ children, required = false }: { children: React.ReactNode; required?: boolean }) => (
    <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block")}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[500px] flex-col gap-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-xl outline-none [&>button]:hidden">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col gap-4 p-6 pb-0">
            <div className="flex items-center justify-between">
                <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
                    Follow-Ups - [{inquiry.name}]
                </DialogTitle>
                <button
                    title="Close"
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
                >
                    <X className="h-4 w-4 text-[#64748B]" />
                </button>
            </div>
            
            <div className="flex flex-col gap-0.5">
                 <span className="font-inter text-xs font-normal text-[#64748B]">
                     Course / Batch Name
                 </span>
                 <div className="font-inter text-xs text-[#314158]">
                      <span className="font-normal">Next Follow Up : </span>
                      <span className="font-bold">{inquiry.followUp || "{Date}"}</span>
                 </div>
            </div>

            <div className="border-b border-[#E2E8F0]" />
        </div>



        {/* ===== SCROLLABLE CONTENT ===== */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Form Section */}
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <FieldLabel>Next Follow-Up Date</FieldLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="flex h-10 w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white hover:bg-slate-50">
                                <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
                                    <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                                </div>
                                <input
                                    value={date ? format(date, "dd/MM/yyyy") : ""}
                                    readOnly
                                    placeholder="Pick a date"
                                    className={cn(
                                        "flex-1 cursor-pointer bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400 placeholder:italic",
                                        "pointer-events-none" // Pass clicks to parent div
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

                <div className="space-y-1.5">
                    <FieldLabel>Follow-Up Note</FieldLabel>
                    <Textarea 
                        placeholder="eg: Type your note here"
                        className={cn(
                            "min-h-[100px] resize-none",
                            AUTH_INPUT.placeholder,
                            "border-gray-300 focus-visible:ring-[#E60076]"
                        )}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                <div className="flex justify-end">
                    <Button className={cn(BUTTON_STYLES.primary.full, "w-auto px-6")}>
                        Add Follow-Up
                    </Button>
                </div>
            </div>

            {/* Activities Section */}
            <div className="space-y-4">
                <h3 className="font-inter text-base font-semibold leading-6 text-[#0F172B]">
                    Activities
                </h3>

                <div className="flex flex-col gap-0">
                    <div className="flex max-h-[200px] flex-col overflow-y-auto pr-2">
                        {activities.map((activity, index) => (
                            <div key={activity.id} className="flex gap-3">
                                <div className="flex flex-col items-center pt-1">
                                    <i className="clock-counter-clockwise h-5 w-5 shrink-0 text-[#0F172B]" />
                                    {index !== activities.length - 1 && (
                                        <div className="mt-[5px] mb-[9px] h-[14px] w-[1px] bg-slate-300" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-0.5 pb-4">
                                    <span className="font-inter text-xs font-normal leading-4 text-[#314158]">
                                        {activity.text}
                                    </span>
                                    <span className="font-inter text-xs font-normal leading-4 text-[#90A1B9]">
                                        {format(activity.timestamp, "MM/dd/yyyy hh:mm:ss a")}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Status Footer */}
            <div className="flex justify-end pt-2">
                 <StatusPopover
                    value={inquiry.status}
                    options={statusOptions}
                 />
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
