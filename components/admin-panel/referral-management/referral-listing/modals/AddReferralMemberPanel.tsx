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
import { DISTRICTS } from "@/lib/constants/districts";
import { useCreateReferralAgent } from "@/hooks/api/referrals/useCreateReferralAgent";

// ===== SCHEMA =====

const referralMemberSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  email: z.string().email("Please enter a valid email address."),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Gender is required.",
  }),
  mobileCountryCode: z.string().default("+94"),
  mobile_number: z
    .string()
    .min(1, "Phone number is required.")
    .regex(/^[0-9]{9}$/, "Phone must be exactly 9 digits."),
  whatsappCountryCode: z.string().default("+94"),
  whatsapp_number: z
    .string()
    .min(1, "Whatsapp number is required.")
    .regex(/^[0-9]{9}$/, "Whatsapp must be exactly 9 digits."),
  district: z.string({
    required_error: "District is required.",
  }).min(1, "District is required."),
  role: z.enum(["TEAM_MEMBER", "TEAM_LEADER"]).default("TEAM_MEMBER"),
});

type ReferralMemberFormValues = z.infer<typeof referralMemberSchema>;

// ===== PROPS =====

interface AddReferralMemberPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ===== PORTAL =====

const Portal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

// ===== COMPONENT =====

export function AddReferralMemberPanel({ isOpen, onClose }: AddReferralMemberPanelProps) {
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const { mutateAsync: createAgent, isPending } = useCreateReferralAgent();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ReferralMemberFormValues>({
    resolver: zodResolver(referralMemberSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      gender: undefined,
      mobileCountryCode: "+94",
      mobile_number: "",
      whatsappCountryCode: "+94",
      whatsapp_number: "",
      district: undefined,
      role: "TEAM_MEMBER",
    },
  });

  const mobileCountryCode = watch("mobileCountryCode");
  const whatsappCountryCode = watch("whatsappCountryCode");
  const role = watch("role");

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

  const onSubmit = async (values: ReferralMemberFormValues) => {
    try {
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        gender: values.gender,
        phone: `${values.mobileCountryCode}${values.mobile_number}`,
        whatsapp: `${values.whatsappCountryCode}${values.whatsapp_number}`,
        district: values.district,
        role: values.role === "TEAM_LEADER" ? "LEADER" : "MEMBER",
      };

      await createAgent(payload);
      reset();
      onClose();
    } catch {
      // errors handled by the hook
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
                    New Member Registration Form
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
                <motion.div
                  variants={itemVariants}
                  className="flex-1 overflow-y-auto"
                >
                  <form
                    id="add-referral-member-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="px-6 py-6 custom-scrollbar"
                  >
                    <div className="flex flex-col gap-5">
                      {/* Name row */}
                      <div className="grid grid-cols-2 gap-4">
                        {/* First Name */}
                        <div className="space-y-1">
                          <FieldLabel required>First Name</FieldLabel>
                          <Input
                            {...register("first_name")}
                            className={cn(
                              AUTH_INPUT.base,
                              AUTH_INPUT.placeholder,
                              errors.first_name && "border-red-500 focus-visible:ring-red-500"
                            )}
                            placeholder="eg: John"
                          />
                          {errors.first_name && (
                            <p className="mt-1 text-xs text-red-500">{errors.first_name.message}</p>
                          )}
                        </div>

                        {/* Last Name */}
                        <div className="space-y-1">
                          <FieldLabel required>Last Name</FieldLabel>
                          <Input
                            {...register("last_name")}
                            className={cn(
                              AUTH_INPUT.base,
                              AUTH_INPUT.placeholder,
                              errors.last_name && "border-red-500 focus-visible:ring-red-500"
                            )}
                            placeholder="eg: Doe"
                          />
                          {errors.last_name && (
                            <p className="mt-1 text-xs text-red-500">{errors.last_name.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <FieldLabel required>Email</FieldLabel>
                        <Input
                          type="email"
                          {...register("email")}
                          className={cn(
                            AUTH_INPUT.base,
                            AUTH_INPUT.placeholder,
                            errors.email && "border-red-500 focus-visible:ring-red-500"
                          )}
                          placeholder="eg: user@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                        )}
                      </div>

                      {/* Gender */}
                      <div className="space-y-1">
                        <FieldLabel required>Gender</FieldLabel>
                        <Select onValueChange={(val) => setValue("gender", val as "MALE" | "FEMALE", { shouldDirty: true, shouldValidate: true })}>
                          <SelectTrigger className={cn(
                            AUTH_INPUT.base, 
                            "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic",
                            errors.gender && "border-red-500 focus:ring-red-500"
                          )}>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="z-[99999999]">
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.gender && (
                          <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div className="flex flex-col">
                        <FieldLabel required className="mb-1">Phone number</FieldLabel>
                        <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                          Only use numbers; do not include any spaces.
                        </p>
                        <div
                          className={cn(
                            "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                            errors.mobile_number ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
                          )}
                        >
                          <Select
                            value={mobileCountryCode}
                            onValueChange={(val) => setValue("mobileCountryCode", val, { shouldDirty: true })}
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
                            className={cn("flex-1 bg-transparent px-3 py-2 text-sm outline-none", AUTH_INPUT.placeholder)}
                            placeholder="eg: 711234567"
                          />
                        </div>
                        {errors.mobile_number && (
                          <p className="text-xs text-red-500 mt-1">{errors.mobile_number.message}</p>
                        )}
                      </div>

                      {/* WhatsApp Number */}
                      <div className="flex flex-col">
                        <FieldLabel required className="mb-1">Whatsapp number</FieldLabel>
                        <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                          Only use numbers; do not include any spaces.
                        </p>
                        <div
                          className={cn(
                            "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                            errors.whatsapp_number ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
                          )}
                        >
                          <Select
                            value={whatsappCountryCode}
                            onValueChange={(val) => setValue("whatsappCountryCode", val, { shouldDirty: true })}
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
                            {...register("whatsapp_number")}
                            className={cn("flex-1 bg-transparent px-3 py-2 text-sm outline-none", AUTH_INPUT.placeholder)}
                            placeholder="eg: 771234567"
                          />
                        </div>
                        {errors.whatsapp_number && (
                          <p className="text-xs text-red-500 mt-1">{errors.whatsapp_number.message}</p>
                        )}
                      </div>

                      {/* District */}
                      <div className="space-y-1">
                        <FieldLabel required>District</FieldLabel>
                        <Select onValueChange={(val) => setValue("district", val, { shouldDirty: true, shouldValidate: true })}>
                          <SelectTrigger className={cn(
                            AUTH_INPUT.base, 
                            "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic",
                            errors.district && "border-red-500 focus:ring-red-500"
                          )}>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent className="z-[99999999]">
                            {DISTRICTS.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.district && (
                          <p className="mt-1 text-xs text-red-500">{errors.district.message}</p>
                        )}
                      </div>

                      {/* Role */}
                      <div className="space-y-3">
                        <FieldLabel>Role</FieldLabel>
                        <div className="flex flex-wrap gap-6">
                          {[
                            { value: "TEAM_MEMBER", label: "Team Member" },
                            { value: "TEAM_LEADER", label: "Team Leader" },
                          ].map((option) => (
                            <div key={option.value} className="flex items-center gap-2">
                              <input
                                type="radio"
                                id={`role-${option.value}`}
                                name="role"
                                value={option.value}
                                checked={role === option.value}
                                onChange={() => setValue("role", option.value as "TEAM_MEMBER" | "TEAM_LEADER", { shouldDirty: true })}
                                className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                              />
                              <label
                                htmlFor={`role-${option.value}`}
                                className="cursor-pointer text-sm font-medium text-[#45556C]"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
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
                    form="add-referral-member-form"
                    disabled={isPending}
                    className={cn(
                      BUTTON_STYLES.primary.md,
                      "px-8 text-sm font-semibold text-white"
                    )}
                  >
                    {isPending ? "Creating..." : "Create"}
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
