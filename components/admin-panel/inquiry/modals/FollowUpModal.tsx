import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { X, CalendarDays as CalendarIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";
import { StatusPopover } from "@/components/common/StatusPopover";

import { useAddFollowUp } from "@/hooks/api/enquiries/useAddFollowUp";
import { useGetEnquiryById } from "@/hooks/api/enquiries/useGetEnquiryById";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";
import { INQUIRY_STATUS_CONFIG } from "@/types/inquiry";
import type { InquiryDataType } from "@/types/inquiry";

// ===== SCHEMA =====
const followUpSchema = z.object({
  note: z.string().min(1, "Follow-up note is required.").max(1000),
  next_follow_up_at: z.date().optional(),
  status_override: z.enum(["COMPLETED", "NO_RESPONSE"]).optional(),
});

type FollowUpFormValues = z.infer<typeof followUpSchema>;

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: InquiryDataType | null;
}

export function FollowUpModal({
  isOpen,
  onClose,
  inquiry: listInquiry,
}: FollowUpModalProps) {
  // Fetch full details
  const { data: inquiry, isLoading } = useGetEnquiryById(
    isOpen ? listInquiry?.id ?? null : null
  );

  const { mutateAsync: addFollowUp, isPending } = useAddFollowUp(listInquiry?.id || "");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FollowUpFormValues>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      note: "",
      next_follow_up_at: undefined,
      status_override: undefined,
    },
  });

  const nextFollowUpDate = watch("next_follow_up_at");
  const statusOverride = watch("status_override");

  if (!listInquiry) return null;

  const onSubmit = async (values: FollowUpFormValues) => {
    try {
      await addFollowUp({
        note: values.note,
        next_follow_up_at: values.next_follow_up_at?.toISOString(),
        status_override: values.status_override,
      });
      reset();
      onClose();
    } catch {
      // toast handled in hook
    }
  };

  const statusOptions = Object.entries(INQUIRY_STATUS_CONFIG)
    .filter(([status]) => status === "Completed" || status === "No Response")
    .map(([status, config]) => ({
      value: status,
      bg: config.bg,
      text: config.text,
    }));

  const FieldLabel = ({ children, required = false }: { children: React.ReactNode; required?: boolean }) => (
    <Label className={cn(AUTH_TYPOGRAPHY.label, "mb-1.5 block")}>
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        isLoading={isOpen && isLoading}
        animateChildren={true}
        className="flex max-h-[90vh] w-[95%] max-w-[500px] flex-col gap-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-xl outline-none [&>button]:hidden"
      >
        
        {/* ===== HEADER ===== */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 p-6 pb-0">
            <div className="flex items-center justify-between">
                <DialogTitle className="flex-1 text-lg font-semibold leading-[30px] text-[#0F172B]">
                    Follow-Ups - [{listInquiry.name}]
                </DialogTitle>
                <button
                    title="Close"
                    onClick={onClose}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
                >
                    <X className="h-4 w-4 text-[#64748B]" />
                </button>
            </div>
            
            <div className="flex flex-col gap-0.5">
                 <span className="font-inter text-xs font-normal text-[#64748B]">
                     {inquiry?.course_name || inquiry?.batch_name || "Enquiry Interest"}
                 </span>
                 <div className="font-inter text-xs text-[#314158]">
                      <span className="font-normal">Next Follow Up : </span>
                      <span className="font-bold">{inquiry?.next_follow_up_at ? format(new Date(inquiry.next_follow_up_at), "dd/MM/yyyy") : "N/A"}</span>
                 </div>
            </div>

            <div className="border-b border-[#E2E8F0]" />
        </motion.div>



        {/* ===== SCROLLABLE CONTENT ===== */}
        <div className="flex-1 overflow-y-auto p-6 pt-4 space-y-6 custom-scrollbar">
            
            {/* Form Section */}
            <motion.div variants={itemVariants} className="space-y-4">
                <div className="space-y-1.5">
                    <FieldLabel>Next Follow-Up Date</FieldLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className={cn(
                                "flex h-10 w-full cursor-pointer items-center rounded-md border bg-white hover:bg-slate-50",
                                errors.next_follow_up_at ? "border-red-500" : "border-gray-300"
                            )}>
                                <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
                                    <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                                </div>
                                <input
                                    value={nextFollowUpDate ? format(nextFollowUpDate, "dd/MM/yyyy") : ""}
                                    readOnly
                                    placeholder="Pick a date"
                                    className={cn(
                                        "flex-1 cursor-pointer bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400 placeholder:italic",
                                        "pointer-events-none" // Pass clicks to parent div
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
                    {errors.next_follow_up_at && <p className="text-xs text-red-500 mt-1">{errors.next_follow_up_at.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <FieldLabel required={true}>Follow-Up Note</FieldLabel>
                    <Textarea 
                        {...register("note")}
                        placeholder="eg: Type your note here"
                        className={cn(
                            "min-h-[100px] resize-none",
                            AUTH_INPUT.placeholder,
                            errors.note ? "border-red-500 focus-visible:ring-red-500" : "border-gray-300 focus-visible:ring-[#E60076]"
                        )}
                    />
                    {errors.note && <p className="text-xs text-red-500 mt-1">{errors.note.message}</p>}
                </div>

                <div className="flex justify-end">
                    <Button 
                        onClick={handleSubmit(onSubmit)}
                        disabled={isPending}
                        className={cn(BUTTON_STYLES.primary.full, "w-auto px-6")}
                    >
                        {isPending ? "Adding..." : "Add Follow-Up"}
                    </Button>
                </div>
            </motion.div>

            {/* Activities Section */}
            <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="font-inter text-base font-semibold leading-6 text-[#0F172B]">
                    Activities
                </h3>

                <div className="flex flex-col gap-0">
                    <div className="flex max-h-[250px] flex-col overflow-y-auto pr-2 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                            </div>
                        ) : inquiry?.followups && inquiry.followups.length > 0 ? (
                            inquiry.followups.map((activity, index) => (
                                <div key={activity.id} className="flex gap-3">
                                    <div className="flex flex-col items-center pt-1">
                                        <i className="clock-counter-clockwise h-5 w-5 shrink-0 text-[#0F172B]" />
                                        {index !== inquiry.followups.length - 1 && (
                                            <div className="mt-[5px] mb-[9px] h-[14px] w-[1px] bg-slate-300" />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-0.5 pb-4">
                                        <span className="font-inter text-xs font-normal leading-4 text-[#314158]">
                                            {activity.note}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-inter text-xs font-normal leading-4 text-[#90A1B9]">
                                                {format(new Date(activity.created_at), "MM/dd/yyyy hh:mm:ss a")}
                                            </span>
                                            {activity.status_at_time && (
                                                <>
                                                    <span className="text-[#90A1B9]">•</span>
                                                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                                        {activity.status_at_time.replace(/_/g, " ")}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-slate-400 italic text-sm">
                                No activities recorded yet.
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
            
            {/* Status Footer */}
            <motion.div variants={itemVariants} className="flex justify-end pt-2">
                 <StatusPopover
                    value={
                        statusOverride === "COMPLETED" ? "Completed" : 
                        statusOverride === "NO_RESPONSE" ? "No Response" : 
                        listInquiry.status
                    }
                    options={statusOptions}
                    onValueChange={(val) => {
                        // Only allow overrides for specific statuses as per requirements
                        if (val === "Completed" || val === "No Response") {
                            const overrideVal = val === "Completed" ? "COMPLETED" : "NO_RESPONSE";

                            setValue("status_override", overrideVal, { shouldDirty: true });
                        } else {
                            setValue("status_override", undefined);
                        }
                    }}
                 />
            </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
