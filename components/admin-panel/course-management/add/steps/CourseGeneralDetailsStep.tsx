"use client";

import React, { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { 
  courseGeneralDetailsSchema, 
  type CourseGeneralDetailsValues,
} from "@/schemas/course.schema";
import { useCourseFormStore } from "@/store/courseFormStore";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";
import { Input } from "@/components/ui/input";
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
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useGetCertificateTemplates } from "@/hooks/api/certificates/useGetCertificateTemplates";
import { useGetCategories } from "@/hooks/api/course-categories/useGetCategories";
import { useGetLecturers } from "@/hooks/api/lecturers/useGetLecturers";

const SUBJECT_OPTIONS = [
  { value: "subject-batch", label: "Subject - Batch Name" },
  { value: "computer-science", label: "Computer Science" },
  { value: "mathematics", label: "Mathematics" },
  { value: "english", label: "English" },
];

interface CourseGeneralDetailsStepProps {
  onNext?: () => void;
}

export function CourseGeneralDetailsStep({ onNext }: CourseGeneralDetailsStepProps) {
  // Get stored values and actions from Zustand store
  const { generalDetails, setGeneralDetails } = useCourseFormStore();
  
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

  const [staffSearch, setStaffSearch] = useState("");
  const [catSearch, setCatSearch] = useState("");
  const [lecturerSearch, setLecturerSearch] = useState("");

  const { data: staffData, isLoading: isStaffLoading } = useGetStaff({
    page: 1,
    size: 10,
    search: staffSearch,
  });

  const staffOptions = staffData?.results.map((staff) => ({
    value: staff.userId,
    label: `${staff.firstName || ""} ${staff.lastName || ""}`.trim(),
    handle: staff.email,
    avatar: null, // ApiStaffRow does not have an avatar/profile image field
  })) || [];

  const { data: certData, isLoading: isCertLoading } = useGetCertificateTemplates({ page: 1, limit: 50 });

  const certOptions = certData?.results?.map((cert) => ({
    value: cert.id,
    label: cert.name,
  })) || [];

  const { data: catData, isLoading: isCatLoading } = useGetCategories({ page: 1, size: 50, search: catSearch });

  const catOptions = catData?.results.map((cat) => ({
    value: cat.id,
    label: cat.name,
  })) || [];

  const { data: lecturerData, isLoading: isLecturerLoading } = useGetLecturers({ page: 1, size: 50, search: lecturerSearch });

  const lecturerOptions = lecturerData?.results.map((lec) => ({
    value: lec.user_id,
    label: `${lec.first_name || ""} ${lec.last_name || ""}`.trim(),
    subLabel: lec.email,
    avatarInitials: `${lec.first_name?.[0] || ""}${lec.last_name?.[0] || ""}`,
  })) || [];

  const form = useForm<CourseGeneralDetailsValues>({
    resolver: zodResolver(courseGeneralDetailsSchema),
    defaultValues: transformedDefaults as CourseGeneralDetailsValues,
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
      setGeneralDetails(data as Partial<CourseGeneralDetailsValues>);
    });
    
    return () => subscription.unsubscribe();
  }, [watch, setGeneralDetails]);

  const onSubmit = (data: CourseGeneralDetailsValues) => {
    console.log("Course General Details Submitted:", data);
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
              <FieldLabel required>Course Name</FieldLabel>
              <Input
                {...register("courseName")}
                className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, errors.courseName && AUTH_INPUT.error)}
                placeholder="eg: Diploma in Computing – Batch 02"
              />
              <FieldError message={errors.courseName?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel required>Assign Staff Members</FieldLabel>
              <Controller
                name="staffMembers"
                control={control}
                render={({ field }) => (
                  <MultiSelect
                    options={staffOptions}
                    value={field.value}
                    onChange={field.onChange}
                    onSearchChange={setStaffSearch}
                    searchValue={staffSearch}
                    placeholder="Select multiple staff members"
                    error={!!errors.staffMembers}
                    isLoading={isStaffLoading}
                  />
                )}
              />
              <FieldError message={errors.staffMembers?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel>Assessment</FieldLabel>
              <div className="flex items-center gap-6 h-10">
                 <div className="flex items-center gap-2">
                    <input type="radio" id="assessment-yes" value="Yes" {...register("assessment")} className="accent-[#0F172B] w-4 h-4 cursor-pointer" />
                    <label htmlFor="assessment-yes" className="text-sm text-[#45556C] cursor-pointer">Yes</label>
                 </div>
                 <div className="flex items-center gap-2">
                    <input type="radio" id="assessment-no" value="No" {...register("assessment")} className="accent-[#0F172B] w-4 h-4 cursor-pointer" />
                    <label htmlFor="assessment-no" className="text-sm text-[#45556C] cursor-pointer">No</label>
                 </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="space-y-1">
              <FieldLabel>Course Type</FieldLabel>
              <Controller
                name="courseType"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Certificate">Certificate</SelectItem>
                      <SelectItem value="Diploma">Diploma</SelectItem>
                      <SelectItem value="HND">HND</SelectItem>
                      <SelectItem value="Degree">Degree</SelectItem>
                      <SelectItem value="School">School</SelectItem>
                      <SelectItem value="University">University</SelectItem>
                      <SelectItem value="Exam Prep">Exam Prep</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1">
              <FieldLabel>Start Date</FieldLabel>
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
                    placeholder="Select all the types of certificate"
                    error={!!errors.certificates}
                    isLoading={isCertLoading}
                  />
                )}
              />
              <FieldError message={errors.certificates?.message} />
            </div>

            {/* Row 3 */}
            <div className="space-y-1">
              <FieldLabel required>Course Category</FieldLabel>
              <Controller
                name="courseCategory"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    options={catOptions}
                    value={field.value || ""}
                    onChange={field.onChange}
                    searchValue={catSearch}
                    onSearchChange={setCatSearch}
                    placeholder="Select category"
                    searchPlaceholder="Search category..."
                    emptyMessage="No category found."
                    error={!!errors.courseCategory}
                    isLoading={isCatLoading}
                  />
                )}
              />
              <FieldError message={errors.courseCategory?.message} />
            </div>

            <div className="space-y-1">
              <FieldLabel>End Date</FieldLabel>
               <Popover open={!startDate ? false : undefined}>
                <PopoverTrigger asChild disabled={!startDate}>
                  <div 
                    className={cn(
                      "flex h-10 w-full items-center rounded-md border border-gray-300 bg-white transition-all",
                      !startDate ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-slate-50",
                      errors.endDate && "border-red-500"
                    )}
                    onClick={(e) => !startDate && e.preventDefault()}
                  >
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
                {startDate && (
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
                )}
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
                    value={field.value || ""}
                    onChange={field.onChange}
                    searchValue={lecturerSearch}
                    onSearchChange={setLecturerSearch}
                    placeholder="Select lecturer"
                    searchPlaceholder="Search lecturer..."
                    emptyMessage="No lecturer found."
                    error={!!errors.lecturer}
                    isLoading={isLecturerLoading}
                  />
                )}
              />
              <FieldError message={errors.lecturer?.message} />
            </div>

            {/* Row 4 */}
            <div className="space-y-1">
              <FieldLabel required>Course Level</FieldLabel>
              <Controller
                name="courseLevel"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic", errors.courseLevel && AUTH_INPUT.error)}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="Beginner">Beginner</SelectItem>
                       <SelectItem value="Intermediate">Intermediate</SelectItem>
                       <SelectItem value="Advanced">Advanced</SelectItem>
                       <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.courseLevel?.message} />
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
                      <SelectItem value="Tamil">Tamil</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError message={errors.language?.message} />
            </div>

            <div className="space-y-1">
            <FieldLabel>Subject</FieldLabel>
                  <Controller
                    name="batchId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className={cn(AUTH_INPUT.base, "data-[placeholder]:text-[#90A1B9] data-[placeholder]:italic")}>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECT_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FieldError message={errors.batchId?.message} />
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

            {/* Row 5: Hierarchy */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
              <FieldLabel required>Select Hierarchy</FieldLabel>
              <div className="flex items-center gap-6 h-10">
                 <div className="flex items-center gap-2">
                    <input type="radio" id="course-3tiers" value="3 Tiers" {...register("hierarchy")} className="accent-[#0F172B] w-4 h-4 cursor-pointer" />
                    <label htmlFor="course-3tiers" className="text-sm text-[#45556C] cursor-pointer">3 Tiers</label>
                 </div>
                 <div className="flex items-center gap-2">
                    <input type="radio" id="course-4tiers" value="4 Tiers" {...register("hierarchy")} className="accent-[#0F172B] w-4 h-4 cursor-pointer" />
                    <label htmlFor="course-4tiers" className="text-sm text-[#45556C] cursor-pointer">4 Tiers</label>
                 </div>
                 <div className="flex items-center gap-2">
                    <input type="radio" id="course-5tiers" value="5 Tiers" {...register("hierarchy")} className="accent-[#0F172B] w-4 h-4 cursor-pointer" />
                    <label htmlFor="course-5tiers" className="text-sm text-[#45556C] cursor-pointer">5 Tiers</label>
                 </div>
              </div>
              <FieldError message={errors.hierarchy?.message} />
            </div>

            {/* Row 6: Short Description */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
              <FieldLabel>Course Short Description</FieldLabel>
              <textarea
                {...register("shortDescription")}
                className="flex min-h-[80px] w-full rounded-md border border-[#E2E8F0] bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-[#90A1B9] placeholder:italic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60076] focus-visible:border-[#E60076] resize-none"
                placeholder="eg: Type your message here"
              />
            </div>

            {/* Row 7: Long Description with Rich Text Editor */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
              <FieldLabel required>Course Long Description</FieldLabel>
              <p className={cn(AUTH_TYPOGRAPHY.description, "mb-2")}>This is a hint text to help user.</p>
              <Controller
                name="longDescription"
                control={control}
                render={({ field }) => (
                  <RichTextEditor
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="eg: Type your message here"
                    error={!!errors.longDescription}
                  />
                )}
              />
              <FieldError message={errors.longDescription?.message} />
            </div>

            {/* Row 8: Cover Image and Introduction Video - Full Width each */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <FieldLabel required>Course Cover Image</FieldLabel>
                <Controller
                  name="coverImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      imageUrl={field.value || ""}
                      setImage={field.onChange}
                      removeImage={() => field.onChange("")}
                      placeholder="Upload Image Here or drag and drop here"
                      supportedFormats="Supported File format: png, jpeg, WebP"
                      maxSize="(Max 10MB)"
                      className="w-full"
                      accept="image/png, image/jpeg, image/webp"
                    />
                  )}
                />
                <FieldError message={errors.coverImage?.message} />
              </div>

              <div className="space-y-1">
                <FieldLabel required>Course Introduction Video</FieldLabel>
                <Controller
                  name="introductionVideo"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload
                      imageUrl={field.value || ""}
                      setImage={field.onChange}
                      removeImage={() => field.onChange("")}
                      placeholder="Upload Image Here or drag and drop here"
                      supportedFormats="Supported File format: mp4, webm, mov"
                      maxSize="(Max 10MB)"
                      className="w-full"
                      accept="video/*"
                    />
                  )}
                />
                <FieldError message={errors.introductionVideo?.message} />
              </div>
            </div>
          </div>
      </form>
    </div>
  );
}
