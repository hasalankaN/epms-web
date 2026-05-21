"use client";

import React, { useState, useEffect } from "react";

import { createPortal } from "react-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, CalendarDays as CalendarIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import {
  AUTH_INPUT,
  AUTH_TYPOGRAPHY,
  BUTTON_STYLES,
} from "@/lib/constants/theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";
import { TimePicker } from "@/components/common/TimePicker";
import {
  RecipientSelector,
  type RecipientSelection,
} from "./RecipientSelector";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { useCreateNotification } from "@/hooks/api/notifications/useCreateNotification";
import type {
  CreateNotificationDto,
  NotificationTargetType,
} from "@/types/notifications";

// ===== SCHEMA =====

const notificationSchema = z.object({
  channels: z
    .array(z.enum(["PUSH", "SMS", "EMAIL"]))
    .min(1, "Select at least one channel."),
  recipients: z.any().refine((v) => v.selectedGroups?.length > 0, {
    message: "Select at least one recipient group.",
  }),
  title: z.string().min(1, "Notification title is required."),
  sendingOption: z.enum(["IMMEDIATELY", "SCHEDULE"]),
  scheduledDate: z.date().optional(),
  scheduledTime: z.string().optional(),
  message: z.string().min(1, "Message is required."),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

// ===== PROPS =====

interface AddNotificationPanelProps {
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
  <Label className={cn(AUTH_TYPOGRAPHY.label, className)}>
    {children}
    {required && (
      <span className={cn(AUTH_TYPOGRAPHY.required, "ml-0.5")}>*</span>
    )}
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

const CHANNELS: Array<{ value: "PUSH" | "SMS" | "EMAIL"; label: string }> = [
  { value: "PUSH", label: "Push Notification" },
  { value: "SMS", label: "SMS" },
  { value: "EMAIL", label: "Email" },
];

// ===== COMPONENT =====

// Convert RecipientSelection → { targetType, targetIds }
function resolveTarget(
  recipients: RecipientSelection,
): Pick<CreateNotificationDto, "targetType" | "targetIds"> {
  const { selectedGroups, roleSettings, courseSettings, batchSettings } =
    recipients;

  if (
    selectedGroups.includes("batches") &&
    batchSettings.selectedIds.length > 0
  ) {
    return { targetType: "BATCH", targetIds: batchSettings.selectedIds };
  }

  if (
    selectedGroups.includes("courses") &&
    courseSettings.selectedIds.length > 0
  ) {
    return { targetType: "COURSE", targetIds: courseSettings.selectedIds };
  }

  const ROLE_MAP: Record<string, string> = {
    staff: "STAFF",
    lecturers: "LECTURER",
    students: "STUDENT",
    referral_agents: "REFERRAL_AGENT",
  };

  const roleGroups = selectedGroups.filter((g) =>
    ["staff", "lecturers", "students", "referral_agents"].includes(g),
  );

  const specificIds: string[] = [];
  const roles: string[] = [];

  for (const group of roleGroups) {
    const settings = roleSettings[group as keyof typeof roleSettings];

    if (settings.mode === "specific") {
      specificIds.push(...settings.specificIds);
    } else {
      roles.push(ROLE_MAP[group]);
    }
  }

  if (specificIds.length > 0) {
    return { targetType: "USER_IDS", targetIds: specificIds };
  }

  if (roles.length > 0) {
    return { targetType: "ROLE", targetIds: roles };
  }

  return { targetType: "ALL" };
}

export function AddNotificationPanel({
  isOpen,
  onClose,
}: AddNotificationPanelProps) {
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const { mutate: createNotification, isPending } = useCreateNotification();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
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
        courseSettings: {
          selectedIds: [],
          targetRoles: { students: true, lecturers: true, staff: true },
        },
        batchSettings: {
          selectedIds: [],
          targetRoles: { students: true, lecturers: true, staff: true },
        },
      },
      title: "",
      sendingOption: "IMMEDIATELY",
      scheduledDate: undefined,
      scheduledTime: undefined,
      message: "",
    },
  });

  const sendingOption = watch("sendingOption");
  const channels = watch("channels");

  useEffect(() => {
    if (isOpen) {
      reset();
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

  const onSubmit = (values: NotificationFormValues) => {
    let scheduledAt: string | undefined;

    if (
      values.sendingOption === "SCHEDULE" &&
      values.scheduledDate &&
      values.scheduledTime
    ) {
      const [h, m] = values.scheduledTime.split(":").map(Number);

      const dt = new Date(values.scheduledDate);

      dt.setHours(h, m, 0, 0);
      scheduledAt = dt.toISOString();
    }

    const { targetType, targetIds } = resolveTarget(
      values.recipients as RecipientSelection,
    );

    const dto: CreateNotificationDto = {
      title: values.title,
      body: values.message,
      channels: values.channels,
      targetType: targetType as NotificationTargetType,
      ...(targetIds && { targetIds }),
      ...(scheduledAt && { scheduledAt }),
    };

    createNotification(dto, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
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
                    New Notification
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
                <motion.div
                  variants={itemVariants}
                  className="flex-1 overflow-y-auto"
                >
                  <form
                    id="add-notification-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="px-6 py-6 custom-scrollbar"
                  >
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
                                onChange={(e) =>
                                  toggleChannel(ch.value, e.target.checked)
                                }
                                className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                              />
                              <span className="text-sm font-medium text-[#45556C] cursor-pointer">
                                {ch.label}
                              </span>
                            </label>
                          ))}
                        </div>
                        {errors.channels && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.channels.message}
                          </p>
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

                      {/* ── Notification Title ── */}
                      <div className="space-y-1">
                        <FieldLabel required>Notification Title</FieldLabel>
                        <Input
                          {...register("title")}
                          className={cn(
                            AUTH_INPUT.base,
                            AUTH_INPUT.placeholder,
                            errors.title && AUTH_INPUT.error,
                          )}
                          placeholder="eg: Welcome to new batch"
                        />
                        {errors.title && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.title.message}
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
                              {(["IMMEDIATELY", "SCHEDULE"] as const).map(
                                (opt) => (
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
                                      {opt === "IMMEDIATELY"
                                        ? "Send Immediately"
                                        : "Schedule for Later"}
                                    </span>
                                  </label>
                                ),
                              )}
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
                                          value={
                                            field.value
                                              ? format(
                                                  field.value,
                                                  "dd/MM/yyyy",
                                                )
                                              : ""
                                          }
                                          readOnly
                                          placeholder="Pick a date"
                                          className={cn(
                                            "flex-1 cursor-pointer bg-transparent px-3 py-2 text-sm outline-none pointer-events-none text-[#1D293D]",
                                            AUTH_INPUT.placeholder,
                                          )}
                                        />
                                      </div>
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className="w-auto p-0 z-[99999999]"
                                      align="start"
                                    >
                                      <DateRangeCalendar
                                        mode="single"
                                        startDate={field.value || null}
                                        endDate={null}
                                        minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                                        onDateChange={(start) =>
                                          field.onChange(start || undefined)
                                        }
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

                      {/* ── Message ── */}
                      <div className="space-y-1">
                        <FieldLabel required>Message</FieldLabel>
                        <Textarea
                          {...register("message")}
                          className={cn(
                            "min-h-[100px] resize-none text-[#1D293D] text-sm",
                            AUTH_INPUT.placeholder,
                            errors.message && AUTH_INPUT.error,
                          )}
                          placeholder="eg: Type your message here"
                        />
                        {errors.message && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.message.message}
                          </p>
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
                    className={BUTTON_STYLES.secondary.md}
                  >
                    Clear All
                  </Button>
                  <Button
                    type="submit"
                    form="add-notification-form"
                    disabled={isPending}
                    className={cn(BUTTON_STYLES.primary.full, "w-auto px-6")}
                  >
                    {isPending ? "Sending..." : "Create"}
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
