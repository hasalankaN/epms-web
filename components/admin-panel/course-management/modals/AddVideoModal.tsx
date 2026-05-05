import React, { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AUTH_TYPOGRAPHY, AUTH_INPUT, BUTTON_STYLES } from "@/lib/constants/theme";

const videoSchema = z.object({
  youtubeLink: z.string().min(1, "YouTube link is required").url("Must be a valid URL"),
  title: z.string().min(1, "Title is required"),
});

type VideoValues = z.infer<typeof videoSchema>;

interface AddVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VideoValues) => void;
  initialData?: VideoValues | null;
}

export function AddVideoModal({ isOpen, onClose, onSave, initialData }: AddVideoModalProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<VideoValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      youtubeLink: "",
      title: "",
    },
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setValue("youtubeLink", initialData.youtubeLink);
      setValue("title", initialData.title);
    } else if (isOpen && !initialData) {
      reset({ youtubeLink: "", title: "" });
    }
  }, [isOpen, initialData, setValue, reset]);

  const onSubmit = (data: VideoValues) => {
    onSave(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="flex w-full max-w-[480px] flex-col items-start gap-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden">
        {/* ===== HEADER ===== */}
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold leading-7 text-[#0F172B]">
              {isEditing ? "Edit Video" : "Add New Video"}
            </DialogTitle>
            <button
              title="Close"
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-sm transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>
          <div className="border-b border-[#E2E8F0]" />
        </div>

        {/* ===== BODY ===== */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col gap-1.5">
            <Label className={cn(AUTH_TYPOGRAPHY.label)}>
              YouTube Link <span className="text-[#E60076]">*</span>
            </Label>
            <Input
              {...register("youtubeLink")}
              placeholder="eg: https:// Youtube.com"
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                errors.youtubeLink && AUTH_INPUT.error
              )}
            />
            {errors.youtubeLink && (
              <p className="text-xs text-red-500">{errors.youtubeLink.message}</p>
            )}
          </div>

          <div className="flex w-full flex-col gap-1.5">
            <Label className={cn(AUTH_TYPOGRAPHY.label)}>
              Title <span className="text-[#E60076]">*</span>
            </Label>
            <Input
              {...register("title")}
              placeholder="eg: lorem ipsum"
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                errors.title && AUTH_INPUT.error
              )}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* ===== FOOTER ===== */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              className={cn(BUTTON_STYLES.primary.full, "w-auto px-6")}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
