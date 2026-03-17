"use client";

import React, { useState, useEffect } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { useCreateComplaint } from "@/hooks/api/complaints/useCreateComplaint";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";

// ===== SCHEMA =====

const complaintSchema = z.object({
  type: z.enum(["REQUEST", "COMPLAINT"], {
    required_error: "Complaint type is required.",
  }),
  holder_name: z.string().min(1, "Complaint holder name is required."),
  mobileCountryCode: z.string(),
  mobile_number: z
    .string()
    .min(1, "Mobile number is required.")
    .regex(/^[0-9]{9}$/, "Mobile must be exactly 9 digits."),
  description: z.string().min(1, "Description is required."),
  notes: z.string().optional(),
  assignee_user_id: z.string().min(1, "Assignee is required."),
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

// ===== PROPS =====

interface AddComplaintPanelProps {
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
  <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block", className)}>
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
  </Label>
);

// ===== ANIMATION VARIANTS =====

const sidePanelVariants: Variants = {
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
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 },
};

// ===== CONSTANTS =====

const COMPLAINT_TYPES = [
  { value: "REQUEST", label: "Request" },
  { value: "COMPLAINT", label: "Complaint" },
] as const;

// ===== COMPONENT =====

export function AddComplaintPanel({ isOpen, onClose }: AddComplaintPanelProps) {
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const { mutateAsync: createComplaint, isPending } = useCreateComplaint();
  const { data: staffData } = useGetStaff({ size: 100, role: "MANAGER" }); // Assuming we assign to managers/staff

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      type: "REQUEST",
      holder_name: "",
      mobileCountryCode: "+94",
      mobile_number: "",
      description: "",
      notes: "",
      assignee_user_id: "",
    },
  });

  const mobileCountryCode = watch("mobileCountryCode");

  // Reset state when panel opens
  useEffect(() => {
    if (isOpen) {
      reset();
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

  const handleConfirmDiscard = () => {
    setShowDiscardModal(false);
    reset();
    onClose();
  };

  const onSubmit = async (values: ComplaintFormValues) => {
    try {
      const payload = {
        type: values.type,
        holder_name: values.holder_name,
        mobile_number: `${values.mobileCountryCode}${values.mobile_number}`,
        description: values.description,
        notes: values.notes || undefined,
        assignee_user_id: values.assignee_user_id,
      };

      await createComplaint(payload);
      reset();
      onClose();
    } catch {
      // errors handled by the hook's onError
    }
  };

  return (
    <>
      <Portal>
        <AnimatePresence mode="wait">
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

              {/* Side Panel */}
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
                    Add a Complain
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

                {/* Scrollable Content */}
                <motion.div variants={itemVariants} className="flex-1 overflow-y-auto">
                  <form
                    id="add-complaint-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="px-6 py-6 custom-scrollbar"
                  >
                    <div className="flex flex-col gap-5">
                      {/* Complain Holder */}
                      <div className="space-y-1">
                        <FieldLabel required>Complain Holder</FieldLabel>
                        <Input
                          {...register("holder_name")}
                          className={cn(
                            AUTH_INPUT.base,
                            AUTH_INPUT.placeholder,
                            errors.holder_name && "border-red-500 focus-visible:ring-red-500"
                          )}
                          placeholder="eg: John Doe"
                        />
                        {errors.holder_name && (
                          <p className="mt-1 text-xs text-red-500">{errors.holder_name.message}</p>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div className="flex flex-col">
                        <FieldLabel required className="mb-1">
                          Mobile Number
                        </FieldLabel>
                        <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                          Only use numbers; do not include any spaces.
                        </p>
                        <div
                          className={cn(
                            "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                            errors.mobile_number
                              ? "border-red-500 focus-within:ring-red-500"
                              : "border-gray-300"
                          )}
                        >
                          <Select
                            value={mobileCountryCode}
                            onValueChange={(val) =>
                              setValue("mobileCountryCode", val, { shouldDirty: true })
                            }
                            disabled
                          >
                            <SelectTrigger className="h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="z-[99999999]">
                              <SelectItem value="+94">🇱🇰 +94</SelectItem>
                            </SelectContent>
                          </Select>
                          <input
                            {...register("mobile_number")}
                            className={cn(
                              "flex-1 bg-transparent px-3 py-2 text-sm outline-none",
                              AUTH_INPUT.placeholder
                            )}
                            placeholder="eg: 771234567"
                          />
                        </div>
                        {errors.mobile_number && (
                          <p className="mt-1 text-xs text-red-500">{errors.mobile_number.message}</p>
                        )}
                      </div>

                      {/* Assignee */}
                      <div className="space-y-1">
                        <FieldLabel required>Assignee</FieldLabel>
                        <Select
                          onValueChange={(val) =>
                            setValue("assignee_user_id", val, {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              AUTH_INPUT.base,
                              "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic"
                            )}
                          >
                            <SelectValue placeholder="Select Assignee" />
                          </SelectTrigger>
                          <SelectContent className="z-[99999999]">
                            {staffData?.results?.map((staff) => (
                              <SelectItem key={staff.userId} value={staff.userId}>
                                {staff.firstName} {staff.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.assignee_user_id && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.assignee_user_id.message}
                          </p>
                        )}
                      </div>

                      {/* Complain Type */}
                      <div className="space-y-1">
                        <FieldLabel required>Complain Type</FieldLabel>
                        <Select
                          defaultValue="REQUEST"
                          onValueChange={(val) =>
                            setValue("type", val as "REQUEST" | "COMPLAINT", {
                              shouldDirty: true,
                              shouldValidate: true,
                            })
                          }
                        >
                          <SelectTrigger
                            className={cn(
                              AUTH_INPUT.base,
                              "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic"
                            )}
                          >
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent className="z-[99999999]">
                            {COMPLAINT_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.type && (
                          <p className="mt-1 text-xs text-red-500">{errors.type.message}</p>
                        )}
                      </div>

                      {/* Enter Complain / Description */}
                      <div className="space-y-1">
                        <FieldLabel required>Enter Complain</FieldLabel>
                        <Textarea
                          {...register("description")}
                          className={cn(
                            "min-h-[100px] resize-none",
                            AUTH_INPUT.placeholder,
                            errors.description && "border-red-500 focus-visible:ring-red-500"
                          )}
                          placeholder="eg: Type your message here"
                        />
                        {errors.description && (
                          <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                        )}
                      </div>

                      {/* Additional Notes */}
                      <div className="space-y-1">
                        <FieldLabel>Additional Notes</FieldLabel>
                        <Textarea
                          {...register("notes")}
                          className={cn("min-h-[100px] resize-none", AUTH_INPUT.placeholder)}
                          placeholder="eg: Type your message here"
                        />
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
                    form="add-complaint-form"
                    disabled={isPending}
                    className={cn(
                      BUTTON_STYLES.primary.full,
                      "w-auto px-[38.5px] text-sm font-semibold text-white"
                    )}
                  >
                    {isPending ? "Submitting..." : "Submit"}
                  </Button>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Portal>

      {/* Discard Confirmation Modal */}
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
