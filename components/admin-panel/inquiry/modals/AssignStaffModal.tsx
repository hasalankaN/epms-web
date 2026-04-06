"use client";

import React, { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { X, CalendarDays as CalendarIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";

import { useAssignStaff } from "@/hooks/api/enquiries/useAssignStaff";
import { useGetStaff } from "@/hooks/api/staff/useGetStaff";
import { AUTH_TYPOGRAPHY, BUTTON_STYLES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";
import type { InquiryDataType } from "@/types/inquiry";

// ===== SCHEMA =====
const assignStaffSchema = z.object({
  assignee_user_id: z.string().uuid("Please select a staff member."),
  next_follow_up_at: z.date().optional(),
});

type AssignStaffFormValues = z.infer<typeof assignStaffSchema>;

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: InquiryDataType | null;
}

export function AssignStaffModal({
  isOpen,
  onClose,
  inquiry,
}: AssignStaffModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: staffData, isLoading: isLoadingStaff } = useGetStaff({
    search: searchTerm,
    size: 20,
    status: "ACTIVE", // Usually only assign to active staff
  });

  const { mutateAsync: assignStaff, isPending } = useAssignStaff(inquiry?.id || "");

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AssignStaffFormValues>({
    resolver: zodResolver(assignStaffSchema),
    defaultValues: {
      assignee_user_id: "",
      next_follow_up_at: undefined,
    },
  });

  const nextFollowUpDate = watch("next_follow_up_at");

  if (!inquiry) return null;

  const onSubmit = async (values: AssignStaffFormValues) => {
    try {
      await assignStaff({
        assignee_user_id: values.assignee_user_id,
        next_follow_up_at: values.next_follow_up_at?.toISOString(),
      });
      reset();
      onClose();
    } catch {
      // toast handled in hook
    }
  };

  const staffOptions = staffData?.results.map((staff) => ({
    value: staff.userId,
    label: `${staff.firstName} ${staff.lastName}`,
    subLabel: staff.customId,
    avatarInitials: `${staff.firstName?.[0] || ""}${staff.lastName?.[0] || ""}`.toUpperCase(),
  })) || [];

  const FieldLabel = ({ children, required = false }: { children: React.ReactNode; required?: boolean }) => (
    <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block")}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[500px] flex-col gap-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] outline-none [&>button]:hidden">
        
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            show: {
              transition: {
                staggerChildren: 0.08,
              }
            }
          }}
          className="flex flex-col gap-4"
        >
          {/* ===== HEADER ===== */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
                Assign Staff Member
              </DialogTitle>
              <button
                title="Close"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
              >
                <X className="h-4 w-4 text-[#64748B]" />
              </button>
            </div>
            <div className="border-b border-[#E2E8F0]" />
          </motion.div>
          
          {/* ===== FORM ===== */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4">
            
            {/* Assign Staff Field */}
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
                    searchValue={searchTerm}
                    onSearchChange={setSearchTerm}
                    isLoading={isLoadingStaff}
                    error={!!errors.assignee_user_id}
                    placeholder="Select a team member"
                    searchPlaceholder="Search staff by name or custom ID..."
                  />
                )}
              />
              {errors.assignee_user_id && <p className="text-xs text-red-500 mt-1">{errors.assignee_user_id.message}</p>}
            </div>

            {/* Next Follow-Up Date Field */}
            <div className="space-y-1">
              <FieldLabel>Next Follow-Up Date</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex h-10 w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white hover:bg-slate-50 transition-colors">
                     <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
                        <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                     </div>
                     <input 
                       value={nextFollowUpDate ? format(nextFollowUpDate, "dd/MM/yyyy") : ""} 
                       readOnly
                       placeholder="Pick a date"
                       className={cn(
                         "flex-1 cursor-pointer bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic pointer-events-none"
                       )}
                     />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-[99999999]" align="start">
                  <DateRangeCalendar
                    mode="single"
                    startDate={nextFollowUpDate || null}
                    endDate={null}
                    onDateChange={(start) => setValue("next_follow_up_at", start || undefined)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Spacer */}
            <div className="h-2"></div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmit(onSubmit)}
                disabled={isPending}
                className={cn(BUTTON_STYLES.primary.full, "w-auto px-6 font-inter text-[14px] font-semibold leading-[20px]")}
              >
                {isPending ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </motion.div>
        </motion.div>

      </DialogContent>
    </Dialog>
  );
}
