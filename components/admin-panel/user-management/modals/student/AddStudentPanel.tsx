"use client";

import React, { useState, useEffect } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, CalendarDays as CalendarIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";

import { cn } from "@/lib/utils";
import {
  AUTH_TYPOGRAPHY,
  AUTH_INPUT,
  BUTTON_STYLES,
} from "@/lib/constants/theme";
import { DISTRICTS } from "@/lib/constants/districts";
import { useCreateStudent } from "@/hooks/api/user-management/useCreateStudent";

// ===== SCHEMA =====

const studentSchema = z.object({
  full_name: z.string().min(1, "Student name is required."),
  email: z.string().email("Please enter a valid email address."),
  mobileCountryCode: z.string().default("+94"),
  mobile_number: z
    .string()
    .min(1, "Mobile number is required.")
    .regex(/^[0-9]{9}$/, "Mobile must be exactly 9 digits."),
  mobileCountryCode2: z.string().default("+94"),
  mobile_number_2: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{9}$/.test(val), "Mobile must be exactly 9 digits."),
  whatsappCountryCode: z.string().default("+94"),
  whatsapp_number: z
    .string()
    .min(1, "WhatsApp number is required.")
    .regex(/^[0-9]{9}$/, "WhatsApp must be exactly 9 digits."),
  gender: z.enum(["MALE", "FEMALE"], {
    required_error: "Gender is required.",
  }),
  nic: z
    .string()
    .min(1, "NIC is required.")
    .refine(
      (val) => {
        return /^[0-9]{9}[VX]$/i.test(val) || /^[0-9]{12}$/.test(val);
      },
      {
        message: "Invalid NIC format. Use Old (9 digits + V/X) or New (12 digits) format.",
      }
    ),
  dob: z.date({
    required_error: "Date of birth is required.",
  }),
  district: z.string().min(1, "District is required."),
  guardian_name: z.string().min(1, "Guardian name is required."),
  guardianCountryCode: z.string().default("+94"),
  guardian_phone: z
    .string()
    .min(1, "Guardian phone is required.")
    .regex(/^[0-9]{9}$/, "Phone must be exactly 9 digits."),
  
  // Uploads
  ol_result_image_url: z.string().optional(),
  al_result_image_url: z.string().optional(),
  nic_front_image_url: z.string().optional(),
  nic_back_image_url: z.string().optional(),
  profile_image_url: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

// ===== PROPS =====

interface AddStudentPanelProps {
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

// ===== COMPONENT =====

export function AddStudentPanel({ isOpen, onClose }: AddStudentPanelProps) {
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const { mutateAsync: createStudent, isPending } = useCreateStudent();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      full_name: "",
      email: "",
      mobileCountryCode: "+94",
      mobile_number: "",
      mobileCountryCode2: "+94",
      mobile_number_2: "",
      whatsappCountryCode: "+94",
      whatsapp_number: "",
      gender: undefined,
      nic: "",
      dob: undefined,
      district: "",
      guardian_name: "",
      guardianCountryCode: "+94",
      guardian_phone: "",
      ol_result_image_url: "",
      al_result_image_url: "",
      nic_front_image_url: "",
      nic_back_image_url: "",
      profile_image_url: "",
    },
  });

  const mobileCountryCode = watch("mobileCountryCode");
  const mobileCountryCode2 = watch("mobileCountryCode2");
  const whatsappCountryCode = watch("whatsappCountryCode");
  const guardianCountryCode = watch("guardianCountryCode");

  // Watch upload fields to sync with ImageUpload preview
  const ol_result_image_url = watch("ol_result_image_url");
  const al_result_image_url = watch("al_result_image_url");
  const nic_front_image_url = watch("nic_front_image_url");
  const profile_image_url = watch("profile_image_url");

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

  const onSubmit = async (values: StudentFormValues) => {
    try {
      const payload = {
        full_name: values.full_name,
        email: values.email,
        mobile_number: `${values.mobileCountryCode}${values.mobile_number}`,
        mobile_number_2: values.mobile_number_2 
          ? `${values.mobileCountryCode2}${values.mobile_number_2}` 
          : undefined,
        whatsapp_number: `${values.whatsappCountryCode}${values.whatsapp_number}`,
        gender: values.gender,
        nic: values.nic,
        dob: values.dob.toISOString(),
        district: values.district,
        guardian_name: values.guardian_name,
        guardian_phone: `${values.guardianCountryCode}${values.guardian_phone}`,
        ol_result_image_url: values.ol_result_image_url || undefined,
        al_result_image_url: values.al_result_image_url || undefined,
        nic_front_image_url: values.nic_front_image_url || undefined,
        nic_back_image_url: values.nic_back_image_url || undefined,
        profile_image_url: values.profile_image_url || undefined,
      };

      await createStudent(payload);
      reset();
      onClose();
    } catch {
      // errors handled by the hook's onError
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
                className="fixed right-0 top-0 z-[99999] flex h-screen w-full max-w-[550px] flex-col bg-white shadow-2xl"
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
                    Student Registration Form
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
                    id="add-student-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="px-6 py-6 custom-scrollbar"
                  >
                    <div className="flex flex-col gap-6">
                      
                      {/* Basic Info Section */}
                      <div className="grid grid-cols-1 gap-5">
                        {/* Student Name */}
                        <div className="space-y-1">
                          <FieldLabel required>Student Name</FieldLabel>
                          <Input
                            {...register("full_name")}
                            className={cn(
                              AUTH_INPUT.base,
                              AUTH_INPUT.placeholder,
                              errors.full_name && "border-red-500 focus-visible:ring-red-500"
                            )}
                            placeholder="Type here"
                          />
                          {errors.full_name && (
                            <p className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>
                          )}
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
                            placeholder="eg: ava.wright@gmail.com"
                          />
                          {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                          )}
                        </div>

                        {/* Mobile Number */}
                        <div className="flex flex-col">
                          <FieldLabel required>Mobile Number</FieldLabel>
                          <div
                            className={cn(
                              "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                              errors.mobile_number ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
                            )}
                          >
                            <Select
                              value={mobileCountryCode}
                              onValueChange={(val) => setValue("mobileCountryCode", val)}
                              disabled
                            >
                              <SelectTrigger className="h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0 text-[#0F172B]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="z-[99999999]">
                                <SelectItem value="+94">🇱🇰 +94</SelectItem>
                              </SelectContent>
                            </Select>
                            <input
                              {...register("mobile_number")}
                              className={cn(
                                "flex-1 bg-transparent px-3 py-2 text-sm outline-none text-[#0F172B]",
                                AUTH_INPUT.placeholder
                              )}
                              placeholder="eg: 77 234 5670"
                            />
                          </div>
                          {errors.mobile_number && (
                            <p className="mt-1 text-xs text-red-500">{errors.mobile_number.message}</p>
                          )}
                        </div>

                        {/* Mobile Number 2 */}
                        <div className="flex flex-col">
                          <FieldLabel>Mobile Number 2</FieldLabel>
                          <div
                            className={cn(
                              "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                              errors.mobile_number_2 ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
                            )}
                          >
                            <Select
                              value={mobileCountryCode2}
                              onValueChange={(val) => setValue("mobileCountryCode2", val)}
                              disabled
                            >
                              <SelectTrigger className="h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0 text-[#0F172B]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="z-[99999999]">
                                <SelectItem value="+94">🇱🇰 +94</SelectItem>
                              </SelectContent>
                            </Select>
                            <input
                              {...register("mobile_number_2")}
                              className={cn(
                                "flex-1 bg-transparent px-3 py-2 text-sm outline-none text-[#0F172B]",
                                AUTH_INPUT.placeholder
                              )}
                              placeholder="eg: 77 234 5670"
                            />
                          </div>
                          {errors.mobile_number_2 && (
                            <p className="mt-1 text-xs text-red-500">{errors.mobile_number_2.message}</p>
                          )}
                        </div>

                        {/* Whatsapp Number */}
                        <div className="flex flex-col">
                          <FieldLabel required>Whatsapp Number</FieldLabel>
                          <div
                            className={cn(
                              "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                              errors.whatsapp_number ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
                            )}
                          >
                            <Select
                              value={whatsappCountryCode}
                              onValueChange={(val) => setValue("whatsappCountryCode", val)}
                              disabled
                            >
                              <SelectTrigger className="h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0 text-[#0F172B]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="z-[99999999]">
                                <SelectItem value="+94">🇱🇰 +94</SelectItem>
                              </SelectContent>
                            </Select>
                            <input
                              {...register("whatsapp_number")}
                              className={cn(
                                "flex-1 bg-transparent px-3 py-2 text-sm outline-none text-[#0F172B]",
                                AUTH_INPUT.placeholder
                              )}
                              placeholder="eg: 77 234 5670"
                            />
                          </div>
                          {errors.whatsapp_number && (
                            <p className="mt-1 text-xs text-red-500">{errors.whatsapp_number.message}</p>
                          )}
                        </div>

                        {/* Gender & DOB Row */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <FieldLabel>Gender</FieldLabel>
                            <Controller
                              name="gender"
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className={cn(AUTH_INPUT.base, "text-[#0F172B]")}>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[99999999]">
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.gender && (
                              <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <FieldLabel required>Date of birth</FieldLabel>
                            <Controller
                              name="dob"
                              control={control}
                              render={({ field }) => (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <div className={cn(
                                      "flex h-10 w-full cursor-pointer items-center rounded-md border bg-white transition-all hover:bg-slate-50",
                                      errors.dob ? "border-red-500" : "border-gray-300"
                                    )}>
                                      <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
                                        <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                                      </div>
                                      <input
                                        value={field.value ? format(field.value, "dd/MM/yyyy") : ""}
                                        readOnly
                                        placeholder="type here"
                                        className="flex-1 cursor-pointer bg-transparent px-3 py-2 text-sm outline-none text-[#0F172B] placeholder:text-[#90A1B9] placeholder:italic pointer-events-none"
                                      />
                                    </div>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0 z-[99999999]" align="start">
                                    <DateRangeCalendar
                                      mode="single"
                                      startDate={field.value || null}
                                      endDate={null}
                                      onDateChange={(start) => field.onChange(start || undefined)}
                                    />
                                  </PopoverContent>
                                </Popover>
                              )}
                            />
                            {errors.dob && (
                              <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>
                            )}
                          </div>
                        </div>

                        {/* NIC & District Row */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <FieldLabel required>NIC</FieldLabel>
                            <Input
                              {...register("nic")}
                              className={cn(
                                AUTH_INPUT.base,
                                AUTH_INPUT.placeholder,
                                errors.nic && "border-red-500 focus-visible:ring-red-500"
                              )}
                              placeholder="type here"
                            />
                            {errors.nic && (
                              <p className="mt-1 text-xs text-red-500">{errors.nic.message}</p>
                            )}
                          </div>
                          <div className="space-y-1">
                            <FieldLabel>District</FieldLabel>
                            <Controller
                              name="district"
                              control={control}
                              render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                  <SelectTrigger className={cn(AUTH_INPUT.base, "text-[#0F172B]")}>
                                    <SelectValue placeholder="Select" />
                                  </SelectTrigger>
                                  <SelectContent className="z-[99999999]">
                                    {DISTRICTS.map(d => (
                                      <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {errors.district && (
                              <p className="mt-1 text-xs text-red-500">{errors.district.message}</p>
                            )}
                          </div>
                        </div>

                        {/* Guardian Section */}
                        <div className="space-y-1">
                          <FieldLabel required>Father /Mother /Guardian Name</FieldLabel>
                          <Input
                            {...register("guardian_name")}
                            className={cn(
                              AUTH_INPUT.base,
                              AUTH_INPUT.placeholder,
                              errors.guardian_name && "border-red-500 focus-visible:ring-red-500"
                            )}
                            placeholder="type here"
                          />
                          {errors.guardian_name && (
                            <p className="mt-1 text-xs text-red-500">{errors.guardian_name.message}</p>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <FieldLabel required>Father /Mother /Guardian Phone Number</FieldLabel>
                          <div
                            className={cn(
                              "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                              errors.guardian_phone ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
                            )}
                          >
                            <Select
                              value={guardianCountryCode}
                              onValueChange={(val) => setValue("guardianCountryCode", val)}
                              disabled
                            >
                              <SelectTrigger className="h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0 text-[#0F172B]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="z-[99999999]">
                                <SelectItem value="+94">🇱🇰 +94</SelectItem>
                              </SelectContent>
                            </Select>
                            <input
                              {...register("guardian_phone")}
                              className={cn(
                                "flex-1 bg-transparent px-3 py-2 text-sm outline-none text-[#0F172B]",
                                AUTH_INPUT.placeholder
                              )}
                              placeholder="eg: 77 234 5670"
                            />
                          </div>
                          {errors.guardian_phone && (
                            <p className="mt-1 text-xs text-red-500">{errors.guardian_phone.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Uploads Section */}
                      <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-2 gap-4">
                          {/* O/L Result */}
                          <div className="space-y-2">
                            <FieldLabel>O/L Result</FieldLabel>
                            <ImageUpload
                              imageUrl={ol_result_image_url || ""}
                              setImage={(url) => setValue("ol_result_image_url", url, { shouldDirty: true })}
                              removeImage={() => setValue("ol_result_image_url", "", { shouldDirty: true })}
                              placeholder={
                                <div className="text-center">
                                  <p>Click Here to upload or</p>
                                  <p>drag and drop here</p>
                                </div>
                              }
                            />
                          </div>
                          {/* A/L Result */}
                          <div className="space-y-2">
                            <FieldLabel>A/L Result</FieldLabel>
                            <ImageUpload
                              imageUrl={al_result_image_url || ""}
                              setImage={(url) => setValue("al_result_image_url", url, { shouldDirty: true })}
                              removeImage={() => setValue("al_result_image_url", "", { shouldDirty: true })}
                              placeholder={
                                <div className="text-center">
                                  <p>Click Here to upload or</p>
                                  <p>drag and drop here</p>
                                </div>
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {/* NIC Images */}
                          <div className="space-y-2">
                            <FieldLabel>NIC Images Front & Back</FieldLabel>
                            <ImageUpload
                              imageUrl={nic_front_image_url || ""}
                              setImage={(url) => setValue("nic_front_image_url", url, { shouldDirty: true })}
                              removeImage={() => setValue("nic_front_image_url", "", { shouldDirty: true })}
                              placeholder={
                                <div className="text-center">
                                  <p>Click Here to upload or</p>
                                  <p>drag and drop here</p>
                                </div>
                              }
                            />
                          </div>
                          {/* Passport Size Image */}
                          <div className="space-y-2">
                            <FieldLabel>Passport Size Image</FieldLabel>
                            <ImageUpload
                              imageUrl={profile_image_url || ""}
                              setImage={(url) => setValue("profile_image_url", url, { shouldDirty: true })}
                              removeImage={() => setValue("profile_image_url", "", { shouldDirty: true })}
                              placeholder={
                                <div className="text-center">
                                  <p>Click Here to upload or</p>
                                  <p>drag and drop here</p>
                                </div>
                              }
                            />
                          </div>
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
                    form="add-student-form"
                    disabled={isPending}
                    className={cn(
                      BUTTON_STYLES.primary.full,
                      "w-auto px-6 text-sm font-semibold text-white"
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
