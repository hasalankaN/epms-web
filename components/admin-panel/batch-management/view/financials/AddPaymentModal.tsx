"use client";

import React, { useState } from "react";

import { X, ChevronDown, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

interface AddPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: { amount: string; dueDate: Date | undefined; description: string }) => void;
}

export function AddPaymentModal({
  open,
  onOpenChange,
  onSave,
}: AddPaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [description, setDescription] = useState("");

  const handleSave = () => {
    onSave?.({ amount, dueDate, description });
    onOpenChange(false);

    // Reset form
    setAmount("");
    setDueDate(undefined);
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex w-full max-w-[500px] flex-col rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] gap-4 sm:rounded-xl [&>button]:hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <DialogTitle className="text-lg font-semibold leading-[30px] text-[#0F172B]">
            Add New Payment
          </DialogTitle>
          <button
            title="Close"
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
          >
            <X className="h-4 w-4 text-[#64748B]" />
          </button>
        </div>

        {/* Separator */}
        <div className="h-[1px] bg-[#E2E8F0] w-full" />

        {/* Body */}
        <div className="flex flex-col gap-4">
          
          {/* Amount */}
          <div className="space-y-1.5">
            <Label className={AUTH_TYPOGRAPHY.label}>Enter Amount</Label>
            <div className="relative">
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="eg: 1,000.00"
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "pr-12")}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-sm font-semibold text-[#1D293D] font-inter">LKR</span>
                <ChevronDown className="h-3 w-3 text-[#0F172B]" />
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <Label className={AUTH_TYPOGRAPHY.label}>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <div className={cn(
                    "flex h-10 w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white transition-all hover:bg-slate-50"
                )}>
                   <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
                      <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                   </div>
                   <input 
                     value={dueDate ? format(dueDate, "dd/MM/yyyy") : ""} 
                     readOnly
                     placeholder="Pick a date"
                     className={cn(
                       "flex-1 cursor-pointer bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic pointer-events-none text-[#0F172B]"
                     )}
                   />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[99999999]" align="start">
                <DateRangeCalendar
                  mode="single"
                  startDate={dueDate || null}
                  endDate={null}
                  minDate={new Date()}
                  onDateChange={(date) => setDueDate(date || undefined)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className={AUTH_TYPOGRAPHY.label}>Enter Payment Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="eg: Type your note here"
              className={cn(AUTH_INPUT.placeholder, "min-h-[100px] resize-none border-gray-300 focus-visible:ring-[#E60076]")}
            />
          </div>

        </div>

        {/* Separator */}
        <div className="h-[1px] bg-[#E2E8F0] w-full" />

        {/* Footer */}
        <div className="flex justify-end pt-2">
            <Button
                type="button"
                onClick={handleSave}
                className={cn(BUTTON_STYLES.primary.md, "bg-[#E60076] hover:bg-[#D6006D] text-white w-[85px]")}
            >
                Save
            </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
