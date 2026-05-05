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
import {
  AUTH_TYPOGRAPHY,
  AUTH_INPUT,
  BUTTON_STYLES,
} from "@/lib/constants/theme";
import { useCreateStaff } from "@/hooks/api/staff/useCreateStaff";
import { useGetBranches } from "@/hooks/api/branches/useGetBranches";
import { DISTRICTS } from "@/lib/constants/districts";

// ===== SCHEMA =====

const staffSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  email: z.string().email("Please enter a valid email address."),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  nic: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;

        return /^[0-9]{9}[VX]$/.test(val) || /^[0-9]{12}$/.test(val);
      },
      {
        message: "Invalid NIC format. Use Old (9 digits + V/X) or New (12 digits) format with uppercase letters.",
      }
    ),
  mobileCountryCode: z.string(),
  mobile_number: z
    .string()
    .optional()
    .refine(val => !val || /^[0-9]{9}$/.test(val), "Mobile must be exactly 9 digits."),
  whatsappCountryCode: z.string(),
  whatsapp_number: z
    .string()
    .optional()
    .refine(val => !val || /^[0-9]{9}$/.test(val), "WhatsApp must be exactly 9 digits."),
  district: z.string().optional(),
  salary_type: z.enum(["MONTHLY", "PERCENTAGE_FROM_BATCH_DEPOSITS", "BATCH_OR_COURSE_WISE_PAYMENT"], {
    required_error: "Salary type is required.",
  }),
  salary_due_day: z.string().optional(),
  salary_due_frequency: z.string().optional(),
  is_branch_manager: z.boolean().default(false),
  branch_id: z.string().optional(),
  privilege_codes: z.array(z.string()).default([]),
});

type StaffFormValues = z.infer<typeof staffSchema>;

// ===== PROPS =====

interface AddStaffPanelProps {
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

// ===== CONSTANTS =====

const SALARY_TYPES = [
  { value: "MONTHLY", label: "Monthly Salary" },
  { value: "PERCENTAGE_FROM_BATCH_DEPOSITS", label: "Percentage from batch deposit" },
  { value: "BATCH_OR_COURSE_WISE_PAYMENT", label: "Batch or Course Wise Payment" },
] as const;

const PRIVILEGES = [
  { value: "all", label: "All Privileges" },
  { value: "user_management", label: "User Management" },
  { value: "course_management", label: "Course Management" },
  { value: "branch_management", label: "Branch Management" },
] as const;

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

export function AddStaffPanel({ isOpen, onClose }: AddStaffPanelProps) {
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const { mutateAsync: createStaff, isPending } = useCreateStaff();
  const { data: branchData } = useGetBranches({ size: 100 });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      gender: undefined,
      nic: "",
      mobileCountryCode: "+94",
      mobile_number: "",
      whatsappCountryCode: "+94",
      whatsapp_number: "",
      district: undefined,
      salary_type: undefined,
      is_branch_manager: false,
      branch_id: undefined,
      privilege_codes: [],
      salary_due_day: undefined,
      salary_due_frequency: "EVERY_MONTH",
    },
  });

  const mobileCountryCode = watch("mobileCountryCode");
  const whatsappCountryCode = watch("whatsappCountryCode");
  const salaryType = watch("salary_type");
  const privilegeCodes = watch("privilege_codes");

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

  const onSubmit = async (values: StaffFormValues) => {
    try {
      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        mobile_number: values.mobile_number ? `${values.mobileCountryCode}${values.mobile_number}` : "",
        ...(values.whatsapp_number
          ? { whatsapp_number: `${values.whatsappCountryCode}${values.whatsapp_number}` }
          : {}),
        ...(values.nic ? { nic: values.nic } : {}),
        ...(values.district ? { district: values.district } : {}),
        ...(values.gender ? { gender: values.gender } : {}),
        salary_type: values.salary_type,
        is_branch_manager: values.is_branch_manager,
        ...(values.branch_id ? { branch_id: values.branch_id } : {}),
        ...(values.salary_due_day ? { salary_due_day: values.salary_due_day } : {}),
        ...(values.salary_due_frequency ? { salary_due_frequency: values.salary_due_frequency } : {}),
        privilege_codes: values.privilege_codes.length > 0 ? values.privilege_codes : ["all"],
      };

      await createStaff(payload);
      reset();
      onClose();
    } catch {
      // errors handled by the hook's onError
    }
  };

  const togglePrivilege = (code: string) => {
    const current = [...privilegeCodes];
    const index = current.indexOf(code);

    if (index === -1) {
      current.push(code);
    } else {
      current.splice(index, 1);
    }

    setValue("privilege_codes", current, { shouldDirty: true });
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
                    Staff Registration Form
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
                    id="add-staff-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="px-6 py-6 custom-scrollbar"
                  >
                    <div className="flex flex-col gap-5">
                      {/* --- Names row --- */}
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
                        <FieldLabel>Gender</FieldLabel>
                        <Select onValueChange={(val) => setValue("gender", val as "MALE" | "FEMALE", { shouldDirty: true })}>
                          <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="z-[99999999]">
                            <SelectItem value="MALE">Male</SelectItem>
                            <SelectItem value="FEMALE">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* NIC */}
                      <div className="space-y-1">
                        <FieldLabel>NIC</FieldLabel>
                        <Input
                          {...register("nic")}
                          className={cn(
                            AUTH_INPUT.base,
                            AUTH_INPUT.placeholder,
                            errors.nic && "border-red-500 focus-visible:ring-red-500"
                          )}
                          placeholder="eg: 981234567V"
                        />
                        {errors.nic && (
                          <p className="mt-1 text-xs text-red-500">{errors.nic.message}</p>
                        )}
                      </div>

                      {/* Mobile Number */}
                      <div className="flex flex-col">
                        <FieldLabel className="mb-1">Mobile Number</FieldLabel>
                        <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                          Only use numbers; do not include any spaces.
                        </p>
                        <div className={cn(
                          "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                          errors.mobile_number ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
                        )}>
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
                        <FieldLabel className="mb-1">WhatsApp Number</FieldLabel>
                        <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                          Only use numbers; do not include any spaces.
                        </p>
                        <div className={cn(
                          "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                          errors.whatsapp_number ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
                        )}>
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
                        <FieldLabel>District</FieldLabel>
                        <Select onValueChange={(val) => setValue("district", val, { shouldDirty: true })}>
                          <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent className="z-[99999999]">
                            {DISTRICTS.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Branch */}
                      <div className="space-y-1">
                        <FieldLabel>Branch</FieldLabel>
                        <Select onValueChange={(val) => setValue("branch_id", val, { shouldDirty: true })}>
                          <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                            <SelectValue placeholder="Select branch" />
                          </SelectTrigger>
                          <SelectContent className="z-[99999999]">
                            {branchData?.results?.map((branch) => (
                              <SelectItem key={branch.id} value={branch.id}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Make this user a Branch Manager */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="branch-manager"
                          {...register("is_branch_manager")}
                          className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                        />
                        <label
                          htmlFor="branch-manager"
                          className="text-[13px] font-medium text-[#45556C] cursor-pointer"
                        >
                          Make this user a Branch Manager
                        </label>
                      </div>

                      {/* Salary Type */}
                      <div className="space-y-3">
                        <FieldLabel required>Salary Type</FieldLabel>
                        {errors.salary_type && (
                          <p className="text-xs text-red-500">{errors.salary_type.message}</p>
                        )}
                        <div className="flex flex-col gap-3">
                          {SALARY_TYPES.map((type) => (
                            <div key={type.value} className="flex items-center gap-2">
                              <input
                                type="radio"
                                id={`salary-${type.value}`}
                                name="salary_type"
                                value={type.value}
                                checked={salaryType === type.value}
                                onChange={() => setValue("salary_type", type.value as any, { shouldDirty: true, shouldValidate: true })}
                                className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                              />
                              <label
                                htmlFor={`salary-${type.value}`}
                                className="cursor-pointer text-sm font-medium text-[#45556C]"
                              >
                                {type.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Salary Due */}
                      <div className="space-y-1.5">
                        <FieldLabel>Salary Due</FieldLabel>
                        <div className="grid grid-cols-2 gap-3">
                          {/* Day Selector */}
                          <Select onValueChange={(val) => setValue("salary_due_day", val, { shouldDirty: true })}>
                            <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9]")}>
                              <SelectValue placeholder="Date" />
                            </SelectTrigger>
                            <SelectContent className="z-[99999999] max-h-[200px]">
                              {Array.from({ length: 31 }, (_, i) => (
                                <SelectItem key={i + 1} value={(i + 1).toString()}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Frequency Selector */}
                          <Select 
                            defaultValue="EVERY_MONTH"
                            onValueChange={(val) => setValue("salary_due_frequency", val, { shouldDirty: true })}
                          >
                            <SelectTrigger className={cn(AUTH_INPUT.base, "text-[#1D293D]")}>
                              <SelectValue placeholder="Every Month" />
                            </SelectTrigger>
                            <SelectContent className="z-[99999999]">
                              <SelectItem value="EVERY_MONTH">Every Month</SelectItem>
                              <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                              <SelectItem value="YEARLY">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Privileges */}
                      <div className="space-y-3 pt-2">
                        <FieldLabel>Privileges</FieldLabel>
                        <div className="flex flex-col gap-3">
                          {PRIVILEGES.map((priv) => (
                            <div key={priv.value} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`privilege-${priv.value}`}
                                checked={privilegeCodes.includes(priv.value)}
                                onChange={() => togglePrivilege(priv.value)}
                                className="h-4 w-4 cursor-pointer rounded-sm accent-[#0F172B]"
                              />
                              <label
                                htmlFor={`privilege-${priv.value}`}
                                className="cursor-pointer text-sm font-medium text-[#45556C]"
                              >
                                {priv.label}
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
                    form="add-staff-form"
                    disabled={isPending}
                    className={cn(
                      BUTTON_STYLES.primary.md,
                      "px-6 text-sm font-semibold text-white"
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
