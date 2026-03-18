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
import { Textarea } from "@/components/ui/textarea";
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
import type { BranchRow } from "@/types/branch";
import { useCreateBranch } from "@/hooks/api/branches/useCreateBranch";
import { useGetBranchById } from "@/hooks/api/branches/useGetBranchById";
import { useUpdateBranch } from "@/hooks/api/branches/useUpdateBranch";

// ===== SCHEMA =====
const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required."),
  email: z.string().email("Please enter a valid email address."),
  contactCountryCode: z.string(),
  phone: z
    .string()
    .regex(/^[0-9]{9}$/, "Phone must be exactly 9 digits.")
    .min(1, "Contact number is required."),
  whatsappCountryCode: z.string(),
  whatsapp: z
    .string()
    .regex(/^[0-9]{9}$/, "WhatsApp must be exactly 9 digits.")
    .min(1, "WhatsApp number is required."),
  address: z.string().min(1, "Address is required."),
  branch_type: z.enum(["MAIN", "DEVOTIONAL", "CITY"], {
    required_error: "Branch type is required.",
  }),
});

type BranchFormValues = z.infer<typeof branchSchema>;

// ===== PROPS =====
interface AddEditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: BranchRow | null;
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

const BRANCH_TYPE_OPTIONS = [
  { value: "MAIN", label: "Main" },
  { value: "DEVOTIONAL", label: "Devotional" },
  { value: "CITY", label: "City" },
] as const;

// ===== COMPONENT =====
export function AddEditBranchModal({
  isOpen,
  onClose,
  branch,
}: AddEditBranchModalProps) {
  const isEditing = !!branch;

  const { data: branchDetail, isLoading: isLoadingBranch } = useGetBranchById(
    isEditing ? branch?.id : null
  );

  const { mutateAsync: createBranch, isPending: isCreating } = useCreateBranch();
  const { mutateAsync: updateBranch, isPending: isUpdating } = useUpdateBranch(branch?.id || "");

  const isPending = isCreating || isUpdating;

  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      email: "",
      contactCountryCode: "+94",
      phone: "",
      whatsappCountryCode: "+94",
      whatsapp: "",
      address: "",
      branch_type: undefined,
    },
  });

  const contactCountryCode = watch("contactCountryCode");
  const whatsappCountryCode = watch("whatsappCountryCode");
  const branchType = watch("branch_type");

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  // Prefill or reset when modal opens or data is fetched
  useEffect(() => {
    if (isOpen) {
      if (isEditing && branchDetail) {
        // Extract phone number without country code if possible, 
        // but based on API response example "+94112345678"
        // we might need to strip the prefix or use as is
        const cleanPhone = branchDetail.phone.startsWith("+94") 
          ? branchDetail.phone.slice(3) 
          : branchDetail.phone;

        const cleanWhatsapp = branchDetail.whatsapp.startsWith("+94") 
          ? branchDetail.whatsapp.slice(3) 
          : branchDetail.whatsapp;

        reset({
          name: branchDetail.name || "",
          email: branchDetail.email || "",
          contactCountryCode: "+94",
          phone: cleanPhone || "",
          whatsappCountryCode: "+94",
          whatsapp: cleanWhatsapp || "",
          address: branchDetail.address || "",
          branch_type: branchDetail.branch_type || undefined,
        });
      } else if (!isEditing) {
        reset({
          name: "",
          email: "",
          contactCountryCode: "+94",
          phone: "",
          whatsappCountryCode: "+94",
          whatsapp: "",
          address: "",
          branch_type: undefined,
        });
      }
    }
  }, [isOpen, branchDetail, isEditing, reset]);

  const onSubmit = async (values: BranchFormValues) => {
    try {
      const payload = {
        name: values.name,
        email: values.email,
        phone: `${values.contactCountryCode}${values.phone}`,
        whatsapp: `${values.whatsappCountryCode}${values.whatsapp}`,
        address: values.address,
        branch_type: values.branch_type,
      };

      if (isEditing) {
        await updateBranch(payload);
      } else {
        await createBranch(payload);
      }

      onClose();
    } catch (error) {
      console.error("Failed to save branch:", error);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent
          isLoading={isEditing && isLoadingBranch}
          animateChildren={true}
          className="flex max-h-[90vh] w-[95%] max-w-[720px] flex-col gap-0 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
        >
          {/* ===== HEADER ===== */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 p-4 sm:p-6 pb-0 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex-1 font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
                {isEditing ? "Edit Branch" : "Add New Branch"}
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
        <motion.form variants={itemVariants}
          id="branch-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto p-4 sm:p-6 sm:pt-4 pt-4 custom-scrollbar"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            {/* Branch Name */}
            <div className="space-y-1">
              <FieldLabel required>Branch Name</FieldLabel>
              <Input
                {...register("name")}
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  errors.name && "border-red-500 focus-visible:ring-red-500"
                )}
                placeholder="eg: Colombo Main Branch"
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Branch Email */}
            <div className="space-y-1">
              <FieldLabel required>Branch Email</FieldLabel>
              <Input
                type="email"
                {...register("email")}
                className={cn(
                  AUTH_INPUT.base,
                  AUTH_INPUT.placeholder,
                  errors.email && "border-red-500 focus-visible:ring-red-500"
                )}
                placeholder="eg: colombo@binzo.lk"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Branch Contact Number */}
            <div className="flex flex-col">
              <FieldLabel required className="mb-1">Branch Contact Number</FieldLabel>
              <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                Only use numbers; do not include any spaces.
              </p>
              <div
                className={cn(
                  "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                  errors.phone ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
                )}
              >
                <Select
                  value={contactCountryCode}
                  onValueChange={(val) => setValue("contactCountryCode", val, { shouldDirty: true })}
                  disabled
                >
                  <SelectTrigger className="h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-[99999999]">
                    <SelectItem value="+94">🇱🇰 +94</SelectItem>
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  {...register("phone")}
                  className={cn(
                    "flex-1 bg-transparent px-3 py-2 text-sm outline-none",
                    AUTH_INPUT.placeholder
                  )}
                  placeholder="eg: 771234567"
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Branch WhatsApp Number */}
            <div className="flex flex-col">
              <FieldLabel required className="mb-1">Branch WhatsApp Number</FieldLabel>
              <p className="mb-[6px] h-[20px] text-[12px] font-normal leading-[16px] text-[#90A1B9]">
                Only use numbers; do not include any spaces.
              </p>
              <div
                className={cn(
                  "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                  errors.whatsapp ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
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
                    <SelectItem value="+1">+1</SelectItem>
                    <SelectItem value="+44">+44</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  {...register("whatsapp")}
                  className={cn(
                    "flex-1 bg-transparent px-3 py-2 text-sm outline-none",
                    AUTH_INPUT.placeholder
                  )}
                  placeholder="eg: 771234567"
                />
              </div>
              {errors.whatsapp && (
                <p className="text-xs text-red-500 mt-1">{errors.whatsapp.message}</p>
              )}
            </div>

            {/* Branch Address */}
            <div className="col-span-1 sm:col-span-2 space-y-1">
              <FieldLabel required>Branch Address</FieldLabel>
              <Textarea
                {...register("address")}
                className={cn(
                  "min-h-[120px] resize-none border-[#E4E4E7] focus-visible:ring-[#E60076] text-[14px]",
                  AUTH_INPUT.placeholder,
                  errors.address && "border-red-500 focus-visible:ring-red-500"
                )}
                placeholder="eg: 123 Main Street, Colombo"
              />
              {errors.address && (
                <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>
              )}
            </div>

            {/* Branch Type Radio Buttons */}
            <div className="col-span-1 sm:col-span-2 space-y-3 mt-2">
              <FieldLabel required>Branch Type</FieldLabel>
              <div className="flex items-center gap-6">
                {BRANCH_TYPE_OPTIONS.map((type) => (
                  <div key={type.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`branch-type-${type.value}`}
                      name="branch-type"
                      value={type.value}
                      checked={branchType === type.value}
                      onChange={() => setValue("branch_type", type.value, { shouldValidate: true, shouldDirty: true })}
                      className="accent-[#0F172B] w-4 h-4 cursor-pointer"
                    />
                    <label
                      htmlFor={`branch-type-${type.value}`}
                      className="text-[14px] font-medium text-[#45556C] cursor-pointer"
                    >
                      {type.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.branch_type && (
                <p className="text-xs text-red-500 mt-1">{errors.branch_type.message}</p>
              )}
            </div>
          </div>
        </motion.form>

        {/* ===== FOOTER ===== */}
        <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 p-4 sm:p-6 pt-4 border-t border-[#E2E8F0] shrink-0 mt-auto">
          {isEditing ? (
            <Button
              type="submit"
              form="branch-form"
              disabled={isPending || !isDirty}
              className={cn(
                BUTTON_STYLES.primary.full,
                "w-auto px-6 font-inter text-[14px] font-semibold text-white leading-5"
              )}
            >
              {isPending ? "Saving..." : "Update Details"}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                className={cn(
                  BUTTON_STYLES.secondary.md,
                  "font-inter text-[14px] font-semibold text-[#0F172B] hover:bg-slate-100 bg-[#F1F5F9]"
                )}
              >
                Clear All
              </Button>
              <Button
                type="submit"
                form="branch-form"
                disabled={isPending}
                className={cn(
                  BUTTON_STYLES.primary.md,
                  "font-inter text-[14px] font-semibold text-white leading-5 px-6"
                )}
              >
                {isPending ? "Creating..." : "Create Branch"}
              </Button>
            </>
          )}
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

