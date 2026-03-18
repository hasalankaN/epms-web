"use client";

import React, { useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { 
  courseCommissionDetailsSchema, 
  type CourseCommissionDetailsValues,
} from "@/schemas/course.schema";
import { useCourseFormStore } from "@/store/courseFormStore";
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
  AUTH_TYPOGRAPHY,
  AUTH_INPUT, 
} from "@/lib/constants/theme";

interface CourseCommissionDetailsStepProps {
  onNext?: () => void;
}

// Section Header Style - Updated to 16px as requested
const SECTION_HEADER_STYLE = "text-[16px] font-medium text-[#45556C] font-inter leading-5 mb-4";


export function CourseCommissionDetailsStep({ onNext }: CourseCommissionDetailsStepProps) {
  // Get stored values and actions from Zustand store
  const { commissionDetails, setCommissionDetails } = useCourseFormStore();

  const form = useForm<CourseCommissionDetailsValues>({
    resolver: zodResolver(courseCommissionDetailsSchema),
    defaultValues: commissionDetails as CourseCommissionDetailsValues,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = form;

  // Watch all form values and save to store on change
  useEffect(() => {
    const subscription = watch((data) => {
      setCommissionDetails(data as Partial<CourseCommissionDetailsValues>);
    });
    
    return () => subscription.unsubscribe();
  }, [watch, setCommissionDetails]);


  const getSelectTriggerClass = (value: string | undefined, hasError?: boolean) => {
    return cn(
        AUTH_INPUT.base, 
        "w-full",
        !value ? "text-[#90A1B9] italic" : "text-[#0F172B]",
        hasError && AUTH_INPUT.error
    );
  };

  const FieldError = ({ message }: { message?: string }) => {
    if (!message) return null;
    
    return <p className="text-xs text-red-500 mt-1">{message}</p>;
  };

  const onSubmit = (data: CourseCommissionDetailsValues) => {
    console.log("Course Commission Details Submitted:", data);
    setCommissionDetails(data);
    onNext?.();
  };

  return (
    <form id="active-step-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* Referral Commissions Section */}
      <div>
        <h3 className={SECTION_HEADER_STYLE}>Referral Commissions</h3>
        
        {/* Grid: 3 columns for Desktop, stack on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Commission Type */}
            <div className="space-y-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>Commission Type</Label>
                <Controller
                  name="referralType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={getSelectTriggerClass(field.value, !!errors.referralType)}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.referralType?.message} />
            </div>

            {/* Commission Value */}
            <div className="space-y-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>Commission Value</Label>
                <Input 
                   {...register("referralValue")}
                   placeholder="eg: xxxx.00"
                   className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, errors.referralValue && AUTH_INPUT.error)}
                />
                <FieldError message={errors.referralValue?.message} />
            </div>

            {/* Team Commission Value */}
            <div className="space-y-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>Team Commission Value</Label>
                <Input 
                   {...register("teamValue")}
                   placeholder="eg: xxxx.00"
                   className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, errors.teamValue && AUTH_INPUT.error)}
                />
                <FieldError message={errors.teamValue?.message} />
            </div>

        </div>
      </div>

      {/* Lecturer Commissions Section */}
      <div>
        <h3 className={SECTION_HEADER_STYLE}>Lecturer Commissions</h3>

        {/* Grid: 2 columns for Desktop (matching image layout where 3rd is empty), stack on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Commission Type */}
             <div className="space-y-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>Commission Type</Label>
                <Controller
                  name="lecturerType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={getSelectTriggerClass(field.value, !!errors.lecturerType)}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.lecturerType?.message} />
            </div>

            {/* Commission Value */}
            <div className="space-y-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>Commission Value</Label>
                 <Input 
                   {...register("lecturerValue")}
                   placeholder="eg: xxxx.00"
                   className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, errors.lecturerValue && AUTH_INPUT.error)}
                />
                <FieldError message={errors.lecturerValue?.message} />
            </div>
            
            {/* Empty 3rd column to maintain grid structure if needed, or just let it flow */}
            <div className="hidden md:block"></div>
        </div>
      </div>

      {/* Staff Commission per enrollment */}
      <div>
        <h3 className={SECTION_HEADER_STYLE}>Staff Commission per enrollment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>Commission Type</Label>
                <Controller
                  name="staffType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={getSelectTriggerClass(field.value, !!errors.staffType)}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.staffType?.message} />
            </div>
            <div className="space-y-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>Commission Value</Label>
                 <Input 
                   {...register("staffValue")}
                   placeholder="eg: xxxx.00"
                   className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, errors.staffValue && AUTH_INPUT.error)}
                />
                <FieldError message={errors.staffValue?.message} />
            </div>
            <div className="hidden md:block"></div>
        </div>
      </div>

      {/* Staff Commission per enrollment by Branch */}
      <div>
        <h3 className={SECTION_HEADER_STYLE}>Staff Commission per enrollment by Branch</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>Commission Type</Label>
                <Controller
                  name="branchStaffType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={getSelectTriggerClass(field.value, !!errors.branchStaffType)}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.branchStaffType?.message} />
            </div>
            <div className="space-y-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>Commission Value</Label>
                 <Input 
                   {...register("branchStaffValue")}
                   placeholder="eg: xxxx.00"
                   className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder, errors.branchStaffValue && AUTH_INPUT.error)}
                />
                <FieldError message={errors.branchStaffValue?.message} />
            </div>
            <div className="hidden md:block"></div>
        </div>
      </div>

    </form>
  );
}
