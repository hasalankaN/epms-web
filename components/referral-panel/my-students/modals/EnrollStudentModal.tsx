"use client";

import React, { useState, useEffect } from "react";

import { X, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import ImageUpload from "@/components/common/ImageUpload";
import { SearchableSelect } from "@/components/ui/searchable-select";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { DISTRICTS } from "@/lib/constants/districts";

// ===== SCHEMA =====
const enrollStudentSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  nic: z.string().min(1, "NIC is required."),
  district: z.string().min(1, "District is required."),
  phoneCountryCode: z.string().default("+94"),
  phone_number: z.string().min(1, "Phone number is required."),
  whatsappCountryCode: z.string().default("+94"),
  whatsapp_number: z.string().min(1, "Whatsapp number is required."),
  email: z.string().email("Please enter a valid email address."),
  batch_course: z.string().min(1, "Batch/Course is required."),
  payment_amount: z.string().min(1, "Payment amount is required."),
  reference_number: z.string().min(1, "Reference number is required."),
  payment_source: z.enum(["BOC", "PEOPLES_BANK"], { required_error: "Payment source is required." }),
  payment_type: z.string().min(1, "Payment type is required."),
  bank_slip: z.string().min(1, "Bank slip is required."),
});

type EnrollStudentFormValues = z.infer<typeof enrollStudentSchema>;

// ===== PROPS =====
interface EnrollStudentModalProps {
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
export function EnrollStudentModal({ isOpen, onClose }: EnrollStudentModalProps) {
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [batchSearch, setBatchSearch] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isDirty },
  } = useForm<EnrollStudentFormValues>({
    resolver: zodResolver(enrollStudentSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      nic: "",
      district: "",
      phoneCountryCode: "+94",
      phone_number: "",
      whatsappCountryCode: "+94",
      whatsapp_number: "",
      email: "",
      batch_course: "",
      payment_amount: "",
      reference_number: "",
      payment_source: undefined,
      payment_type: "",
      bank_slip: "",
    },
  });

  const phoneCountryCode = watch("phoneCountryCode");
  const whatsappCountryCode = watch("whatsappCountryCode");
  const district = watch("district");
  const paymentType = watch("payment_type");
  const paymentSource = watch("payment_source");

  // Mock options for SearchableSelect
  const batchOptions = [
    { value: "BATCH_01", label: "Batch 01" },
    { value: "BATCH_02", label: "Batch 02" },
    { value: "COURSE_01", label: "Full Stack Course" },
    { value: "COURSE_02", label: "UI/UX Design" },
  ].filter(opt => opt.label.toLowerCase().includes(batchSearch.toLowerCase()));

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      reset({
        first_name: "",
        last_name: "",
        nic: "",
        district: "",
        phoneCountryCode: "+94",
        phone_number: "",
        whatsappCountryCode: "+94",
        whatsapp_number: "",
        email: "",
        batch_course: "",
        payment_amount: "",
        reference_number: "",
        payment_source: undefined,
        payment_type: "",
        bank_slip: "",
      });
      setShowDiscardModal(false);
      setBatchSearch("");
    }
  }, [isOpen, reset]);

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const onSubmit = async (values: EnrollStudentFormValues) => {
    try {
      setIsPending(true);

      // Simulate API call
      console.log("Enroll Student Values:", values);
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
          className="flex h-[704px] w-[95%] max-w-[720px] flex-col gap-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
                Enroll New Student
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
            id="enroll-student-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto pt-[16px] custom-scrollbar pr-2 -mr-2"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* NIC */}
              <div className="space-y-1">
                <FieldLabel required>NIC</FieldLabel>
                <Input
                  {...register("nic")}
                  className={cn(
                    AUTH_INPUT.base,
                    AUTH_INPUT.placeholder,
                    errors.nic && "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="eg: 123456789V"
                />
                {errors.nic && (
                  <p className="mt-1 text-xs text-red-500">{errors.nic.message}</p>
                )}
              </div>

              {/* District */}
              <div className="space-y-1">
                <FieldLabel required>District</FieldLabel>
                <Select
                  value={district}
                  onValueChange={(val) => setValue("district", val, { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger className={cn(
                    AUTH_INPUT.base,
                    "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic",
                    errors.district && "border-red-500 focus:ring-red-500"
                  )}>
                    <SelectValue placeholder="Select" />
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

              {/* Phone Number */}
              <div className="flex flex-col">
                <FieldLabel required className="mb-1">Phone Number</FieldLabel>
                <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                  Only use numbers; do not include any spaces.
                </p>
                <div
                  className={cn(
                    "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                    errors.phone_number ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
                  )}
                >
                  <Select
                    value={phoneCountryCode}
                    onValueChange={(val) => setValue("phoneCountryCode", val, { shouldDirty: true })}
                    disabled
                  >
                    <SelectTrigger className="h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0">
                      <div className="flex items-center gap-1">
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="z-[99999999]">
                      <SelectItem value="+94">🇱🇰 +94</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    {...register("phone_number")}
                    className={cn("flex-1 bg-transparent px-3 py-2 text-sm outline-none", AUTH_INPUT.placeholder)}
                    placeholder="771234567"
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone_number.message}</p>
                )}
              </div>

              {/* Whatsapp Number */}
              <div className="flex flex-col">
                <FieldLabel required className="mb-1">Whatsapp Number</FieldLabel>
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
                      <div className="flex items-center gap-1">
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="z-[99999999]">
                      <SelectItem value="+94">🇱🇰 +94</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    {...register("whatsapp_number")}
                    className={cn("flex-1 bg-transparent px-3 py-2 text-sm outline-none", AUTH_INPUT.placeholder)}
                    placeholder="771234567"
                  />
                </div>
                {errors.whatsapp_number && (
                  <p className="text-xs text-red-500 mt-1">{errors.whatsapp_number.message}</p>
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
                  placeholder="eg: john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Select Batch/Course */}
              <div className="space-y-1">
                <FieldLabel required>Select Batch/Course</FieldLabel>
                <Controller
                  name="batch_course"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      options={batchOptions}
                      value={field.value}
                      onChange={(val: string) => field.onChange(val)}
                      searchValue={batchSearch}
                      onSearchChange={setBatchSearch}
                      placeholder="Select"
                      error={!!errors.batch_course}
                    />
                  )}
                />
                {errors.batch_course && (
                  <p className="mt-1 text-xs text-red-500">{errors.batch_course.message}</p>
                )}
              </div>

              {/* Payment Amount */}
              <div className="space-y-1">
                <FieldLabel required>Enter Payment Amount</FieldLabel>
                <div className="relative">
                  <Input
                    {...register("payment_amount")}
                    className={cn(
                      AUTH_INPUT.base,
                      AUTH_INPUT.placeholder,
                      "pr-12",
                      errors.payment_amount && "border-red-500 focus-visible:ring-red-500"
                    )}
                    placeholder="eg: 1,000.00"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#1D293D]">
                    LKR
                  </div>
                </div>
                {errors.payment_amount && (
                  <p className="mt-1 text-xs text-red-500">{errors.payment_amount.message}</p>
                )}
              </div>

              {/* Reference Number */}
              <div className="space-y-1">
                <FieldLabel required>Enter Reference Number</FieldLabel>
                <Input
                  {...register("reference_number")}
                  className={cn(
                    AUTH_INPUT.base,
                    AUTH_INPUT.placeholder,
                    errors.reference_number && "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="eg: 123456"
                />
                {errors.reference_number && (
                  <p className="mt-1 text-xs text-red-500">{errors.reference_number.message}</p>
                )}
              </div>

              {/* Payment Source */}
              <div className="col-span-1 sm:col-span-1 space-y-3">
                <FieldLabel>Select Payment Source</FieldLabel>
                <div className="flex items-center gap-4 pt-1">
                  {[
                    { value: "BOC", label: "BOC" },
                    { value: "PEOPLES_BANK", label: "Peoples Bank" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                       <input
                        type="radio"
                        id={`payment-source-${option.value}`}
                        name="payment_source"
                        value={option.value}
                        checked={paymentSource === option.value}
                        onChange={() => setValue("payment_source", option.value as any, { shouldDirty: true, shouldValidate: true })}
                        className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                      />
                      <label
                        htmlFor={`payment-source-${option.value}`}
                        className="cursor-pointer text-sm font-medium text-[#45556C]"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.payment_source && (
                  <p className="mt-1 text-xs text-red-500">{errors.payment_source.message}</p>
                )}
              </div>

              {/* Payment Type */}
              <div className="space-y-1">
                <FieldLabel required>Select Payment Type</FieldLabel>
                <Select
                  value={paymentType}
                  onValueChange={(val) => setValue("payment_type", val, { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger className={cn(
                    AUTH_INPUT.base,
                    "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic",
                    errors.payment_type && "border-red-500 focus:ring-red-500"
                  )}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="z-[99999999]">
                    <SelectItem value="FULL_PAYMENT">Full Payment</SelectItem>
                    <SelectItem value="INSTALLMENT">Installment</SelectItem>
                  </SelectContent>
                </Select>
                {errors.payment_type && (
                  <p className="mt-1 text-xs text-red-500">{errors.payment_type.message}</p>
                )}
              </div>

              {/* Upload Bank Slip */}
              <div className="col-span-1 sm:col-span-1 space-y-1">
                <FieldLabel required>Upload Bank Slip</FieldLabel>
                <Controller
                  name="bank_slip"
                  control={control}
                  render={({ field }) => (
                    <div className="h-[148px] w-full">
                      <ImageUpload
                        imageUrl={field.value}
                        setImage={field.onChange}
                        removeImage={() => field.onChange("")}
                        placeholder="Upload Image Here or drag and drop here"
                        className="h-full w-full"
                        dropzoneClassName={cn(
                          "!h-full !border-dashed !border-[#E2E8F0] !bg-transparent !p-0 !rounded-lg",
                          errors.bank_slip && "!border-red-500"
                        )}
                      />
                    </div>
                  )}
                />
                {errors.bank_slip && (
                  <p className="mt-1 text-xs text-red-500">{errors.bank_slip.message}</p>
                )}
              </div>
            </div>
          </motion.form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="flex items-center justify-end pt-2 shrink-0 mt-auto">
            <Button
              type="submit"
              form="enroll-student-form"
              disabled={isPending}
              className={cn(
                BUTTON_STYLES.primary.md,
                "font-inter text-[14px] font-semibold text-white leading-5 px-10 h-10 bg-[#E60076] hover:bg-[#F6339A]"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
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
