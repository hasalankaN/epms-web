"use client";

import React, { useState, useEffect } from "react";

import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  AUTH_TYPOGRAPHY,
  AUTH_INPUT,
  BUTTON_STYLES,
} from "@/lib/constants/theme";
import ImageUpload from "@/components/common/ImageUpload";
import { cn } from "@/lib/utils";

const albumSchema = z.object({
  name: z.string().min(1, "Album name is required."),
});

type AlbumFormValues = z.infer<typeof albumSchema>;

interface AddAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, thumbnail: string) => void;
}

export function AddAlbumModal({
  isOpen,
  onClose,
  onCreate,
}: AddAlbumModalProps) {
  const [thumbnail, setThumbnail] = useState("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty: formIsDirty },
  } = useForm<AlbumFormValues>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      name: "",
    },
  });

  const isDirty = formIsDirty || thumbnail !== "";

  useEffect(() => {
    if (isOpen) {
      reset({ name: "" });
      setThumbnail("");
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (values: AlbumFormValues) => {
    if (!thumbnail) return; // Optional: could handle via form state or error state if required
    onCreate(values.name, thumbnail);
    onClose();
  };

  const handleClearAll = () => {
    reset({ name: "" });
    setThumbnail("");
  };

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardModal(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseAttempt()}>
        <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[450px] flex-col gap-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] outline-none [&>button]:hidden">
          
          {/* ===== HEADER ===== */}
          <motion.div variants={itemVariants} className="flex items-center justify-between p-6 pb-4 shrink-0">
            <DialogTitle className="font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              Add New Album
            </DialogTitle>
            <button
              title="Close"
              onClick={handleCloseAttempt}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </motion.div>

          <div className="h-[1px] bg-[#E2E8F0] mx-6 shrink-0" />

          {/* ===== FORM ===== */}
          <motion.form
            id="album-form"
            onSubmit={handleSubmit(handleFormSubmit)}
            variants={itemVariants}
            className="flex-1 overflow-y-auto p-6 pt-4 custom-scrollbar flex flex-col gap-6"
          >
            {/* Album Name */}
            <div className="flex w-full flex-col gap-1.5">
              <Label className={AUTH_TYPOGRAPHY.label}>
                Album Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("name")}
                placeholder="Lorem Ipsum"
                className={cn(
                  AUTH_INPUT.base, 
                  AUTH_INPUT.placeholder,
                  errors.name && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Album Thumbnail */}
            <div className="flex w-full flex-col gap-1.5">
              <Label className={AUTH_TYPOGRAPHY.label}>
                Album Thumbnail <span className="text-red-500">*</span>
              </Label>
              <ImageUpload
                imageUrl={thumbnail}
                setImage={(url) => setThumbnail(url)}
                removeImage={() => setThumbnail("")}
                className="h-[180px] w-full"
                dropzoneClassName="h-full border-2 border-dashed border-[#E2E8F0] rounded-lg bg-transparent hover:bg-slate-50 transition-colors"
                showSupportedFormats={true}
                supportedFormats="Supported File format: png, jpeg, WebP"
                maxSize="(Max 10MB)"
              />
            </div>
          </motion.form>

          <div className="h-[1px] bg-[#E2E8F0] mx-6 shrink-0" />

          {/* ===== FOOTER ACTIONS ===== */}
          <motion.div variants={itemVariants} className="flex w-full items-center justify-end gap-3 p-6 shrink-0">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClearAll}
              className={cn(
                BUTTON_STYLES.secondary.md,
                "font-inter text-[14px] font-semibold text-[#0F172B] hover:bg-slate-100 bg-[#F1F5F9]"
              )}
            >
              Clear All
            </Button>
            <Button
              type="submit"
              form="album-form"
              disabled={!isDirty || !thumbnail}
              className={cn(
                BUTTON_STYLES.primary.md,
                "font-inter text-[14px] font-semibold text-white leading-5 px-6"
              )}
            >
              Create Album
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
