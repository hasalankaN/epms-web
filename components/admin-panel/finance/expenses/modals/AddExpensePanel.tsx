"use client";

import React, { useState, useEffect } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "sonner";

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

import { cn } from "@/lib/utils";
import {
  AUTH_TYPOGRAPHY,
  AUTH_INPUT,
  BUTTON_STYLES,
} from "@/lib/constants/theme";
import { useGetBranches } from "@/hooks/api/branches/useGetBranches";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";
import { useGetCourses } from "@/hooks/api/courses/useGetCourses";
import { useCreateExpense } from "@/hooks/api/finances/useGetExpenses";
import type { ExpenseEntityType } from "@/hooks/api/finances/useGetExpenses";

// ===== SCHEMA =====

const expenseSchema = z
  .object({
    expense_type: z.enum(["bcp", "general"], {
      required_error: "Type is required.",
    }),
    source_type: z.enum(["BATCH", "COURSE", "PRODUCT"]).optional(),
    source_id: z.string().optional(),
    expense_description: z.string().min(1, "Description is required."),
    amount: z.string().min(1, "Amount is required."),
    transaction_via: z.string().min(1, "Transaction via is required."),
    branch_id: z.string().min(1, "Branch is required."),
    expense_date: z.string().min(1, "Date is required."),
    evidence: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.expense_type === "bcp") {
        return !!data.source_type && !!data.source_id;
      }

      return true;
    },
    {
      message: "Please select a specific batch, course, or product",
      path: ["source_id"],
    },
  );

type ExpenseFormValues = z.infer<typeof expenseSchema>;

// ===== PROPS =====

interface AddExpensePanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "bcp-expense" | "general-expense";
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
  <Label
    className={cn(
      AUTH_TYPOGRAPHY.label,
      "mb-1.5 block text-[#1D293D] font-medium text-sm",
      className,
    )}
  >
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

export function AddExpensePanel({
  isOpen,
  onClose,
  activeTab,
}: AddExpensePanelProps) {
  const { data: branchesData } = useGetBranches({ size: 100 });
  const branches = branchesData?.results || [];
  const { data: batchesData } = useGetBatches({ size: 100 });
  const batches = batchesData?.results || [];
  const { data: coursesData } = useGetCourses({ size: 100 });
  const courses = coursesData?.results || [];
  const { mutateAsync: createExpense } = useCreateExpense();

  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    mode: "onChange",
    defaultValues: {
      expense_type: activeTab === "bcp-expense" ? "bcp" : "general",
      source_type: "BATCH",
      source_id: "",
      expense_description: "",
      amount: "",
      transaction_via: "",
      branch_id: "",
      expense_date: today,
      evidence: "",
      notes: "",
    },
  });

  const expenseType = watch("expense_type");
  const sourceType = watch("source_type");

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      reset({
        expense_type: activeTab === "bcp-expense" ? "bcp" : "general",
        source_type: "BATCH",
        source_id: "",
        expense_description: "",
        amount: "",
        transaction_via: "",
        branch_id: "",
        expense_date: today,
        evidence: "",
        notes: "",
      });
      setShowDiscardModal(false);
    }
  }, [isOpen, reset, activeTab, today]);

  const handleCloseAttempt = () => {
    if (isDirty) {
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
    try {
      const relatedEntityType: ExpenseEntityType =
        values.expense_type === "general"
          ? "GENERAL"
          : (values.source_type ?? "BATCH");

      // Map display values to backend enum values
      const transactionViaMap: Record<string, string> = {
        BOC: "BOC",
        Peoples: "PEOPLES_BANK",
        "Peoples Bank": "PEOPLES_BANK",
        Cash: "CASH",
      };

      await createExpense({
        related_entity_type: relatedEntityType,
        description: values.expense_description,
        amount: parseFloat(values.amount.replace(/,/g, "")),
        date: values.expense_date,
        transaction_via:
          transactionViaMap[values.transaction_via] ?? values.transaction_via,
        branch_id: values.branch_id,
        related_entity_id:
          values.expense_type === "bcp" ? values.source_id : undefined,
        notes: values.notes || undefined,
      });

      toast.success("Expense added successfully.");
      reset();
      onClose();
    } catch {
      toast.error("Failed to add expense. Please try again.");
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
                  boxShadow:
                    "0 4px 6px -4px rgba(16, 24, 40, 0.10), 0 10px 15px -3px rgba(0, 0, 0, 0.10)",
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
                      {/* Select Type */}
                      <div className="space-y-1">
                        <FieldLabel>Select Type</FieldLabel>
                        <Controller
                          control={control}
                          name="expense_type"
                          render={({ field }) => (
                            <div className="flex items-center gap-6 h-10">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id="type-bcp"
                                  value="bcp"
                                  checked={field.value === "bcp"}
                                  onChange={() => field.onChange("bcp")}
                                  className="accent-[#0F172B] w-4 h-4 cursor-pointer"
                                />
                                <label
                                  htmlFor="type-bcp"
                                  className="text-sm text-[#45556C] cursor-pointer"
                                >
                                  Batch/Course/Product
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  id="type-general"
                                  value="general"
                                  checked={field.value === "general"}
                                  onChange={() => field.onChange("general")}
                                  className="accent-[#0F172B] w-4 h-4 cursor-pointer"
                                />
                                <label
                                  htmlFor="type-general"
                                  className="text-sm text-[#45556C] cursor-pointer"
                                >
                                  General
                                </label>
                              </div>
                            </div>
                          )}
                        />
                        {errors.expense_type && (
                          <p className="text-xs text-red-500">
                            {errors.expense_type.message}
                          </p>
                        )}
                      </div>

                      {/* Source Type (BCP only) */}
                      {expenseType === "bcp" && (
                        <div className="space-y-1">
                          <FieldLabel>Select</FieldLabel>
                          <Controller
                            control={control}
                            name="source_type"
                            render={({ field }) => (
                              <div className="flex items-center gap-6 h-10">
                                {(["BATCH", "COURSE", "PRODUCT"] as const).map(
                                  (type) => (
                                    <div
                                      key={type}
                                      className="flex items-center gap-2"
                                    >
                                      <input
                                        type="radio"
                                        id={`src-${type}`}
                                        value={type}
                                        checked={field.value === type}
                                        onChange={() => field.onChange(type)}
                                        className="accent-[#0F172B] w-4 h-4 cursor-pointer"
                                      />
                                      <label
                                        htmlFor={`src-${type}`}
                                        className="text-sm text-[#45556C] cursor-pointer"
                                      >
                                        {type.charAt(0) +
                                          type.slice(1).toLowerCase()}
                                      </label>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                          />
                        </div>
                      )}

                      {/* Select Specific Batch/Course/Product */}
                      {expenseType === "bcp" && sourceType && (
                        <div className="space-y-1">
                          <FieldLabel required>
                            Select{" "}
                            {sourceType === "BATCH"
                              ? "Batch"
                              : sourceType === "COURSE"
                                ? "Course"
                                : "Product"}
                          </FieldLabel>
                          <Controller
                            control={control}
                            name="source_id"
                            render={({ field }) => (
                              <Select
                                value={field.value || ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  className={cn(
                                    AUTH_INPUT.base,
                                    AUTH_INPUT.placeholder,
                                  )}
                                >
                                  <SelectValue
                                    placeholder={`Select a ${sourceType === "BATCH" ? "batch" : sourceType === "COURSE" ? "course" : "product"}`}
                                  />
                                </SelectTrigger>
                                <SelectContent className="z-[999999]">
                                  {sourceType === "BATCH" &&
                                    batches.length === 0 && (
                                      <div className="px-3 py-2 text-sm text-[#90A1B9]">
                                        No batches found
                                      </div>
                                    )}
                                  {sourceType === "BATCH" &&
                                    batches.map((batch) => (
                                      <SelectItem
                                        key={batch.id}
                                        value={batch.id}
                                      >
                                        {batch.name}
                                      </SelectItem>
                                    ))}
                                  {sourceType === "COURSE" &&
                                    courses.length === 0 && (
                                      <div className="px-3 py-2 text-sm text-[#90A1B9]">
                                        No courses found
                                      </div>
                                    )}
                                  {sourceType === "COURSE" &&
                                    courses.map((course) => (
                                      <SelectItem
                                        key={course.id}
                                        value={course.id}
                                      >
                                        {course.name}
                                      </SelectItem>
                                    ))}
                                  {sourceType === "PRODUCT" && (
                                    <div className="px-3 py-2 text-sm text-[#90A1B9]">
                                      No products found
                                    </div>
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.source_id && (
                            <p className="text-xs text-red-500">
                              {errors.source_id.message}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Transaction Description */}
                      <div className="space-y-1">
                        <FieldLabel required>
                          Transaction Description
                        </FieldLabel>
                        <Input
                          {...register("expense_description")}
                          className={cn(
                            AUTH_INPUT.base,
                            AUTH_INPUT.placeholder,
                            errors.expense_description &&
                              "border-red-500 focus-visible:ring-red-500",
                          )}
                          placeholder="lorem ipsum"
                        />
                        {errors.expense_description && (
                          <p className="text-xs text-red-500">
                            {errors.expense_description.message}
                          </p>
                        )}
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
                              errors.amount &&
                                "border-red-500 focus-visible:ring-red-500",
                            )}
                            placeholder="eg: 15,000.00"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <span className="text-sm font-semibold text-[#1D293D]">
                              LKR
                            </span>
                            <ChevronDown className="h-3 w-3 text-[#0F172B]" />
                          </div>
                        </div>
                        {errors.amount && (
                          <p className="text-xs text-red-500">
                            {errors.amount.message}
                          </p>
                        )}
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
                                  errors.transaction_via &&
                                    "border-red-500 focus:ring-red-500",
                                )}
                              >
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="z-[99999999]">
                                <SelectItem value="BOC">BOC</SelectItem>
                                <SelectItem value="Peoples">
                                  Peoples Bank
                                </SelectItem>
                                <SelectItem value="Cash">Cash</SelectItem>
                                <SelectItem value="Online Transfer">
                                  Online Transfer
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.transaction_via && (
                          <p className="text-xs text-red-500">
                            {errors.transaction_via.message}
                          </p>
                        )}
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
                                  errors.branch_id &&
                                    "border-red-500 focus:ring-red-500",
                                )}
                              >
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="z-[99999999]">
                                {branches.map(
                                  (branch: { id: string; name: string }) => (
                                    <SelectItem
                                      key={branch.id}
                                      value={branch.id}
                                    >
                                      {branch.name}
                                    </SelectItem>
                                  ),
                                )}
                                {branches.length === 0 && (
                                  <SelectItem value="dummy" disabled>
                                    No branches found
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.branch_id && (
                          <p className="text-xs text-red-500">
                            {errors.branch_id.message}
                          </p>
                        )}
                      </div>

                      {/* Expense Date */}
                      <div className="space-y-1">
                        <FieldLabel required>Expense Date</FieldLabel>
                        <Input
                          type="date"
                          {...register("expense_date")}
                          max={today}
                          className={cn(
                            AUTH_INPUT.base,
                            errors.expense_date &&
                              "border-red-500 focus-visible:ring-red-500",
                          )}
                        />
                        {errors.expense_date && (
                          <p className="text-xs text-red-500">
                            {errors.expense_date.message}
                          </p>
                        )}
                      </div>

                      {/* Evidence */}
                      <div className="space-y-1">
                        <FieldLabel>Evidence</FieldLabel>
                        <Controller
                          control={control}
                          name="evidence"
                          render={({ field }) => (
                            <div className="w-full">
                              <ImageUpload
                                imageUrl={field.value ?? ""}
                                setImage={(url) => field.onChange(url)}
                                removeImage={() => field.onChange("")}
                                placeholder="Upload Here or drag and drop here"
                                className={cn(
                                  "h-[140px]",
                                  errors.evidence && "border-red-500",
                                )}
                              />
                            </div>
                          )}
                        />
                        {errors.evidence && (
                          <p className="text-xs text-red-500">
                            {errors.evidence.message}
                          </p>
                        )}
                      </div>

                      {/* Notes */}
                      <div className="space-y-1">
                        <FieldLabel>Notes</FieldLabel>
                        <Textarea
                          {...register("notes")}
                          className={cn(
                            "min-h-[100px] resize-none text-[14px] font-medium",
                            AUTH_INPUT.base,
                            AUTH_INPUT.placeholder,
                            errors.notes &&
                              "border-red-500 focus-visible:ring-red-500",
                          )}
                          placeholder="eg: Type your notes here"
                        />
                        {errors.notes && (
                          <p className="text-xs text-red-500">
                            {errors.notes.message}
                          </p>
                        )}
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
                      "font-inter text-[14px] font-semibold text-[#0F172B]",
                    )}
                  >
                    Clear All
                  </Button>
                  <Button
                    type="submit"
                    form="add-expense-form"
                    disabled={isSubmitting}
                    className={cn(
                      BUTTON_STYLES.primary.md,
                      "w-auto min-w-[100px] px-6 text-sm font-semibold text-white",
                    )}
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
