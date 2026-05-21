"use client";

import React, { useEffect, useState } from "react";

import { format } from "date-fns";
import { X, CalendarDays as CalendarIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import axios from "axios";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRangeCalendar } from "@/components/common/filters/DateRangeCalendar";
import { TimePicker } from "@/components/common/TimePicker";
import {
  RecipientSelector,
  type RecipientSelection,
  type TargetGroupType,
} from "./RecipientSelector";
import api from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/api/api-endpoints";
import type { LookupType } from "@/hooks/api/lookup/useGetLookup";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { useUpdateScheduledNotification } from "@/hooks/api/notifications/useUpdateScheduledNotification";
import type {
  NotificationSchedule,
  UpdateNotificationDto,
  NotificationTargetType,
} from "@/types/notifications";

import { cn } from "@/lib/utils";
import {
  AUTH_TYPOGRAPHY,
  AUTH_INPUT,
  BUTTON_STYLES,
} from "@/lib/constants/theme";

// ===== SCHEMA =====

const editNotificationSchema = z.object({
  channels: z
    .array(z.enum(["PUSH", "SMS", "EMAIL"]))
    .min(1, "Select at least one channel."),
  recipients: z.any().refine((v) => v?.selectedGroups?.length > 0, {
    message: "Select at least one recipient group.",
  }),
  title: z.string().min(1, "Notification title is required."),
  scheduledDate: z.date({ required_error: "Date is required." }),
  scheduledTime: z.string().min(1, "Time is required."),
  message: z.string().min(1, "Message is required."),
});

type EditNotificationFormValues = z.infer<typeof editNotificationSchema>;

// ===== PROPS =====

interface EditNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: NotificationSchedule | null;
}

// ===== HELPERS =====

const CHANNELS: Array<{ value: "PUSH" | "SMS" | "EMAIL"; label: string }> = [
  { value: "PUSH", label: "Push Notification" },
  { value: "SMS", label: "SMS" },
  { value: "EMAIL", label: "Email" },
];

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

// Build a default RecipientSelection from API target_type + target_ids
function buildRecipientSelection(
  targetType: NotificationTargetType,
  targetIds: string[] | null,
): RecipientSelection {
  const base: RecipientSelection = {
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
  };

  if (targetType === "BATCH") {
    base.selectedGroups = ["batches"];
    base.batchSettings.selectedIds = targetIds ?? [];
  } else if (targetType === "COURSE") {
    base.selectedGroups = ["courses"];
    base.courseSettings.selectedIds = targetIds ?? [];
  } else if (targetType === "ROLE") {
    const ROLE_TO_GROUP: Record<string, keyof typeof base.roleSettings> = {
      STAFF: "staff",
      LECTURER: "lecturers",
      STUDENT: "students",
      REFERRAL_AGENT: "referral_agents",
    };

    base.selectedGroups = (targetIds ?? [])
      .map((r) => ROLE_TO_GROUP[r])
      .filter(Boolean) as any;
  } else if (targetType === "USER_IDS") {
    base.selectedGroups = ["students"];
    base.roleSettings.students = {
      mode: "specific",
      specificIds: targetIds ?? [],
    };
  } else {
    // ALL — select all role groups, mode "all"
    base.selectedGroups = ["staff", "lecturers", "students", "referral_agents"];
  }

  return base;
}

// Convert RecipientSelection → targetType / targetIds
function resolveTarget(
  recipients: RecipientSelection,
): Pick<UpdateNotificationDto, "targetType" | "targetIds"> {
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

// ===== COMPONENT =====

export function EditNotificationModal({
  isOpen,
  onClose,
  notification,
}: EditNotificationModalProps) {
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [resolvedRecipients, setResolvedRecipients] = useState<{ group: TargetGroupType; items: any[] } | null>(null);

  useEffect(() => {
    if (isOpen && notification && notification.target_ids && notification.target_ids.length > 0) {
      const targetIds = notification.target_ids;

      const fetchResolved = async () => {
        try {
          let group: TargetGroupType | null = null;
          let lookupType: LookupType | null = null;

          if (notification.target_type === "BATCH") {
            group = "batches";
            lookupType = "BATCH";
          } else if (notification.target_type === "COURSE") {
            group = "courses";
            lookupType = "COURSE";
          } else if (notification.target_type === "USER_IDS") {
            group = "students";
            lookupType = "STUDENT";
          }

          if (!group || !lookupType) return;

          const { getSession } = await import("@/lib/authentication");
          const session = await getSession();
          
          const silentApi = axios.create({
            baseURL: api.defaults.baseURL,
          });

          if (session?.tokens?.accessToken) {
            silentApi.defaults.headers.common["Authorization"] = `Bearer ${session.tokens.accessToken}`;
          }

          const promises = targetIds.map(async (id) => {
            try {
              if (lookupType === "BATCH") {
                const res = await silentApi.get(API_ENDPOINTS.batches.GET_BY_ID(id));
                const name = res.data?.data?.name;
                
                return { value: id, label: name || id };
              } else if (lookupType === "COURSE") {
                const res = await silentApi.get(API_ENDPOINTS.courses.GET_BY_ID(id));
                const detail = res.data?.data?.data || res.data?.data;
                const name = detail?.general_details?.name;

                return { value: id, label: name || id };
              } else if (lookupType === "STUDENT") {
                let name: string | null = null;
                
                // Try student
                try {
                  const res = await silentApi.get(API_ENDPOINTS.adminStudents.GET_BY_ID(id));

                  name = res.data?.data?.profile?.full_name;
                } catch {
                  // Not a student, try staff
                  try {
                    const res = await silentApi.get(API_ENDPOINTS.staff.GET_BY_ID(id));
                    const p = res.data?.data?.profile;

                    if (p) name = `${p.first_name} ${p.last_name || ''}`;
                  } catch {
                    // Not staff, try lecturer
                    try {
                      const res = await silentApi.get(API_ENDPOINTS.lecturers.GET_BY_ID(id));
                      const p = res.data?.data?.profile;

                      if (p) name = `${p.first_name} ${p.last_name || ''}`;
                    } catch {
                      // Not lecturer, try referral agent
                      try {
                        const res = await silentApi.get(API_ENDPOINTS.referrals.GET_SUMMARY(id));
                        const p = res.data?.data?.profile;

                        if (p) name = p.name || `${p.first_name} ${p.last_name || ''}`;
                      } catch {
                        console.error(`ID ${id} not found in any user group`);
                      }
                    }
                  }
                }

                return { value: id, label: name?.trim() || id };
              }
            } catch (error) {
              console.error(`Failed to fetch details for ${id}`, error);
            }
            
            return { value: id, label: id };
          });

          const items = await Promise.all(promises);

          console.log("RESOLVED RECIPIENTS DEBUG:" + JSON.stringify({ group, items }));
          setResolvedRecipients({ group, items: items.filter(Boolean) });
        } catch (e) {
          console.error("Failed to resolve recipients", e);
        }
      };

      fetchResolved();
    } else {
      setResolvedRecipients(null);
    }
  }, [isOpen, notification]);

  const { mutate: updateNotification, isPending } =
    useUpdateScheduledNotification();

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
      scheduledDate: undefined,
      scheduledTime: "",
      message: "",
    },
  });

  const channels = watch("channels");

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen && notification) {
      const scheduledDate = notification.scheduled_at
        ? new Date(notification.scheduled_at)
        : new Date();

      const scheduledTime = notification.scheduled_at
        ? format(new Date(notification.scheduled_at), "HH:mm")
        : "";

      reset({
        channels: notification.channels as ("PUSH" | "SMS" | "EMAIL")[],
        recipients: buildRecipientSelection(
          notification.target_type,
          notification.target_ids,
        ),
        title: notification.title,
        scheduledDate,
        scheduledTime,
        message: notification.body,
      });
    }
  }, [isOpen, notification, reset]);

  const toggleChannel = (ch: "PUSH" | "SMS" | "EMAIL", checked: boolean) => {
    const current = channels || [];

    setValue(
      "channels",
      checked ? [...current, ch] : current.filter((c) => c !== ch),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const onSubmit = (values: EditNotificationFormValues) => {
    if (!notification) return;

    const [h, m] = values.scheduledTime.split(":").map(Number);
    const dt = new Date(values.scheduledDate);

    dt.setHours(h, m, 0, 0);

    const { targetType, targetIds } = resolveTarget(
      values.recipients as RecipientSelection,
    );

    const dto: UpdateNotificationDto = {
      title: values.title,
      body: values.message,
      channels: values.channels,
      targetType: targetType as NotificationTargetType,
      ...(targetIds && { targetIds }),
      scheduledAt: dt.toISOString(),
    };

    updateNotification({ id: notification.id, dto }, { onSuccess: onClose });
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => !open && handleCloseAttempt()}
      >
        <DialogContent
          animateChildren={true}
          className="flex max-h-[90vh] w-[95%] max-w-[720px] flex-col gap-0 overflow-hidden rounded-lg sm:rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
        >
          {/* HEADER */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 p-5 sm:p-6 pb-4 shrink-0"
          >
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

          {/* BODY */}
          <motion.form
            key={notification?.id}
            variants={itemVariants}
            id="edit-notification-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto px-5 sm:px-6 pb-2 custom-scrollbar"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {/* LEFT COLUMN */}
              <div className="flex flex-col gap-5">
                {/* Channel */}
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

                {/* Recipients */}
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
                          initialResolvedOptions={resolvedRecipients}
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

                {/* Schedule Date + Time */}
                <div className="flex flex-col gap-4">
                  <div className="space-y-1">
                    <FieldLabel required>Scheduled Date</FieldLabel>
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
                                    ? format(field.value, "dd/MM/yyyy")
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
                    {errors.scheduledDate && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.scheduledDate.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <FieldLabel required>Scheduled Time</FieldLabel>
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
                    {errors.scheduledTime && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.scheduledTime.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div className="flex flex-col gap-5 h-full">
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

                <div className="flex flex-col flex-1 space-y-1">
                  <FieldLabel required>Message</FieldLabel>
                  <Textarea
                    {...register("message")}
                    className={cn(
                      "flex-1 min-h-[200px] resize-none text-[#1D293D] text-sm",
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
            </div>
          </motion.form>

          {/* FOOTER */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-end gap-3 p-5 sm:p-6 pt-5 border-t border-[#E2E8F0] shrink-0 mt-4"
          >
            <Button
              type="submit"
              form="edit-notification-form"
              disabled={isPending || isSubmitting || !isDirty}
              className={cn(
                BUTTON_STYLES.primary.full,
                "w-auto px-6 font-inter text-[14px] font-semibold text-white leading-5",
              )}
            >
              {isPending ? "Saving..." : "Update"}
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
