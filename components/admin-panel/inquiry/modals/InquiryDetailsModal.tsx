"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

import { X, CalendarDays as CalendarIcon, Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { SearchableSelect, type SearchableSelectOption } from "@/components/ui/searchable-select";

import { cn } from "@/lib/utils";
import type { InquiryDataType } from "@/types/inquiry";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { DISTRICTS } from "@/lib/constants/districts";
import { useGetEnquiryById } from "@/hooks/api/enquiries/useGetEnquiryById";
import { useUpdateEnquiry } from "@/hooks/api/enquiries/useUpdateEnquiry";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";
import { useGetBranches } from "@/hooks/api/branches/useGetBranches";
import { useGetCourses } from "@/hooks/api/courses/useGetCourses";
import { useGetBatches } from "@/hooks/api/batches/useGetBatches";

// ===== SCHEMA =====
const inquiryDetailSchema = z.object({
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
  email: z.string().email("Please enter a valid email address.").optional().or(z.literal("")),
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
  assignee_user_id: z.string().optional(),
  interested_area: z.string().optional(),
  branch_id: z.string().optional(),
  next_follow_up_at: z.date().optional(),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters.").optional(),
});

type InquiryFormValues = z.infer<typeof inquiryDetailSchema>;

interface InquiryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: InquiryDataType | null;
}

export function InquiryDetailsModal({
  isOpen,
  onClose,
  inquiry,
}: InquiryDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  // States for SearchableSelect inputs
  const [staffSearch, setStaffSearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");
  const [interestSearch, setInterestSearch] = useState("");

  // Fetch detailed data & mutation
  const { data: detail, isLoading } = useGetEnquiryById(isOpen ? inquiry?.id ?? null : null);
  const { mutateAsync: updateEnquiry, isPending: isUpdating } = useUpdateEnquiry(inquiry?.id || "");

  // Dynamic Data for Edit Mode
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
    size: 100,
    search: interestSearch,
  });

  const { data: batchesData, isLoading: batchesLoading } = useGetBatches({
    size: 100,
    search: interestSearch,
  });

  // Format Options with "Current Selection" handling if search result is missing the ID
  const staffOptions = useMemo(() => {
    const results: SearchableSelectOption[] = staffData?.results?.map((s) => ({
      value: s.userId,
      label: `${s.firstName} ${s.lastName}`,
      subLabel: `@${s.customId}`,
      avatarInitials: `${s.firstName[0]}${s.lastName[0]}`.toUpperCase(),
    })) || [];

    // Add current selection if missing from results
    if (detail?.assignee_id && !results.some((r) => r.value === detail.assignee_id)) {
      results.unshift({
        value: detail.assignee_id,
        label: detail.assignee_name || "Assigned Staff",
        subLabel: "",
        avatarInitials: (detail.assignee_name || "S")[0].toUpperCase(),
      });
    }

    return results;
  }, [staffData, detail]);

  const branchOptions = useMemo(() => {
    const results: SearchableSelectOption[] = branchData?.results?.map((b) => ({
      value: b.id,
      label: b.name,
      subLabel: b.branch_code,
    })) || [];

    // Add current selection if missing from results
    if (detail?.branch_id && !results.some((r) => r.value === detail.branch_id)) {
      results.unshift({
        value: detail.branch_id,
        label: detail.branch_name || "Assigned Branch",
        subLabel: "",
      });
    }

    return results;
  }, [branchData, detail]);

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

    const results: SearchableSelectOption[] = [...batches, ...courses];

    // Add current selection if missing from results
    if (detail?.batch_id && !results.some((r) => r.value === `batch:${detail.batch_id}`)) {
      results.unshift({
        value: `batch:${detail.batch_id}`,
        label: detail.batch_name || "Current Batch",
        subLabel: "Current Selection",
      });
    } else if (detail?.course_id && !results.some((r) => r.value === `course:${detail.course_id}`)) {
      results.unshift({
        value: `course:${detail.course_id}`,
        label: detail.course_name || "Current Course",
        subLabel: "Current Selection",
      });
    }

    return results;
  }, [coursesData, batchesData, detail]);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquiryDetailSchema),
  });

  const mobileCountryCode = watch("mobileCountryCode");
  const whatsappCountryCode = watch("whatsappCountryCode");

  // Format prefilled interested area
  const getPrefilledInterestedArea = useCallback(() => {
    // 1. Prefer IDs if provided by API
    if (detail?.batch_id) return `batch:${detail.batch_id}`;
    if (detail?.course_id) return `course:${detail.course_id}`;
    
    // 2. Reverse lookup by name if IDs are missing
    if (detail?.batch_name && batchesData?.results) {
      const match = batchesData.results.find((b) => b.name === detail.batch_name);

      if (match) return `batch:${match.id}`;
    }

    if (detail?.course_name && coursesData?.results) {
      const match = coursesData.results.find((c) => c.name === detail.course_name);

      if (match) return `course:${match.id}`;
    }

    return "";
  }, [detail, coursesData, batchesData]);

  const getPrefilledStaffId = useCallback(() => {
    // 1. Prefer assignee_user_id or assignee_id if provided by API
    if (detail?.assignee_user_id) return detail.assignee_user_id;
    if (detail?.assignee_id) return detail.assignee_id;

    // 2. Reverse lookup by name if IDs are missing
    if (detail?.assignee_name && staffData?.results) {
      const match = staffData.results.find((s) => `${s.firstName} ${s.lastName}` === detail.assignee_name);

      if (match) return match.userId;
    }

    return "";
  }, [detail, staffData]);

  const getPrefilledBranchId = useCallback(() => {
    // 1. Prefer branch_id if provided by API
    if (detail?.branch_id) return detail.branch_id;

    // 2. Reverse lookup by name if ID is missing
    if (detail?.branch_name && branchData?.results) {
      const match = branchData.results.find((b) => b.name === detail.branch_name);

      if (match) return match.id;
    }

    return undefined;
  }, [detail, branchData]);

  // Sync data to form while NOT editing to ensure late-arriving list data populates the form correctly
  useEffect(() => {
    if (isOpen && detail && !isEditing) {
      const cleanPhone = detail.phone?.startsWith("+94") ? detail.phone.slice(3) : detail.phone;
      const cleanWhatsapp = detail.whatsapp_number?.startsWith("+94") ? detail.whatsapp_number.slice(3) : detail.whatsapp_number;

      reset({
        name: detail.name || "",
        mobileCountryCode: "+94",
        phone: cleanPhone || "",
        whatsappCountryCode: "+94",
        whatsapp_number: cleanWhatsapp || "",
        nic: detail.nic || "",
        email: detail.email || "",
        district: detail.district || undefined,
        branch_id: getPrefilledBranchId(),
        interested_area: getPrefilledInterestedArea(),
        assignee_user_id: getPrefilledStaffId(),
        next_follow_up_at: detail.next_follow_up_at ? parseISO(detail.next_follow_up_at) : undefined,
        notes: detail.notes || "",
      });
    }
  }, [isOpen, detail, isEditing, reset, getPrefilledInterestedArea, getPrefilledBranchId, getPrefilledStaffId]);

  const handleUpdate = async (values: InquiryFormValues) => {
    if (!detail) return;

    try {
      let isBatch = false;
      let areaId = "";

      if (values.interested_area) {
        if (values.interested_area.startsWith("batch:")) {
          isBatch = true;
          areaId = values.interested_area.split(":")[1];
        } else if (values.interested_area.startsWith("course:")) {
          isBatch = false;
          areaId = values.interested_area.split(":")[1];
        }
      }

      const payload = {
        name: values.name,
        phone: `${values.mobileCountryCode}${values.phone}`,
        whatsapp_number: values.whatsapp_number ? `${values.whatsappCountryCode}${values.whatsapp_number}` : null,
        email: values.email || null,
        nic: values.nic || null,
        district: values.district || null,
        assignee_user_id: values.assignee_user_id || null,
        ...(areaId ? (isBatch ? { batch_id: areaId, course_id: null } : { course_id: areaId, batch_id: null }) : { batch_id: null, course_id: null }),
        branch_id: values.branch_id || null,
        status: detail.status,
        next_follow_up_at: values.next_follow_up_at ? values.next_follow_up_at.toISOString() : null,
        notes: values.notes || null,
      };

      await updateEnquiry(payload);
      setIsEditing(false);
    } catch {
      // error handled in hook
    }
  };

  const handleCloseAttempt = () => {
    if (isDirty && isEditing) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  const handleDiscard = () => {
    setIsEditing(false);

    if (detail) {
      const cleanPhone = detail.phone?.startsWith("+94") ? detail.phone.slice(3) : detail.phone;
      const cleanWhatsapp = detail.whatsapp_number?.startsWith("+94") ? detail.whatsapp_number.slice(3) : detail.whatsapp_number;

      reset({
        name: detail.name || "",
        mobileCountryCode: "+94",
        phone: cleanPhone || "",
        whatsappCountryCode: "+94",
        whatsapp_number: cleanWhatsapp || "",
        nic: detail.nic || "",
        email: detail.email || "",
        district: detail.district || undefined,
        branch_id: detail.branch_id || undefined,
        interested_area: getPrefilledInterestedArea(),
        assignee_user_id: detail.assignee_id || "",
        next_follow_up_at: detail.next_follow_up_at ? parseISO(detail.next_follow_up_at) : undefined,
        notes: detail.notes || "",
      });
    }
  };

  // Helper to render label with asterisk
  const FieldLabel = ({ children, required = false, className }: { children: React.ReactNode; required?: boolean; className?: string }) => (
    <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block", className)}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent 
          isLoading={isLoading} 
          animateChildren={true}
          className="flex max-h-[90vh] w-[95%] max-w-[760px] flex-col gap-0 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
        >
          {/* ===== HEADER ===== */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 p-4 sm:p-6 pb-0 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
                {isEditing ? "Edit Inquiry Details" : "View Inquiry Details"}
              </DialogTitle>
              <button
                type="button"
                title="Close"
                onClick={handleCloseAttempt}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
              >
                <X className="h-4 w-4 text-[#64748B]" />
              </button>
            </div>
            <div className="border-b border-[#E2E8F0]" />
          </motion.div>

          {/* ===== BODY (Scrollable) ===== */}
          <motion.div variants={itemVariants} className="flex-1 overflow-y-auto p-4 sm:p-6 sm:pt-0 pt-0 custom-scrollbar">
            <form id="inquiry-form" onSubmit={handleSubmit(handleUpdate)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
              {/* Row 1: Student Name & Next Follow-Up */}
              <div className="space-y-1">
                <FieldLabel required>Student Name</FieldLabel>
                <Input
                  {...register("name")}
                  disabled={!isEditing}
                  className={cn(
                    AUTH_INPUT.base,
                    AUTH_INPUT.placeholder,
                    !isEditing && "bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100 disabled:cursor-default",
                    errors.name && "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="Enter Student Name"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <FieldLabel>Next Follow-Up Date</FieldLabel>
                <Controller
                  name="next_follow_up_at"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild disabled={!isEditing}>
                        <div className={cn(
                            "flex h-10 w-full items-center rounded-md border border-gray-300 bg-white transition-all hover:bg-slate-50 cursor-pointer",
                             !isEditing && "bg-[#F1F5F9] border-transparent pointer-events-none cursor-default"
                        )}>
                           <div className="flex h-full items-center justify-center px-3 border-r border-slate-200">
                              <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                           </div>
                           <input
                             value={field.value ? format(field.value, "dd/MM/yyyy") : ""}
                             readOnly
                             placeholder={isEditing ? "Pick a date" : "Not scheduled"}
                             className="flex-1 cursor-pointer bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic pointer-events-none text-[#0F172B]"
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

              {/* Row 2: Mobile Number & WhatsApp Number */}
              <div className="flex flex-col">
                <FieldLabel required className="mb-0">Mobile Number</FieldLabel>
                {isEditing && (
                   <p className="mb-[6px] h-[20px] text-[11px] font-normal leading-[16px] text-[#90A1B9]">
                     Numbers only; no spaces.
                   </p>
                )}
                {!isEditing && <div className="h-2" />}
                <div
                  className={cn(
                    "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                    !isEditing ? "bg-[#F1F5F9] border-transparent" : (errors.phone ? "border-red-500 focus-within:ring-red-500" : "border-gray-300")
                  )}
                >
                  <Select
                    value={mobileCountryCode}
                    onValueChange={(val) => setValue("mobileCountryCode", val, { shouldDirty: true })}
                    disabled
                  >
                    <SelectTrigger className={cn("h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0 text-[#0F172B]", !isEditing && "opacity-100")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[99999999]">
                      <SelectItem value="+94">LK +94</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    {...register("phone")}
                    disabled={!isEditing}
                    className={cn(
                      "flex-1 bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-default text-[#0F172B]",
                      AUTH_INPUT.placeholder
                    )}
                    placeholder="711234567"
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="flex flex-col">
                <FieldLabel className="mb-0">WhatsApp Number</FieldLabel>
                {isEditing && (
                   <p className="mb-[6px] h-[20px] text-[11px] font-normal leading-[16px] text-[#90A1B9]">
                     Numbers only; no spaces.
                   </p>
                )}
                {!isEditing && <div className="h-2" />}
                <div
                  className={cn(
                    "flex h-10 w-full items-center rounded-md border bg-white transition-all focus-within:ring-2 focus-within:ring-[#E60076]",
                    !isEditing ? "bg-[#F1F5F9] border-transparent" : (errors.whatsapp_number ? "border-red-500 focus-within:ring-red-500" : "border-gray-300")
                  )}
                >
                  <Select
                    value={whatsappCountryCode}
                    onValueChange={(val) => setValue("whatsappCountryCode", val, { shouldDirty: true })}
                    disabled
                  >
                    <SelectTrigger className={cn("h-full w-[90px] rounded-l-md rounded-r-none border-0 border-r border-slate-200 bg-transparent px-2 ring-0 focus:ring-0 focus:ring-offset-0 text-[#0F172B]", !isEditing && "opacity-100")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[99999999]">
                      <SelectItem value="+94">LK +94</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    {...register("whatsapp_number")}
                    disabled={!isEditing}
                    className={cn(
                      "flex-1 bg-transparent px-3 py-2 text-sm outline-none disabled:cursor-default text-[#0F172B]",
                      AUTH_INPUT.placeholder
                    )}
                    placeholder="771234567"
                  />
                </div>
                {errors.whatsapp_number && <p className="mt-1 text-xs text-red-500">{errors.whatsapp_number.message}</p>}
              </div>

              {/* Row 3: Interested Area & Assign Staff */}
              <div className="space-y-1">
                <FieldLabel required={isEditing}>Interested Area</FieldLabel>
                 {isEditing ? (
                   <Controller
                     name="interested_area"
                     control={control}
                     render={({ field }) => (
                       <SearchableSelect
                         options={interestOptions}
                         value={field.value || ""}
                         onChange={field.onChange}
                         onSearchChange={setInterestSearch}
                         searchValue={interestSearch}
                         placeholder="Select Course or Batch"
                         searchPlaceholder="Search courses/batches..."
                         isLoading={coursesLoading || batchesLoading}
                         error={!!errors.interested_area}
                       />
                     )}
                   />
                 ) : (
                    <Input 
                      value={detail?.batch_name || detail?.course_name || "-"} 
                      disabled 
                      className="bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100" 
                    />
                 )}
                 {errors.interested_area && <p className="mt-1 text-xs text-red-500">{errors.interested_area.message}</p>}
              </div>

              <div className="space-y-1">
                <FieldLabel required={isEditing}>Assign Staff</FieldLabel>
                 {isEditing ? (
                   <Controller
                     name="assignee_user_id"
                     control={control}
                     render={({ field }) => (
                       <SearchableSelect
                         options={staffOptions}
                         value={field.value || ""}
                         onChange={field.onChange}
                         onSearchChange={setStaffSearch}
                         searchValue={staffSearch}
                         placeholder="Select Staff"
                         searchPlaceholder="Search staff by name or handle..."
                         isLoading={staffLoading}
                         error={!!errors.assignee_user_id}
                       />
                     )}
                   />
                 ) : (
                  <div className="flex h-10 items-center rounded-md border bg-[#F1F5F9] border-transparent px-3 gap-2 pointer-events-none">
                     <div className="h-6 w-6 rounded-full bg-slate-200 overflow-hidden shrink-0">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${detail?.assignee_name || "staff"}`} 
                          alt="avatar" 
                        />
                     </div>
                     <span className="text-sm text-[#0F172B] font-medium truncate">{detail?.assignee_name || "Unassigned"}</span>
                  </div>
                 )}
                 {errors.assignee_user_id && <p className="mt-1 text-xs text-red-500">{errors.assignee_user_id.message}</p>}
              </div>
              
              {/* Row 4: Email & District */}
              <div className="space-y-1">
                <FieldLabel>Email</FieldLabel>
                <Input
                  {...register("email")}
                  disabled={!isEditing}
                  type="email"
                  className={cn(
                    AUTH_INPUT.base,
                    AUTH_INPUT.placeholder,
                    !isEditing && "bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100",
                    errors.email && "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="eg: testuser@yopmail.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-1">
                <FieldLabel>District</FieldLabel>
                 {isEditing ? (
                    <Controller
                      name="district"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic text-[#0F172B]")}>
                            <SelectValue placeholder="Select District" />
                          </SelectTrigger>
                          <SelectContent className="z-[99999999]">
                            {DISTRICTS.map((d) => (
                              <SelectItem key={d} value={d}>{d}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                 ) : (
                   <Input
                      value={detail?.district || "-"}
                      disabled
                      className="bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100"
                    />
                 )}
              </div>

              {/* Row 5: NIC & Branch */}
              <div className="space-y-1">
                <FieldLabel>NIC Number</FieldLabel>
                <Input
                  {...register("nic")}
                  disabled={!isEditing}
                  className={cn(
                    AUTH_INPUT.base,
                    AUTH_INPUT.placeholder,
                    !isEditing && "bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100",
                    errors.nic && "border-red-500 focus-visible:ring-red-500"
                  )}
                  placeholder="200089456123"
                />
                {errors.nic && <p className="mt-1 text-xs text-red-500">{errors.nic.message}</p>}
              </div>

               <div className="space-y-1">
                <FieldLabel>Branch</FieldLabel>
                 {isEditing ? (
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
                         searchPlaceholder="Search branch..."
                         isLoading={branchLoading}
                         error={!!errors.branch_id}
                       />
                     )}
                   />
                 ) : (
                   <Input
                      value={detail?.branch_name || "-"}
                      disabled
                      className="bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100"
                    />
                 )}
              </div>
              
              {/* Row 6: Notes Full Width */}
              <div className="col-span-1 sm:col-span-2 space-y-1">
                <FieldLabel>Notes</FieldLabel>
                <Textarea
                   {...register("notes")}
                   disabled={!isEditing}
                   className={cn(
                     "min-h-[80px] resize-none",
                     AUTH_INPUT.placeholder,
                     !isEditing && "bg-[#F1F5F9] text-[#0F172B] border-transparent disabled:opacity-100",
                     errors.notes && "border-red-500 focus-visible:ring-red-500"
                   )}
                   placeholder={isEditing ? "Internal notes about the inquiry..." : ""}
                />
                {errors.notes && <p className="mt-1 text-xs text-red-500">{errors.notes.message}</p>}
              </div>

            </form>
          </motion.div>

          {/* ===== FOOTER ===== */}
          <motion.div variants={itemVariants} className="flex items-center justify-end gap-3 p-4 sm:p-6 pt-4 border-t border-[#E2E8F0] shrink-0 mt-auto bg-[#F8FAFC]/50">
            {isEditing ? (
              <>
                <Button 
                  type="button"
                  variant="ghost" 
                  onClick={handleDiscard}
                  disabled={isUpdating}
                  className={cn(BUTTON_STYLES.secondary.md, "text-sm font-semibold text-[#0F172B] hover:bg-slate-200")}
                >
                  Discard
                </Button>
                <Button 
                   type="submit"
                   form="inquiry-form"
                   disabled={isUpdating || !isDirty}
                   className={cn(BUTTON_STYLES.primary.md, "text-sm font-semibold text-white px-8")}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Update Details"
                  )}
                </Button>
              </>
            ) : (
               <Button 
                 type="button"
                 variant="outline" 
                 onClick={() => setIsEditing(true)}
                 className={cn(BUTTON_STYLES.outline.md, "text-sm font-semibold text-[#1F2937] px-8 bg-white")}
               >
                 Edit Details
               </Button>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationModal
        isOpen={showDiscardModal}
        onClose={() => setShowDiscardModal(false)}
        onConfirm={() => {
          setShowDiscardModal(false);
          setIsEditing(false);
          reset();
          onClose();
        }}
        title="Discard Changes"
        description="You have unsaved changes. Are you sure you want to discard them and close?"
        confirmText="Yes, Discard"
        cancelText="No, Keep Editing"
      />
    </>
  );
}
