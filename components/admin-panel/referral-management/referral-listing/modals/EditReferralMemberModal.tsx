"use client";

import React, { useEffect, useState } from "react";

import { X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
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

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { DISTRICTS } from "@/lib/constants/districts";
import type { ReferralStaffDataType } from "../ReferralStaffTab";

// ===== SCHEMA =====

const editMemberSchema = z.object({
  first_name: z.string().min(1, "First name is required."),
  last_name: z.string().min(1, "Last name is required."),
  email: z.string().email("Please enter a valid email address."),
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
  district: z.string().min(1, "District is required."),
  role: z.enum(["TEAM_MEMBER", "TEAM_LEADER"]),
  gender: z.enum(["MALE", "FEMALE"]),
});

type EditMemberFormValues = z.infer<typeof editMemberSchema>;

// ===== PROPS =====

interface EditReferralMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: ReferralStaffDataType | null;
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

export function EditReferralMemberModal({ isOpen, onClose, member }: EditReferralMemberModalProps) {
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      mobileCountryCode: "+94",
      mobile_number: "",
      whatsappCountryCode: "+94",
      whatsapp_number: "",
      district: "",
      role: "TEAM_MEMBER",
      gender: "MALE",
    },
  });

  const mobileCountryCode = watch("mobileCountryCode");
  const whatsappCountryCode = watch("whatsappCountryCode");
  const role = watch("role");
  const gender = watch("gender");

  // Initializing the form when a member is selected
  useEffect(() => {
    if (isOpen && member) {
      const names = member.memberName.split(" ");

      reset({
        first_name: names[0] || "",
        last_name: names.slice(1).join(" ") || "",
        email: "user@gmail.com", // Mocked as it's not in the Table data
        mobileCountryCode: "+94",
        mobile_number: "701234567", // Mocked
        whatsappCountryCode: "+94",
        whatsapp_number: "701234567", // Mocked
        district: member.district || "",
        role: member.isTeamLeader ? "TEAM_LEADER" : "TEAM_MEMBER",
        gender: "MALE", // Mocked
      });

      setShowDiscardModal(false);
    }
  }, [isOpen, member, reset]);

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const onSubmit = async (values: EditMemberFormValues) => {
    try {
      setIsPending(true);

      // TODO: API integration
      console.log("Update member:", values);
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
          className="flex max-h-[90vh] w-[95%] max-w-[720px] flex-col gap-0 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 p-6 pb-0 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex-1 font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
                Edit Member Details
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
            id="edit-member-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto p-6 pt-5 custom-scrollbar"
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
                  placeholder="lorem ipsum"
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
                  placeholder="lorem ipsum"
                />
                {errors.last_name && (
                  <p className="mt-1 text-xs text-red-500">{errors.last_name.message}</p>
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
                  placeholder="user@gmail.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col">
                <FieldLabel required className="mb-1">Phone number</FieldLabel>
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
                    placeholder="70 xxx xxxx"
                  />
                </div>
                {errors.mobile_number && (
                  <p className="text-xs text-red-500 mt-1">{errors.mobile_number.message}</p>
                )}
              </div>

              {/* Whatsapp Number */}
              <div className="flex flex-col">
                <FieldLabel required className="mb-1">Whatsapp number</FieldLabel>
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
                    placeholder="70 xxx xxxx"
                  />
                </div>
                {errors.whatsapp_number && (
                  <p className="text-xs text-red-500 mt-1">{errors.whatsapp_number.message}</p>
                )}
              </div>

              {/* District */}
              <div className="space-y-1">
                <FieldLabel required>District</FieldLabel>
                <Select
                  value={watch("district")}
                  onValueChange={(val) => setValue("district", val, { shouldDirty: true, shouldValidate: true })}
                >
                  <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                    <SelectValue placeholder="Colombo" />
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
              <div className="col-span-1 sm:col-span-1 space-y-3">
                <FieldLabel>Role</FieldLabel>
                <div className="flex flex-wrap items-center gap-6">
                  {[
                    { value: "TEAM_MEMBER", label: "Team Member" },
                    { value: "TEAM_LEADER", label: "Team Leader" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`role-edit-${option.value}`}
                        name="role"
                        value={option.value}
                        checked={role === option.value}
                        onChange={() => setValue("role", option.value as any, { shouldDirty: true })}
                        className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                      />
                      <label
                        htmlFor={`role-edit-${option.value}`}
                        className="cursor-pointer text-sm font-medium text-[#45556C]"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div className="col-span-1 sm:col-span-1 space-y-3">
                <FieldLabel>Gender</FieldLabel>
                <div className="flex flex-wrap items-center gap-6">
                  {[
                    { value: "MALE", label: "Male" },
                    { value: "FEMALE", label: "Female" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        id={`gender-edit-${option.value}`}
                        name="gender"
                        value={option.value}
                        checked={gender === option.value}
                        onChange={() => setValue("gender", option.value as any, { shouldDirty: true })}
                        className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                      />
                      <label
                        htmlFor={`gender-edit-${option.value}`}
                        className="cursor-pointer text-sm font-medium text-[#45556C]"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="flex items-center justify-end p-6 pt-4 border-t border-[#E2E8F0] shrink-0 mt-auto">
            <Button
              type="submit"
              form="edit-member-form"
              disabled={isPending || !isDirty}
              className={cn(
                BUTTON_STYLES.primary.md,
                "font-inter text-[14px] font-semibold text-white leading-5 px-6"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
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
        title="Save Your Edits First"
        description="Unsaved changes detected, remember to save your edits before you close!"
        confirmText="Proceed Without Saving"
        cancelText="Go Back and Save"
      />
    </>
  );
}
