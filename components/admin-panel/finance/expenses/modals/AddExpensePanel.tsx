"use client";

import React, { useState, useEffect } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import ImageUpload from "@/components/common/ImageUpload";
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

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { useGetBranches } from "@/hooks/api/branches/useGetBranches";

// ===== SCHEMA =====

const expenseSchema = z.object({
  expense_date: z.date().optional(),
  expense_description: z.string().min(1, "Description is required."),
  transaction_via: z.string().min(1, "Transaction via is required."),
  amount: z.string().min(1, "Amount is required."),
  branch_id: z.string().min(1, "Branch is required."),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

// ===== PROPS =====

interface AddExpensePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ===== PORTAL =====

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(children, document.body);
};

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
  <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block text-[#1D293D] font-medium text-sm", className)}>
    {children}
    {required && <span className="ml-0.5 text-[#E60076]">*</span>}
  </Label>
);

// ===== ANIMATION VARIANTS =====

const sidePanelVariants = {
  hidden: { x: "100%" },
  show: {
    x: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      staggerChildren: 0.08,
      delayChildren: 0.35,
    },
  },
  exit: { x: "100%" },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

// ===== MAIN COMPONENT =====

export function AddExpensePanel({ isOpen, onClose }: AddExpensePanelProps) {
  const { data: branchesData } = useGetBranches({ size: 100 });
  const branches = branchesData?.results || [];

  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [evidenceUrl, setEvidenceUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    mode: "onChange",
    defaultValues: {
      amount: "",
      branch_id: "",
      transaction_via: "",
      expense_description: "",
    },
  });

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      reset();
      setShowDiscardModal(false);
      setEvidenceUrl("");
    }
  }, [isOpen, reset]);

  const handleCloseAttempt = () => {
    if (isDirty || evidenceUrl) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    reset();
    onClose();
  };

  const onSubmit = async (values: ExpenseFormValues) => {
    setIsSubmitting(true);

    try {
      console.log("Submitting Expense:", { ...values, evidence: evidenceUrl });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Portal>
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseAttempt}
                className="fixed inset-0 z-[99999] bg-black/20 backdrop-blur-sm"
              />

              {/* Panel */}
              <motion.div
                key="panel"
                variants={sidePanelVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="fixed right-0 top-0 z-[99999] flex h-screen w-full max-w-[500px] flex-col bg-white shadow-2xl"
                style={{
                  borderLeft: "1px solid #E2E8F0",
                  borderRadius: "8px 0 0 8px",
                  boxShadow: "0 4px 6px -4px rgba(16, 24, 40, 0.10), 0 10px 15px -3px rgba(0, 0, 0, 0.10)",
                }}
              >
                {/* Header */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 shrink-0"
                >
                  <h2 className="text-lg font-semibold leading-[30px] text-[#0F172B]">
                    Add Expense
                  </h2>
                  <button
                    type="button"
                    title="close"
                    onClick={handleCloseAttempt}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
                  >
                    <X className="h-4 w-4 text-[#64748B]" />
                  </button>
                </motion.div>

                {/* Scrollable content */}
                <motion.div
                  variants={itemVariants}
                  className="flex-1 overflow-y-auto"
                >
                  <form
                    id="add-expense-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="px-6 py-6 custom-scrollbar"
                  >
                    <div className="flex flex-col gap-6">

                      {/* Expense Date */}
                      <div className="space-y-1">
                        <FieldLabel>Expense Date</FieldLabel>
                        <Controller
                          control={control}
                          name="expense_date"
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <div className={cn(
                                  "flex h-10 w-full items-center rounded-md border border-gray-300 bg-white transition-all hover:bg-slate-50 cursor-pointer",
                                  errors.expense_date && "border-red-500"
                                )}>
                                  <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
                                    <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                                  </div>
                                  <input
                                    value={field.value ? format(field.value, "dd/MM/yyyy") : ""}
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
                                  onDateChange={(start) => field.onChange(start)}
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        />
                        {errors.expense_date && <p className="text-xs text-red-500">{errors.expense_date.message}</p>}
                      </div>

                      {/* Expense Description */}
                      <div className="space-y-1">
                        <FieldLabel required>Expense Description</FieldLabel>
                        <Textarea
                          {...register("expense_description")}
                          className={cn(
                            "min-h-[100px] resize-none text-[14px] font-medium",
                            AUTH_INPUT.base,
                            AUTH_INPUT.placeholder,
                            errors.expense_description && "border-red-500 focus-visible:ring-red-500"
                          )}
                          placeholder="eg: Monthly rent payment or utility bills..."
                        />
                        {errors.expense_description && <p className="text-xs text-red-500">{errors.expense_description.message}</p>}
                      </div>

                      {/* Transaction Via */}
                      <div className="space-y-1">
                        <FieldLabel required>Transaction via</FieldLabel>
                        <Controller
                          control={control}
                          name="transaction_via"
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger
                                className={cn(
                                  AUTH_INPUT.base,
                                  "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic",
                                  errors.transaction_via && "border-red-500 focus:ring-red-500"
                                )}
                              >
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="z-[99999999]">
                                <SelectItem value="BOC">BOC</SelectItem>
                                <SelectItem value="Peoples">Peoples Bank</SelectItem>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Online Transfer">Online Transfer</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.transaction_via && <p className="text-xs text-red-500">{errors.transaction_via.message}</p>}
                      </div>

                      {/* Amount */}
                      <div className="space-y-1">
                        <FieldLabel required>Amount</FieldLabel>
                        <p className="mb-[6px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                          Only numbers, periods, commas and spaces are accepted.
                        </p>
                        <div className="relative">
                          <Input
                            {...register("amount")}
                            className={cn(
                              AUTH_INPUT.base,
                              AUTH_INPUT.placeholder,
                              "pr-14",
                              errors.amount && "border-red-500 focus-visible:ring-red-500"
                            )}
                            placeholder="eg: 15,000.00"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <span className="text-sm font-semibold text-[#1D293D]">LKR</span>
                            <ChevronDown className="h-3 w-3 text-[#0F172B]" />
                          </div>
                        </div>
                        {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
                      </div>

                      {/* Branch */}
                      <div className="space-y-1">
                        <FieldLabel required>Branch</FieldLabel>
                        <Controller
                          control={control}
                          name="branch_id"
                          render={({ field }) => (
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger
                                className={cn(
                                  AUTH_INPUT.base,
                                  "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic",
                                  errors.branch_id && "border-red-500 focus:ring-red-500"
                                )}
                              >
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="z-[99999999]">
                                {branches.map((branch: { id: string; name: string }) => (
                                  <SelectItem key={branch.id} value={branch.id}>
                                    {branch.name}
                                  </SelectItem>
                                ))}
                                {branches.length === 0 && (
                                  <SelectItem value="dummy" disabled>No branches found</SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.branch_id && <p className="text-xs text-red-500">{errors.branch_id.message}</p>}
                      </div>

                      {/* Evidence */}
                      <div className="space-y-1">
                        <FieldLabel>Evidence</FieldLabel>
                        <div className="w-full">
                          <ImageUpload
                            imageUrl={evidenceUrl}
                            setImage={setEvidenceUrl}
                            removeImage={() => setEvidenceUrl("")}
                            placeholder="Upload Here or drag and drop here"
                            className="h-[140px]"
                          />
                        </div>
                      </div>

                    </div>
                  </form>
                </motion.div>

                {/* Footer */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-end gap-3 border-t border-[#E2E8F0] px-6 py-4 shrink-0"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => reset()}
                    className={cn(
                      BUTTON_STYLES.secondary.md,
                      "font-inter text-[14px] font-semibold text-[#0F172B]"
                    )}
                  >
                    Clear All
                  </Button>
                  <Button
                    type="submit"
                    form="add-expense-form"
                    disabled={isSubmitting}
                    className={cn(BUTTON_STYLES.primary.md, "w-auto min-w-[100px] px-6 text-sm font-semibold text-white")}
                  >
                    {isSubmitting ? "Creating..." : "Create"}
                  </Button>
                </motion.div>

              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>

      <DeleteConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={handleConfirmDiscard}
        title="Save Your Edits First"
        description="Unsaved changes detected, remember to save your edits before you close!"
        confirmText="Proceed Without Saving"
        cancelText="Go Back and Save"
      />
    </>
  );
}
