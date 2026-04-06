"use client";

import React, { useState, useEffect, useMemo } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, CalendarDays as CalendarIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";
import { SearchableSelect } from "@/components/ui/searchable-select";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { DISTRICTS } from "@/lib/constants/districts";
import { useCreateEnquiry } from "@/hooks/api/enquiries/useCreateEnquiry";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";
import { useGetBranches } from "@/hooks/api/branches/useGetBranches";
import { useGetCourses } from "@/hooks/api/courses/useGetCourses";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";

// ===== SCHEMA =====

const inquirySchema = z.object({
  name: z.string().min(1, "Student name is required."),
  mobileCountryCode: z.string().default("+94"),
  phone: z
    .string()
    .min(1, "Mobile number is required.")
    .regex(/^[0-9]{9}$/, "Mobile must be exactly 9 digits."),
  whatsappCountryCode: z.string().default("+94"),
  whatsapp_number: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9]{9}$/.test(val), "WhatsApp must be exactly 9 digits."),
  email: z.string().email("Please enter a valid email address.").or(z.literal("")),
  nic: z.string().optional().refine(
    (val) => {
      if (!val) return true;

      return /^[0-9]{9}[VX]$/.test(val) || /^[0-9]{12}$/.test(val);
    },
    {
      message: "Invalid NIC format. Use Old (9 digits + V/X) or New (12 digits) format.",
    }
  ),
  district: z.string().optional(),
  assignee_user_id: z.string().min(1, "Please assign a staff member."),
  interested_area: z.string().min(1, "Please select an interested course or batch."),
  branch_id: z.string().optional(),
  next_follow_up_at: z.date().optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters.").optional(),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

// ===== PROPS =====

interface AddInquiryPanelProps {
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

export function AddInquiryPanel({ isOpen, onClose }: AddInquiryPanelProps) {
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // States for SearchableSelect inputs
  const [staffSearch, setStaffSearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");
  const [interestSearch, setInterestSearch] = useState("");

  const { mutateAsync: createEnquiry, isPending } = useCreateEnquiry();

  // Dynamic Data
  const { data: staffData, isLoading: staffLoading } = useGetStaff({
    size: 100,
    search: staffSearch,
    status: "ACTIVE",
  });

  const { data: branchData, isLoading: branchLoading } = useGetBranches({
    size: 100,
    search: branchSearch,
    status: "ACTIVE",
  });

  const { data: coursesData, isLoading: coursesLoading } = useGetCourses({
    size: 50,
    search: interestSearch,
  });

  const { data: batchesData, isLoading: batchesLoading } = useGetBatches({
    size: 50,
    search: interestSearch,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      mobileCountryCode: "+94",
      phone: "",
      whatsappCountryCode: "+94",
      whatsapp_number: "",
      email: "",
      nic: "",
      district: undefined,
      assignee_user_id: "",
      interested_area: "",
      branch_id: undefined,
      next_follow_up_at: undefined,
      notes: "",
    },
  });

  const mobileCountryCode = watch("mobileCountryCode");
  const whatsappCountryCode = watch("whatsappCountryCode");

  // Format Staff Options
  const staffOptions = useMemo(() => {
    return staffData?.results?.map((s) => ({
      value: s.userId,
      label: `${s.firstName} ${s.lastName}`,
      subLabel: `@${s.customId}`,
      avatarInitials: `${s.firstName[0]}${s.lastName[0]}`.toUpperCase(),
    })) || [];
  }, [staffData]);

  // Format Branch Options
  const branchOptions = useMemo(() => {
    return branchData?.results?.map((b) => ({
      value: b.id,
      label: b.name,
      subLabel: b.branch_code,
    })) || [];
  }, [branchData]);

  // Format Interest Options (Courses + Batches)
  const interestOptions = useMemo(() => {
    const courses = coursesData?.results?.map((c) => ({
      value: `course:${c.id}`,
      label: c.name,
      subLabel: "Course",
    })) || [];

    const batches = batchesData?.results?.map((b) => ({
      value: `batch:${b.id}`,
      label: b.name,
      subLabel: `Batch • ${b.category}`,
    })) || [];

    return [...batches, ...courses];
  }, [coursesData, batchesData]);

  // Handle open state
  useEffect(() => {
    if (isOpen) {
      reset();
      setStaffSearch("");
      setBranchSearch("");
      setInterestSearch("");
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

  const onSubmit = async (values: InquiryFormValues) => {
    try {
      const isBatch = values.interested_area.startsWith("batch:");
      const areaId = values.interested_area.split(":")[1];

      const payload = {
        name: values.name,
        phone: `${values.mobileCountryCode}${values.phone}`,
        ...(values.whatsapp_number
          ? { whatsapp_number: `${values.whatsappCountryCode}${values.whatsapp_number}` }
          : {}),
        ...(values.email ? { email: values.email } : {}),
        ...(values.nic ? { nic: values.nic } : {}),
        ...(values.district ? { district: values.district } : {}),
        assignee_user_id: values.assignee_user_id,
        ...(isBatch ? { batch_id: areaId } : { course_id: areaId }),
        ...(values.branch_id ? { branch_id: values.branch_id } : {}),
        ...(values.next_follow_up_at
          ? { next_follow_up_at: values.next_follow_up_at.toISOString() }
          : {}),
        ...(values.notes ? { notes: values.notes } : {}),
      };

      await createEnquiry(payload as any);
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
                    New Inquiry Form
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
                    id="add-inquiry-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="px-6 py-6 custom-scrollbar"
                  >
                    <div className="flex flex-col gap-5">
                      {/* Student Name */}
                      <div className="space-y-1">
                        <FieldLabel required>Student Name</FieldLabel>
                        <Input
                          {...register("name")}
                          className={cn(
                            AUTH_INPUT.base,
                            AUTH_INPUT.placeholder,
                            errors.name && "border-red-500 focus-visible:ring-red-500"
                          )}
                          placeholder="eg: Dilshan Perera"
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
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
                            errors.phone ? "border-red-500 focus-within:ring-red-500" : "border-gray-300"
                          )}
                        >
                          <Select
                            value={mobileCountryCode}
                            onValueChange={(val) =>
                              setValue("mobileCountryCode", val, { shouldDirty: true })
                            }
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
                            {...register("phone")}
                            className={cn(
                              "flex-1 bg-transparent px-3 py-2 text-sm outline-none text-[#0F172B]",
                              AUTH_INPUT.placeholder
                            )}
                            placeholder="eg: 711234567"
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
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
                            errors.whatsapp_number
                              ? "border-red-500 focus-within:ring-red-500"
                              : "border-gray-300"
                          )}
                        >
                          <Select
                            value={whatsappCountryCode}
                            onValueChange={(val) =>
                              setValue("whatsappCountryCode", val, { shouldDirty: true })
                            }
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
                            placeholder="eg: 771234567"
                          />
                        </div>
                        {errors.whatsapp_number && (
                          <p className="mt-1 text-xs text-red-500">{errors.whatsapp_number.message}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <FieldLabel>Email</FieldLabel>
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

                      {/* District */}
                      <div className="space-y-1">
                        <FieldLabel>District</FieldLabel>
                        <Controller
                          name="district"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={(val) => field.onChange(val)}
                            >
                              <SelectTrigger
                                className={cn(
                                  AUTH_INPUT.base,
                                  "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic text-[#0F172B]"
                                )}
                              >
                                <SelectValue placeholder="Select District" />
                              </SelectTrigger>
                              <SelectContent className="z-[99999999]">
                                {DISTRICTS.map((d) => (
                                  <SelectItem key={d} value={d}>
                                    {d}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      {/* Assign Staff */}
                      <div className="space-y-1">
                        <FieldLabel required>Assign Staff</FieldLabel>
                        <Controller
                          name="assignee_user_id"
                          control={control}
                          render={({ field }) => (
                            <SearchableSelect
                              options={staffOptions}
                              value={field.value}
                              onChange={field.onChange}
                              onSearchChange={setStaffSearch}
                              searchValue={staffSearch}
                              placeholder="Select Staff"
                              searchPlaceholder="Search staff name or handle..."
                              isLoading={staffLoading}
                              error={!!errors.assignee_user_id}
                            />
                          )}
                        />
                        {errors.assignee_user_id && (
                          <p className="mt-1 text-xs text-red-500">{errors.assignee_user_id.message}</p>
                        )}
                      </div>

                      {/* Interested Area */}
                      <div className="space-y-1">
                        <FieldLabel required>Interested Area</FieldLabel>
                        <Controller
                          name="interested_area"
                          control={control}
                          render={({ field }) => (
                            <SearchableSelect
                              options={interestOptions}
                              value={field.value}
                              onChange={field.onChange}
                              onSearchChange={setInterestSearch}
                              searchValue={interestSearch}
                              placeholder="Select Course or Batch"
                              searchPlaceholder="Search interested course or batch..."
                              isLoading={coursesLoading || batchesLoading}
                              error={!!errors.interested_area}
                            />
                          )}
                        />
                        {errors.interested_area && (
                          <p className="mt-1 text-xs text-red-500">{errors.interested_area.message}</p>
                        )}
                      </div>

                      {/* Branch */}
                      <div className="space-y-1">
                        <FieldLabel>Branch</FieldLabel>
                        <Controller
                          name="branch_id"
                          control={control}
                          render={({ field }) => (
                            <SearchableSelect
                              options={branchOptions}
                              value={field.value || ""}
                              onChange={field.onChange}
                              onSearchChange={setBranchSearch}
                              searchValue={branchSearch}
                              placeholder="Select Branch"
                              searchPlaceholder="Search branch by name or address..."
                              isLoading={branchLoading}
                              error={!!errors.branch_id}
                            />
                          )}
                        />
                      </div>

                      {/* Next Follow-Up Date */}
                      <div className="space-y-1">
                        <FieldLabel>Next Follow-Up Date</FieldLabel>
                        <Controller
                          name="next_follow_up_at"
                          control={control}
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <div className="flex h-10 w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white transition-all hover:bg-slate-50">
                                  <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
                                    <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                                  </div>
                                  <input
                                    value={field.value ? format(field.value, "dd/MM/yyyy") : ""}
                                    readOnly
                                    placeholder="Pick a date"
                                    className={cn(
                                      "flex-1 cursor-pointer bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic pointer-events-none text-[#0F172B]"
                                    )}
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
                      </div>

                      {/* Notes */}
                      <div className="space-y-1">
                        <FieldLabel>Notes</FieldLabel>
                        <Textarea
                          {...register("notes")}
                          className={cn(
                            "min-h-[100px] resize-none text-[#0F172B]",
                            AUTH_INPUT.placeholder,
                            errors.notes && "border-red-500 focus-visible:ring-red-500"
                          )}
                          placeholder="eg: Student interested in early bird discounts."
                        />
                        {errors.notes && (
                          <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>
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
                      "font-inter text-[14px] font-semibold text-[#0F172B]"
                    )}
                  >
                    Clear All
                  </Button>
                  <Button
                    type="submit"
                    form="add-inquiry-form"
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

