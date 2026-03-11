"use client";

import React, { useState, useEffect } from "react";

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

const STAFF_OPTIONS = [
  { 
    value: "kalpa", 
    label: "Kalpa Perera", 
    handle: "@kalpa",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kalpa" 
  },
  { 
    value: "saduni", 
    label: "Saduni", 
    handle: "@saduni",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=saduni" 
  },
];

const CERTIFICATE_OPTIONS = [
  { value: "UK", label: "UK" },
  { value: "Free", label: "Free" },
];

interface GeneralDetailsStepProps {
  onNext?: () => void;
}

export function GeneralDetailsStep({ onNext }: GeneralDetailsStepProps) {
  // Get stored values and actions from Zustand store
  const { generalDetails, setGeneralDetails } = useBatchFormStore();
  
  // Transform stored dates (which may be strings from localStorage) back to Date objects
  const transformedDefaults = {
    ...generalDetails,
    startDate: generalDetails.startDate ? new Date(generalDetails.startDate) : undefined,
    endDate: generalDetails.endDate ? new Date(generalDetails.endDate) : undefined,
  };
  
  const [startDate, setStartDate] = useState<Date | undefined>(
    transformedDefaults.startDate
  );

  const [endDate, setEndDate] = useState<Date | undefined>(
    transformedDefaults.endDate
  );

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
    console.log("General Details Submitted:", data);
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
    
    return <p className="text-xs text-red-500 mt-1">{message}</p>;
  };

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
              <FieldLabel>Branch</FieldLabel>
              <Controller
                name="branch"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic", errors.branch && AUTH_INPUT.error)}>
                      <SelectValue placeholder="Select Branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main">Main</SelectItem>
                      <SelectItem value="Kandy">Kandy</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Sinhala">Sinhala</SelectItem>
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
                      <SelectItem value="Diploma">Diploma</SelectItem>
                      <SelectItem value="Certificate">Certificate</SelectItem>
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
                    options={STAFF_OPTIONS}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select multiple staff members"
                    error={!!errors.staffMembers}
                  />
                )}
              />
              <FieldError message={errors.staffMembers?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel>Assignment</FieldLabel>
              <Controller
                name="assignment"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assignment">Assignment</SelectItem>
                      <SelectItem value="Exam">Exam</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
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
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Physical">Physical</SelectItem>
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
                    options={CERTIFICATE_OPTIONS}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select all the types of certificate"
                    error={!!errors.certificates}
                  />
                )}
              />
              <FieldError message={errors.certificates?.message} />
            </div>

            {/* Row 4 */}
            <div className="space-y-1">
              <FieldLabel>Batch Status</FieldLabel>
              <Controller
                name="batchStatus"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ongoing">Ongoing</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic", errors.lecturer && AUTH_INPUT.error)}>
                      <SelectValue placeholder="Select a lecturer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ruwan Perera">
                         <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-gray-300 overflow-hidden shrink-0">
                                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=ruwan`} alt="avatar" />
                            </div>
                            <span className="text-[#0F172B]">Ruwan Perera</span>
                            <span className="text-[#64748B]">@ruwan</span>
                         </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.lecturer?.message} />
            </div>

            {/* Row 5 */}
            <div className="space-y-1">
              <FieldLabel>Batch Level</FieldLabel>
              <Controller
                name="batchLevel"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="Beginner">Beginner</SelectItem>
                       <SelectItem value="Intermediate">Intermediate</SelectItem>
                       <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1">
              <FieldLabel>Select Hierarchy</FieldLabel>
              <div className="flex items-center gap-4 h-10">
                 {/* Replaced Radio Group with simple inputs for now as standard implementation */}
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
            </div>

            <div className="space-y-1">
              <FieldLabel>Lesson Duration</FieldLabel>
              <Input
                {...register("lessonDuration")}
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                placeholder="eg: 2h"
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
