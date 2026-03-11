"use client";

import React, { useState } from "react";

import { X, ChevronDown, CalendarDays as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

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
import ImageUpload from "@/components/common/ImageUpload";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StaffUpdatePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;

  /** Pre-fill from the pending payment card */
  expensesDescription?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FieldLabel = ({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) => (
  <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block")}>
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </Label>
);

// ─── Modal ─────────────────────────────────────────────────────────────────────

export function StaffUpdatePaymentModal({
  isOpen,
  onClose,
  expensesDescription = "",
}: StaffUpdatePaymentModalProps) {
  // ── Form state ──
  const [expensesNote, setExpensesNote] = useState(expensesDescription);
  const [expenseType, setExpenseType] = useState("");
  const [salaryAmount, setSalaryAmount] = useState("");
  const [transactionVia, setTransactionVia] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [receiptImage, setReceiptImage] = useState("");
  const [note, setNote] = useState("");

  const markDirty = () => {};

  const handleUpdate = () => {
    toast.success("Payment details updated successfully");
    onClose();
  };

  return (

    /* Dialog */
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[720px] flex-col gap-4 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-4 sm:p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col gap-4 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
              Payment Details
            </DialogTitle>
            <button
              title="close modal"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </div>

        {/* ===== BODY (scrollable) ===== */}
        <div className="flex-1 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 sm:gap-y-5">

            {/* Expenses Note */}
            <div className="space-y-1">
              <FieldLabel required>Expenses Note</FieldLabel>
              <Input
                value={expensesNote}
                onChange={(e) => { setExpensesNote(e.target.value); markDirty(); }}
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                placeholder="December Salary"
              />
            </div>

            {/* Expense Type */}
            <div className="space-y-1">
              <FieldLabel required>Expense Type</FieldLabel>
              <Select value={expenseType} onValueChange={(v) => { setExpenseType(v); markDirty(); }}>
                <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="z-[99999999]">
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                  <SelectItem value="commission">Commission</SelectItem>
                  <SelectItem value="allowance">Allowance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Salary Amount */}
            <div className="space-y-1">
              <FieldLabel required>Salary Amount</FieldLabel>
              <div className="relative">
                <Input
                  value={salaryAmount}
                  onChange={(e) => { setSalaryAmount(e.target.value); markDirty(); }}
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, "pr-14")}
                  placeholder="eg: 1,000.00"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <span className="text-sm font-semibold text-[#1D293D]">LKR</span>
                  <ChevronDown className="h-3 w-3 text-[#0F172B]" />
                </div>
              </div>
            </div>

            {/* Transaction via */}
            <div className="space-y-1">
              <FieldLabel required>Transaction via</FieldLabel>
              <Select value={transactionVia} onValueChange={(v) => { setTransactionVia(v); markDirty(); }}>
                <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="z-[99999999]">
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1">
              <FieldLabel>Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex h-10 w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white transition-all hover:bg-slate-50">
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
                    onDateChange={(start) => {
                      setDate(start || undefined);
                      markDirty();
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Spacer for 2nd column of Row 3 */}
            <div className="hidden sm:block" />

            {/* Upload Payment Receipt — full left column */}
            <div className="col-span-1 space-y-1">
              <FieldLabel required>Upload Payment Receipt</FieldLabel>
              <div
                style={{
                  width: "100%",
                  height: 171,
                  borderRadius: 8,
                  border: "1px dashed #E2E8F0",
                  background: "rgba(0,0,0,0.00)",
                  overflow: "hidden",
                }}
              >
                <ImageUpload
                  imageUrl={receiptImage}
                  setImage={(url) => { setReceiptImage(url); markDirty(); }}
                  removeImage={() => { setReceiptImage(""); markDirty(); }}
                  showSupportedFormats
                  className="h-full w-full"
                  dropzoneClassName="!h-[171px] !border-none !rounded-none !bg-transparent !p-0"
                  placeholder="Upload Image Here or drag and drop here"
                />
              </div>
            </div>

            {/* Note — aligned with Upload on right */}
            <div className="space-y-1">
              <FieldLabel required>Note</FieldLabel>
              <Textarea
                value={note}
                onChange={(e) => { setNote(e.target.value); markDirty(); }}
                className={cn("min-h-[171px] resize-none", AUTH_INPUT.placeholder)}
                placeholder="eg: Type your message here"
              />
            </div>

          </div>
        </div>

        {/* ===== FOOTER (static) ===== */}
        <div className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4 shrink-0">
          <Button
            onClick={handleUpdate}
            className={cn(BUTTON_STYLES.primary.md, "text-sm font-semibold text-white")}
          >
            Update Payment Details
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}
