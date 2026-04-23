"use client";

import React, { useEffect, useState } from "react";

import { X, CalendarDays as CalendarIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";
import { TimePicker } from "@/components/common/TimePicker";
import { RecipientSelector, type RecipientSelection } from "./RecipientSelector";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

// ===== SCHEMA =====
const editNotificationSchema = z.object({
  channels: z
    .array(z.enum(["PUSH", "SMS", "EMAIL"]))
    .min(1, "Select at least one channel."),
  recipients: z.any().refine((v) => v?.selectedGroups?.length > 0, { 
    message: "Select at least one recipient group." 
  }),
  title: z.string().min(1, "Notification title is required."),
  sendingOption: z.enum(["IMMEDIATELY", "SCHEDULE"]),
  scheduledDate: z.date().optional(),
  scheduledTime: z.string().optional(),
  message: z.string().min(1, "Message is required."),
});

type EditNotificationFormValues = z.infer<typeof editNotificationSchema>;

// ===== PROPS =====
export interface ScheduledNotificationDataType {
  id: string;
  scheduledOn: string;
  scheduledFor: string;
  title: string;
  channels: string;
  recipients: string;
}

interface EditNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: ScheduledNotificationDataType | null;
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
  <Label className={cn(AUTH_TYPOGRAPHY.label, className)}>
    {children}
    {required && <span className={cn(AUTH_TYPOGRAPHY.required, "ml-0.5")}>*</span>}
  </Label>
);

const CHANNELS: Array<{ value: "PUSH" | "SMS" | "EMAIL"; label: string }> = [
  { value: "PUSH", label: "Push Notification" },
  { value: "SMS", label: "SMS" },
  { value: "EMAIL", label: "Email" },
];

// ===== COMPONENT =====
export function EditNotificationModal({
  isOpen,
  onClose,
  notification,
}: EditNotificationModalProps) {
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<EditNotificationFormValues>({
    resolver: zodResolver(editNotificationSchema),
    defaultValues: {
      channels: [],
      recipients: {
        selectedGroups: [],
        roleSettings: {
          staff: { mode: "all", specificIds: [] },
          lecturers: { mode: "all", specificIds: [] },
          students: { mode: "all", specificIds: [] },
          referral_agents: { mode: "all", specificIds: [] },
        },
        courseSettings: { selectedIds: [], targetRoles: { students: true, lecturers: true, staff: true } },
        batchSettings: { selectedIds: [], targetRoles: { students: true, lecturers: true, staff: true } }
      },
      title: "",
      sendingOption: "SCHEDULE",
      scheduledDate: undefined,
      scheduledTime: undefined,
      message: "",
    },
  });

  const sendingOption = watch("sendingOption");
  const channels = watch("channels");

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  // Prefill form when data is loaded
  useEffect(() => {
    if (isOpen && notification) {
      // Mock prefilling based on the simple table data
      const mockPrefillChannels: any[] = [];

      if (notification.channels.includes("SMS")) mockPrefillChannels.push("SMS");
      if (notification.channels.includes("Email")) mockPrefillChannels.push("EMAIL");
      if (notification.channels.includes("Push")) mockPrefillChannels.push("PUSH");

      reset({
        channels: mockPrefillChannels,
        recipients: {
          selectedGroups: ["students"], // Mock based on table string
          roleSettings: {
            staff: { mode: "all", specificIds: [] },
            lecturers: { mode: "all", specificIds: [] },
            students: { mode: "all", specificIds: [] },
            referral_agents: { mode: "all", specificIds: [] },
          },
          courseSettings: { selectedIds: [], targetRoles: { students: true, lecturers: true, staff: true } },
          batchSettings: { selectedIds: [], targetRoles: { students: true, lecturers: true, staff: true } }
        },
        title: notification.title,
        sendingOption: "SCHEDULE",
        scheduledDate: new Date(), // MOCK
        scheduledTime: "10:00", // MOCK
        message: "Lorem ipsum dolor sit amet consectetur. Ut pharetra commodo aliquet eu sed senectus. Lorem ipsum dolor sit amet consectetur.",
      });
    }
  }, [isOpen, notification, reset]);

  const toggleChannel = (ch: "PUSH" | "SMS" | "EMAIL", checked: boolean) => {
    const current = channels || [];
    let updated;
    
    if (checked) {
      updated = [...current, ch];
    } else {
      updated = current.filter((c) => c !== ch);
    }
    
    setValue("channels", updated, { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = async (values: EditNotificationFormValues) => {
    try {
      console.log("Updated notification payload:", values);

      // await updateNotification(values);
      onClose();
    } catch {
      // errors
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent
          animateChildren={true}
          className="flex max-h-[90vh] w-[95%] max-w-[720px] flex-col gap-0 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
        >
          {/* ===== HEADER ===== */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 p-5 sm:p-6 pb-4 shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex-1 font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
                Edit Notification
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
          <motion.form
            key={notification?.id}
            variants={itemVariants}
            id="edit-notification-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto px-5 sm:px-6 pb-2 custom-scrollbar"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              
              {/* ===== LEFT COLUMN ===== */}
              <div className="flex flex-col gap-5">
                {/* ── Channel ── */}
                <div className="space-y-3">
                  <FieldLabel required>Select the Channel</FieldLabel>
                  <div className="flex flex-wrap gap-6 pt-1">
                    {CHANNELS.map((ch) => (
                      <label
                        key={ch.value}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <input 
                          type="checkbox"
                          checked={channels?.includes(ch.value)}
                          onChange={(e) => toggleChannel(ch.value, e.target.checked)}
                          className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                        />
                        <span className="text-sm font-medium text-[#45556C] cursor-pointer">{ch.label}</span>
                      </label>
                    ))}
                  </div>
                  {errors.channels && (
                    <p className="mt-1 text-xs text-red-500">{errors.channels.message}</p>
                  )}
                </div>

                {/* ── Recipients ── */}
                <div className="space-y-3">
                  <FieldLabel required>Select Recipients</FieldLabel>
                  <div className="pt-1">
                    <Controller
                      name="recipients"
                      control={control}
                      render={({ field }) => (
                        <RecipientSelector
                          value={field.value as RecipientSelection}
                          onChange={field.onChange}
                          error={!!errors.recipients}
                        />
                      )}
                    />
                  </div>
                  {errors.recipients && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.recipients.message as string}
                    </p>
                  )}
                </div>

                {/* ── Sending Options ── */}
                <div className="space-y-3">
                  <FieldLabel required>Sending Options</FieldLabel>
                  <Controller
                    name="sendingOption"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-col gap-3 pt-1">
                        {(["IMMEDIATELY", "SCHEDULE"] as const).map((opt) => (
                          <label
                            key={opt}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <input 
                              type="radio" 
                              className="accent-[#0F172B] h-4 w-4 cursor-pointer"
                              checked={field.value === opt}
                              onChange={() => field.onChange(opt)}
                            />
                            <span className="text-sm font-medium text-[#45556C] cursor-pointer">
                              {opt === "IMMEDIATELY" ? "Send Immediately" : "Schedule for Later"}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  />

                  {/* Conditional Date + Time */}
                  {sendingOption === "SCHEDULE" && (
                    <div className="mt-4 flex flex-col gap-4 pl-6 border-l-2 border-slate-100 ml-1">
                      {/* Date */}
                      <div className="space-y-1">
                        <FieldLabel required>Date</FieldLabel>
                        <Controller
                          name="scheduledDate"
                          control={control}
                          render={({ field }) => (
                            <Popover>
                              <PopoverTrigger asChild>
                                <div className="flex h-10 w-full cursor-pointer items-center rounded-md border border-gray-300 bg-white transition-all hover:bg-slate-50 focus-within:ring-2 focus-within:ring-[#E60076]">
                                  <div className="flex h-full items-center justify-center border-r border-slate-200 px-3">
                                    <CalendarIcon className="h-4 w-4 text-[#64748B]" />
                                  </div>
                                  <input
                                    value={field.value ? format(field.value, "dd/MM/yyyy") : ""}
                                    readOnly
                                    placeholder="Pick a date"
                                    className={cn(
                                      "flex-1 cursor-pointer bg-transparent px-3 py-2 text-sm outline-none pointer-events-none text-[#1D293D]",
                                      AUTH_INPUT.placeholder
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

                      {/* Time */}
                      <div className="space-y-1">
                        <FieldLabel required>Time</FieldLabel>
                        <Controller
                          name="scheduledTime"
                          control={control}
                          render={({ field }) => (
                            <TimePicker
                              value={field.value || null}
                              onChange={field.onChange}
                              placeholder="Pick a time"
                              error={!!errors.scheduledTime}
                            />
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ===== RIGHT COLUMN ===== */}
              <div className="flex flex-col gap-5 h-full">
                {/* ── Notification Title ── */}
                <div className="space-y-1">
                  <FieldLabel required>Notification Title</FieldLabel>
                  <Input
                    {...register("title")}
                    className={cn(
                      AUTH_INPUT.base,
                      AUTH_INPUT.placeholder,
                      errors.title && AUTH_INPUT.error
                    )}
                    placeholder="eg: Welcome to new batch"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
                  )}
                </div>

                {/* ── Message ── */}
                <div className="flex flex-col flex-1 space-y-1">
                  <FieldLabel required>Message</FieldLabel>
                  <Textarea
                    {...register("message")}
                    className={cn(
                      "flex-1 min-h-[200px] resize-none text-[#1D293D] text-sm",
                      AUTH_INPUT.placeholder,
                      errors.message && AUTH_INPUT.error
                    )}
                    placeholder="eg: Type your message here"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
                  )}
                </div>
              </div>

            </div>
          </motion.form>

          {/* ===== FOOTER ===== */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-end gap-3 p-5 sm:p-6 pt-5 border-t border-[#E2E8F0] shrink-0 mt-4"
          >
            <Button
              type="submit"
              form="edit-notification-form"
              disabled={isSubmitting || !isDirty}
              className={cn(
                BUTTON_STYLES.primary.full,
                "w-auto px-6 font-inter text-[14px] font-semibold text-white leading-5"
              )}
            >
              {isSubmitting ? "Saving..." : "Update"}
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
