"use client";

import React, { useEffect, useState } from "react";

import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
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

import { cn } from "@/lib/utils";
import {
  AUTH_TYPOGRAPHY,
  AUTH_INPUT,
  BUTTON_STYLES,
} from "@/lib/constants/theme";
import { useGetLecturerById } from "@/hooks/api/lecturers/useGetLecturerById";
import { useUpdateLecturer } from "@/hooks/api/lecturers/useUpdateLecturer";
import { useGetBranches } from "@/hooks/api/branches/useGetBranches";
import { DISTRICTS } from "@/lib/constants/districts";

// ===== SCHEMA =====
const editLecturerSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
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
        message: "Invalid NIC format. Use Old (9 digits + V/X) or New (12 digits) format.",
      }
    ),
  mobileCountryCode: z.string(),
  mobile_number: z
    .string()
    .min(1, "Mobile number is required.")
    .regex(/^[0-9]{9}$/, "Mobile must be exactly 9 digits."),
  whatsappCountryCode: z.string(),
  whatsapp_number: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[0-9]{9}$/.test(val),
      { message: "WhatsApp must be exactly 9 digits." }
    ),
  district: z.string().optional(),
  salary_type: z.enum(
    [
      "MONTHLY",
      "PERCENTAGE_FROM_BATCH_DEPOSITS",
      "COURSE_WISE_PAYMENTS",
      "BATCH_WISE_PAYMENTS",
    ],
    {
      required_error: "Salary type is required.",
    }
  ),
  branch_id: z.string().optional(),
});

type EditLecturerFormValues = z.infer<typeof editLecturerSchema>;

// ===== PROPS =====
interface EditLecturerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecturerId: string | null;
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

// ===== SALARY TYPES =====
const SALARY_TYPES = [
  { value: "MONTHLY", label: "Monthly Salary" },
  {
    value: "PERCENTAGE_FROM_BATCH_DEPOSITS",
    label: "Percentage from Batch Deposits",
  },
  { value: "COURSE_WISE_PAYMENTS", label: "Course-wise Payments" },
  { value: "BATCH_WISE_PAYMENTS", label: "Batch-wise Payments" },
] as const;

// ===== COMPONENT =====
export function EditLecturerModal({
  isOpen,
  onClose,
  lecturerId,
}: EditLecturerModalProps) {
  const { data: lecturerDetail, isLoading: isLoadingLecturer } = useGetLecturerById(
    isOpen ? lecturerId : null
  );

  const lecturer = lecturerDetail?.profile;

  const { mutateAsync: updateLecturer, isPending: isUpdating } = useUpdateLecturer(
    lecturerId || ""
  );

  const { data: branchData } = useGetBranches({ size: 100 });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<EditLecturerFormValues>({
    resolver: zodResolver(editLecturerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: undefined,
      nic: "",
      mobileCountryCode: "+94",
      mobile_number: "",
      whatsappCountryCode: "+94",
      whatsapp_number: "",
      district: undefined,
      salary_type: undefined as any,
      branch_id: undefined,
    },
  });

  const mobileCountryCode = watch("mobileCountryCode");
  const whatsappCountryCode = watch("whatsappCountryCode");
  const salaryType = watch("salary_type");

  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  // Prefill form when lecturer data is loaded
  useEffect(() => {
    if (isOpen && lecturer) {
      // Strip country code for phone numbers if present
      const cleanMobile = lecturer.mobile_number?.startsWith("+94")
        ? lecturer.mobile_number.slice(3)
        : lecturer.mobile_number || "";

      const cleanWhatsapp = lecturer.whatsapp_number?.startsWith("+94")
        ? lecturer.whatsapp_number.slice(3)
        : lecturer.whatsapp_number || "";

      reset({
        first_name: lecturer.first_name || "",
        last_name: lecturer.last_name || "",
        gender: lecturer.gender ? (lecturer.gender as any) : undefined,
        nic: lecturer.nic || "",
        mobileCountryCode: "+94",
        mobile_number: cleanMobile,
        whatsappCountryCode: "+94",
        whatsapp_number: cleanWhatsapp,
        district: lecturer.district || undefined,
        salary_type: lecturer.salary_type || undefined,
        branch_id: lecturer.branch_id || undefined,
      });
    }
  }, [isOpen, lecturer, reset]);

  const onSubmit = async (values: EditLecturerFormValues) => {
    try {
      await updateLecturer({
        first_name: values.first_name,
        last_name: values.last_name,
        mobile_number: `${values.mobileCountryCode}${values.mobile_number}`,
        ...(values.whatsapp_number
          ? { whatsapp_number: `${values.whatsappCountryCode}${values.whatsapp_number}` }
          : {}),
        ...(values.nic ? { nic: values.nic } : {}),
        ...(values.district ? { district: values.district } : {}),
        ...(values.gender ? { gender: values.gender } : {}),
        salary_type: values.salary_type,
        ...(values.branch_id ? { branch_id: values.branch_id } : {}),
      });

      onClose();
    } catch {
      // errors handled by hook's onError
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent
        isLoading={isLoadingLecturer}
        animateChildren={true}
        className="flex max-h-[90vh] w-[95%] max-w-[720px] flex-col gap-0 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
      >
        {/* ===== HEADER ===== */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 p-4 sm:p-6 pb-0 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              Edit Lecturer
            </DialogTitle>
            <button
              onClick={handleCloseAttempt}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </motion.div>

        {/* ===== BODY (Scrollable) ===== */}
        <motion.form
          key={lecturerId}
          variants={itemVariants}
          id="edit-lecturer-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-4 sm:p-6 sm:pt-4 pt-4 custom-scrollbar"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
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
                placeholder="eg: Perera"
              />
              {errors.last_name && (
                <p className="mt-1 text-xs text-red-500">{errors.last_name.message}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <FieldLabel>Gender</FieldLabel>
              <Select
                value={watch("gender")}
                onValueChange={(val) =>
                  setValue("gender", val as "MALE" | "FEMALE", { shouldDirty: true })
                }
              >
                <SelectTrigger
                  className={cn(
                    AUTH_INPUT.base,
                    "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic"
                  )}
                >
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
                placeholder="eg: 951234567V"
              />
              {errors.nic && (
                <p className="mt-1 text-xs text-red-500">{errors.nic.message}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col">
              <FieldLabel required className="mb-1">Mobile Number</FieldLabel>
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
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  {...register("mobile_number")}
                  className={cn(
                    "flex-1 bg-transparent px-3 py-2 text-sm outline-none",
                    AUTH_INPUT.placeholder
                  )}
                  placeholder="eg: 711234567"
                />
              </div>
              {errors.mobile_number && (
                <p className="mt-1 text-xs text-red-500">{errors.mobile_number.message}</p>
              )}
            </div>

            {/* WhatsApp Number */}
            <div className="flex flex-col">
              <FieldLabel className="mb-1">WhatsApp Number</FieldLabel>
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
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  {...register("whatsapp_number")}
                  className={cn(
                    "flex-1 bg-transparent px-3 py-2 text-sm outline-none",
                    AUTH_INPUT.placeholder
                  )}
                  placeholder="eg: 771234567"
                />
              </div>
              {errors.whatsapp_number && (
                <p className="mt-1 text-xs text-red-500">{errors.whatsapp_number.message}</p>
              )}
            </div>

            {/* District */}
            <div className="space-y-1">
              <FieldLabel>District</FieldLabel>
              <Select
                value={watch("district")}
                onValueChange={(val) => setValue("district", val, { shouldDirty: true })}
              >
                <SelectTrigger
                  className={cn(
                    AUTH_INPUT.base,
                    "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic"
                  )}
                >
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
              <Select
                value={watch("branch_id")}
                onValueChange={(val) => setValue("branch_id", val, { shouldDirty: true })}
              >
                <SelectTrigger
                  className={cn(
                    AUTH_INPUT.base,
                    "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic"
                  )}
                >
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

            {/* Salary Type */}
            <div className="col-span-1 sm:col-span-2 space-y-3">
              <FieldLabel required>Salary Type</FieldLabel>
              {errors.salary_type && (
                <p className="text-xs text-red-500">{errors.salary_type.message}</p>
              )}
              <div className="flex flex-col gap-3">
                {SALARY_TYPES.map((type) => (
                  <div key={type.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`edit-salary-${type.value}`}
                      name="edit_salary_type"
                      value={type.value}
                      checked={salaryType === type.value}
                      onChange={() =>
                        setValue("salary_type", type.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                    />
                    <label
                      htmlFor={`edit-salary-${type.value}`}
                      className="cursor-pointer text-sm font-medium text-[#45556C]"
                    >
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.form>

        {/* ===== FOOTER ===== */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-end gap-3 p-4 sm:p-6 pt-4 border-t border-[#E2E8F0] shrink-0 mt-auto"
        >
          <Button
            type="submit"
            form="edit-lecturer-form"
            disabled={isUpdating || !isDirty}
            className={cn(
              BUTTON_STYLES.primary.full,
              "w-auto px-6 font-inter text-[14px] font-semibold text-white leading-5"
            )}
          >
            {isUpdating ? "Saving..." : "Update Details"}
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
      title="Save Your Edits First"
      description="Unsaved changes detected, remember to save your edits before you close!"
      confirmText="Proceed Without Saving"
      cancelText="Go Back and Save"
    />
    </>
  );
}
