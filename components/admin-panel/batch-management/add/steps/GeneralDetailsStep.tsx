"use client";

import React, { useState, useEffect, useMemo } from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { 
  generalDetailsSchema, 
  type GeneralDetailsValues,
} from "@/schemas/batch.schema";
import { useBatchFormStore } from "@/store/batchFormStore";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";
import ImageUpload from "@/components/common/ImageUpload";
import { AUTH_TYPOGRAPHY, AUTH_INPUT } from "@/lib/constants/theme";
import { MultiSelect } from "@/components/ui/multi-select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";
import { useGetLecturers } from "@/hooks/api/lecturers/useGetLecturers";
import { useGetBranches } from "@/hooks/api/branches/useGetBranches";
import { useGetCertificateTemplates } from "@/hooks/api/certificates/useGetCertificateTemplates";

const BATCH_TYPES = [
  "Workshop",
  "Certificate",
  "Diploma",
  "HND",
  "Degree",
  "School",
  "University",
  "Exam Prep",
];

const LANGUAGES = ["Tamil", "Sinhala", "English"];
const CATEGORIES = ["Online", "Offline"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "General"];
const STATUSES = ["Active", "Upcoming", "Completed", "Inactive"];

interface GeneralDetailsStepProps {
  onNext?: () => void;
}

export function GeneralDetailsStep({ onNext }: GeneralDetailsStepProps) {
  // Get stored values and actions from Zustand store
  const { generalDetails, setGeneralDetails } = useBatchFormStore();
  
  // Transform stored dates back to Date objects
  const transformedDefaults = useMemo(() => ({
    ...generalDetails,
    startDate: generalDetails.startDate ? new Date(generalDetails.startDate) : undefined,
    endDate: generalDetails.endDate ? new Date(generalDetails.endDate) : undefined,
  }), [generalDetails]);
  
  const [startDate, setStartDate] = useState<Date | undefined>(
    transformedDefaults.startDate
  );

  const [endDate, setEndDate] = useState<Date | undefined>(
    transformedDefaults.endDate
  );

  // Search states for dynamic dropdowns
  const [branchSearch, setBranchSearch] = useState("");
  const [lecturerSearch, setLecturerSearch] = useState("");
  const [staffSearch, setStaffSearch] = useState("");
  const [certSearch, setCertSearch] = useState("");

  // Fetch data using hooks
  const { data: branchData, isLoading: isLoadingBranches } = useGetBranches({ search: branchSearch, size: 20 });
  const { data: lecturerData, isLoading: isLoadingLecturers } = useGetLecturers({ search: lecturerSearch, size: 20 });
  const { data: staffData, isLoading: isLoadingStaff } = useGetStaff({ search: staffSearch, size: 20 });
  const { data: certData, isLoading: isLoadingCerts } = useGetCertificateTemplates({ name: certSearch, limit: 20 });

  const form = useForm<GeneralDetailsValues>({
    resolver: zodResolver(generalDetailsSchema),
    defaultValues: transformedDefaults as GeneralDetailsValues,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Watch all form values and save to store on change
  useEffect(() => {
    const subscription = watch((data) => {
      setGeneralDetails(data as Partial<GeneralDetailsValues>);
    });
    
    return () => subscription.unsubscribe();
  }, [watch, setGeneralDetails]);

  const onSubmit = (data: GeneralDetailsValues) => {
    setGeneralDetails(data);
    onNext?.();
  };

  const FieldLabel = ({ children, required = false }: { children: React.ReactNode; required?: boolean }) => (
    <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block")}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
  );

  const FieldError = ({ message }: { message?: string }) => {
    if (!message) return null;
    
    return <p className="text-xs text-red-500">{message}</p>;
  };

  // Format options for searchable selects
  const branchOptions = useMemo(() => 
    branchData?.results?.map((b: any) => ({
      value: b.id,
      label: b.name
    })) || [], [branchData]);

  const lecturerOptions = useMemo(() => 
    lecturerData?.results?.map((l: any) => ({
      value: l.user_id,
      label: `${l.first_name || ""} ${l.last_name || ""}`.trim(),
      subLabel: l.email,
      avatarInitials: `${l.first_name?.[0] || ""}${l.last_name?.[0] || ""}`.toUpperCase(),
    })) || [], [lecturerData]);

  const staffOptions = useMemo(() => 
    staffData?.results?.map((s: any) => ({
      value: s.userId,
      label: `${s.firstName || ""} ${s.lastName || ""}`.trim(),
      handle: s.email,
    })) || [], [staffData]);

  const certOptions = useMemo(() => 
    certData?.results?.map((c: any) => ({
      value: c.id,
      label: c.name
    })) || [], [certData]);

  return (
    <div className="space-y-6">
      <form id="active-step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Row 1 */}
            <div className="space-y-1">
              <FieldLabel required>Batch Name</FieldLabel>
              <Input
                {...register("batchName")}
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, errors.batchName && AUTH_INPUT.error)}
                placeholder="eg: Diploma in Computing – Batch 02"
              />
              <FieldError message={errors.batchName?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel required>Branch</FieldLabel>
              <Controller
                name="branch"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    options={branchOptions}
                    value={field.value}
                    onChange={field.onChange}
                    onSearchChange={setBranchSearch}
                    searchValue={branchSearch}
                    placeholder="Select Branch"
                    isLoading={isLoadingBranches}
                    error={!!errors.branch}
                  />
                )}
              />
              <FieldError message={errors.branch?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel required>Language</FieldLabel>
              <Controller
                name="language"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic", errors.language && AUTH_INPUT.error)}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.language?.message} />
            </div>

            {/* Row 2 */}
            <div className="space-y-1">
              <FieldLabel required>Batch Type</FieldLabel>
              <Controller
                name="batchType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic", errors.batchType && AUTH_INPUT.error)}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {BATCH_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.batchType?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel required>Assign Staff Members</FieldLabel>
              <Controller
                name="staffMembers"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={staffOptions}
                    value={field.value || []}
                    onChange={field.onChange}
                    onSearchChange={setStaffSearch}
                    searchValue={staffSearch}
                    placeholder="Select multiple staff members"
                    error={!!errors.staffMembers}
                    isLoading={isLoadingStaff}
                  />
                )}
              />
              <FieldError message={errors.staffMembers?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel>Assignment</FieldLabel>
              <div className="flex items-center gap-4 h-10">
                  <div className="flex items-center gap-2">
                    <input type="radio" id="assignment-yes" value="yes" {...register("assignment")} className="accent-[#0F172B] w-4 h-4 cursor-pointer" />
                    <label htmlFor="assignment-yes" className="text-sm text-[#45556C] cursor-pointer">Yes</label>
                 </div>
                 <div className="flex items-center gap-2">
                    <input type="radio" id="assignment-no" value="no" {...register("assignment")} className="accent-[#0F172B] w-4 h-4 cursor-pointer" />
                    <label htmlFor="assignment-no" className="text-sm text-[#45556C] cursor-pointer">No</label>
                 </div>
              </div>
              <FieldError message={errors.assignment?.message} />
            </div>

            {/* Row 3 */}
            <div className="space-y-1">
              <FieldLabel required>Batch Category</FieldLabel>
              <Controller
                name="batchCategory"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic", errors.batchCategory && AUTH_INPUT.error)}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.batchCategory?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel required>Start Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <div className={cn(
                      "flex h-10 w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white transition-all hover:bg-slate-50",
                      errors.startDate && "border-red-500"
                  )}>
                     <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
                        <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                     </div>
                     <input 
                       value={startDate ? format(startDate, "dd/MM/yyyy") : ""} 
                       readOnly
                       placeholder="Pick a date"
                       className={cn(
                         "flex-1 cursor-pointer bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic pointer-events-none"
                       )}
                     />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                  <DateRangeCalendar
                    mode="single"
                    startDate={startDate || null}
                    endDate={null}
                    minDate={new Date()}
                    onDateChange={(date) => {
                      setStartDate(date || undefined);
                      if (date) setValue("startDate", date);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FieldError message={errors.startDate?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel required>Certificates</FieldLabel>
              <Controller
                name="certificates"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={certOptions}
                    value={field.value || []}
                    onChange={field.onChange}
                    onSearchChange={setCertSearch}
                    searchValue={certSearch}
                    placeholder="Select certificates"
                    error={!!errors.certificates}
                    isLoading={isLoadingCerts}
                  />
                )}
              />
              <FieldError message={errors.certificates?.message} />
            </div>

            {/* Row 4 */}
            <div className="space-y-1">
              <FieldLabel required>Batch Status</FieldLabel>
              <Controller
                name="batchStatus"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic", errors.batchStatus && AUTH_INPUT.error)}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(stat => (
                        <SelectItem key={stat} value={stat}>{stat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.batchStatus?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel required>End Date</FieldLabel>
               <Popover>
                <PopoverTrigger asChild disabled={!startDate}>
                  <div className={cn(
                      "flex h-10 w-full items-center rounded-md border border-gray-300 bg-white transition-all",
                      !startDate ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-slate-50",
                      errors.endDate && "border-red-500"
                  )}>
                     <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
                        <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                     </div>
                     <input 
                       value={endDate ? format(endDate, "dd/MM/yyyy") : ""} 
                       readOnly
                       placeholder={!startDate ? "Select start date first" : "Pick a date"}
                       className={cn(
                         "flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic pointer-events-none",
                         !startDate ? "cursor-not-allowed" : "cursor-pointer"
                       )}
                     />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                  <DateRangeCalendar
                    mode="single"
                    startDate={startDate || null}
                    endDate={endDate || null}
                    minDate={startDate || undefined}
                    onDateChange={(date) => {
                      setEndDate(date || undefined);
                      if (date) setValue("endDate", date);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FieldError message={errors.endDate?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel required>Lecturer</FieldLabel>
              <Controller
                name="lecturer"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    options={lecturerOptions}
                    value={field.value}
                    onChange={field.onChange}
                    onSearchChange={setLecturerSearch}
                    searchValue={lecturerSearch}
                    placeholder="Select a lecturer"
                    isLoading={isLoadingLecturers}
                    error={!!errors.lecturer}
                  />
                )}
              />
              <FieldError message={errors.lecturer?.message} />
            </div>

            {/* Row 5 */}
            <div className="space-y-1">
              <FieldLabel required>Batch Level</FieldLabel>
              <Controller
                name="batchLevel"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic", errors.batchLevel && AUTH_INPUT.error)}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                       {LEVELS.map(lvl => (
                        <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.batchLevel?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel required>Select Hierarchy</FieldLabel>
              <div className="flex items-center gap-6 h-10">
                 <div className="flex items-center gap-2">
                    <input type="radio" id="3tiers" value="3 Tiers" {...register("hierarchy")} className="accent-[#0F172B] w-4 h-4 cursor-pointer" />
                    <label htmlFor="3tiers" className="text-sm text-[#45556C] cursor-pointer">3 Tiers</label>
                 </div>
                 <div className="flex items-center gap-2">
                    <input type="radio" id="4tiers" value="4 Tiers" {...register("hierarchy")} className="accent-[#0F172B] w-4 h-4 cursor-pointer" />
                    <label htmlFor="4tiers" className="text-sm text-[#45556C] cursor-pointer">4 Tiers</label>
                 </div>
                 <div className="flex items-center gap-2">
                    <input type="radio" id="5tiers" value="5 Tiers" {...register("hierarchy")} className="accent-[#0F172B] w-4 h-4 cursor-pointer" />
                    <label htmlFor="5tiers" className="text-sm text-[#45556C] cursor-pointer">5 Tiers</label>
                 </div>
              </div>
              <FieldError message={errors.hierarchy?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel>Lesson Duration (Hours)</FieldLabel>
              <Input
                {...register("lessonDuration")}
                type="number"
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                placeholder="eg: 2"
              />
            </div>

            {/* Row 6: Description */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 space-y-1">
              <FieldLabel>Batch Description</FieldLabel>
              <Textarea
                {...register("description")}
                className={cn(AUTH_INPUT.placeholder, "h-[127px]")}
                placeholder="eg: Type your message here"
              />
            </div>

            {/* Row 7: Cover Image */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1 space-y-1">
              <FieldLabel required>Batch Cover Image</FieldLabel>
              <Controller
                name="coverImage"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    imageUrl={field.value || ""}
                    setImage={field.onChange}
                    removeImage={() => field.onChange("")}
                    placeholder="Upload Image Here or drag and drop here"
                    className="w-full"
                  />
                )}
              />
              <FieldError message={errors.coverImage?.message} />
            </div>
          </div>
      </form>
    </div>
  );
}
