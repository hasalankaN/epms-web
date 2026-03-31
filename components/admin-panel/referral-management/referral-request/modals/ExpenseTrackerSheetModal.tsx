"use client";

import React, { useEffect, useState } from "react";

import { X, CalendarIcon, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  itemVariants,
  motion,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";
import ImageUpload from "@/components/common/ImageUpload";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

// ===== SCHEMA =====

const expenseTrackerSchema = z.object({
  expenses_note: z.string().min(1, "Expenses note is required."),
  date: z.date({ required_error: "Date is required." }),
  amount: z.string().min(1, "Amount is required."),
  transaction_via: z.string().min(1, "Transaction method is required."),
  receipt_url: z.string().min(1, "Payment receipt is required."),
  internal_note: z.string().min(1, "Internal note is required."),
});

type ExpenseTrackerFormValues = z.infer<typeof expenseTrackerSchema>;

// ===== PROPS =====

interface ExpenseTrackerSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ===== FIELD LABEL =====

const FieldLabel = ({
  children,
  required = false,
  className,
}: {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) => (
  <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block", className)}>
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </Label>
);

// ===== COMPONENT =====

export function ExpenseTrackerSheetModal({ isOpen, onClose }: ExpenseTrackerSheetModalProps) {
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isDirty },
  } = useForm<ExpenseTrackerFormValues>({
    resolver: zodResolver(expenseTrackerSchema),
    defaultValues: {
      expenses_note: "",
      date: undefined,
      amount: "",
      transaction_via: "",
      receipt_url: "",
      internal_note: "",
    },
  });

  const watchedDate = watch("date");

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      reset({
        expenses_note: "",
        date: undefined,
        amount: "",
        transaction_via: "",
        receipt_url: "",
        internal_note: "",
      });

      setShowDiscardModal(false);
    }
  }, [isOpen, reset]);

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const onSubmit = async (values: ExpenseTrackerFormValues) => {
    try {
      setIsPending(true);

      // TODO: API integration
      console.log("Pay Request:", values);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent
          animateChildren={true}
          className="flex max-h-[95vh] w-[95%] max-w-[720px] flex-col gap-0 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 p-6 pb-0 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex-1 font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
                Expense Tracker Sheet
              </DialogTitle>
              <button
                onClick={handleCloseAttempt}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
              >
                <X className="h-4 w-4 text-[#64748B]" />
              </button>
            </div>
            <div className="border-b border-[#E2E8F0]" />
          </motion.div>

          {/* Body */}
          <motion.form
            variants={itemVariants}
            id="expense-tracker-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto p-6 pt-5 custom-scrollbar"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Expenses Note */}
              <div className="space-y-1">
                <FieldLabel required>Expenses Note</FieldLabel>
                <Input
                  {...register("expenses_note")}
                  className={cn(
                    AUTH_INPUT.base,
                    AUTH_INPUT.placeholder,
                    errors.expenses_note && "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="December Salary"
                />
                {errors.expenses_note && (
                  <p className="mt-1 text-xs text-red-500">{errors.expenses_note.message}</p>
                )}
              </div>

              {/* Date */}
              <div className="space-y-1">
                <FieldLabel required>Date</FieldLabel>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <div
                          className={cn(
                            "flex h-10 w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white transition-all hover:bg-slate-50",
                            errors.date && "border-red-500 ring-red-500"
                          )}
                        >
                          <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
                            <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                          </div>
                          <input
                            value={watchedDate ? format(watchedDate, "dd/MM/yyyy") : ""}
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
                          startDate={field.value || null}
                          endDate={null}
                          onDateChange={(date) => {
                            field.onChange(date || undefined);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <FieldLabel required>Amount</FieldLabel>
                <div className="relative">
                  <Input
                    {...register("amount")}
                    className={cn(
                      AUTH_INPUT.base,
                      AUTH_INPUT.placeholder,
                      "pr-12",
                      errors.amount && "border-red-500 focus-visible:ring-red-500"
                    )}
                    placeholder="eg: 1,000.00"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#1D293D]">
                    LKR
                  </div>
                </div>
                {errors.amount && (
                  <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>
                )}
              </div>

              {/* Transaction Via */}
              <div className="space-y-1">
                <FieldLabel required>Transaction via</FieldLabel>
                <Controller
                  name="transaction_via"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className={cn(
                          AUTH_INPUT.base,
                          "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic",
                          errors.transaction_via && "border-red-500 focus-visible:ring-red-500"
                        )}
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="z-[99999999]">
                        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="CHEQUE">Cheque</SelectItem>
                        <SelectItem value="ONLINE">Online Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.transaction_via && (
                  <p className="mt-1 text-xs text-red-500">{errors.transaction_via.message}</p>
                )}
              </div>

              {/* Receipt Upload */}
              <div className="space-y-1">
                <FieldLabel required>Upload Payment Receipt</FieldLabel>
                <Controller
                  name="receipt_url"
                  control={control}
                  render={({ field }) => (
                    <div className="h-[160px] w-full">
                       <ImageUpload
                        imageUrl={field.value}
                        setImage={field.onChange}
                        removeImage={() => field.onChange("")}
                        placeholder="Upload Image Here or drag and drop here"
                        className="h-full w-full"
                        dropzoneClassName={cn(
                          "!h-full !border-dashed !border-[#E2E8F0] !bg-transparent !p-0 !rounded-lg",
                          errors.receipt_url && "!border-red-500"
                        )}
                      />
                    </div>
                  )}
                />
                {errors.receipt_url && (
                  <p className="mt-1 text-xs text-red-500">{errors.receipt_url.message}</p>
                )}
              </div>

              {/* Internal Note */}
              <div className="space-y-1">
                <FieldLabel required>Note</FieldLabel>
                <Textarea
                  {...register("internal_note")}
                  className={cn(
                    "h-[160px] resize-none",
                    AUTH_INPUT.placeholder,
                    errors.internal_note && "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="eg: Type your message here"
                />
                {errors.internal_note && (
                  <p className="mt-1 text-xs text-red-500">{errors.internal_note.message}</p>
                )}
              </div>
            </div>
          </motion.form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="flex items-center justify-end p-6 pt-4 border-t border-[#E2E8F0] shrink-0 mt-auto">
            <Button
              type="submit"
              form="expense-tracker-form"
              disabled={isPending}
              className={cn(
                BUTTON_STYLES.primary.md,
                "font-inter text-[14px] font-semibold text-white leading-5 px-10 h-10 bg-[#E60076] hover:bg-[#F6339A]"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => {
          setShowDiscardModal(false);
          onClose();
        }}
        title="Discard Your Changes"
        description="Are you sure you want to discard your changes? This action cannot be undone."
        confirmText="Discard"
        cancelText="Cancel"
      />
    </>
  );
}
