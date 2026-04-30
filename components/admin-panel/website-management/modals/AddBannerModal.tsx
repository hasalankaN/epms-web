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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  AUTH_TYPOGRAPHY,
  AUTH_INPUT,
  BUTTON_STYLES,
} from "@/lib/constants/theme";
import ImageUpload from "@/components/common/ImageUpload";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";

const bannerSchema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  paragraph: z.string().optional(),
  enableButtons: z.boolean(),
  numberOfButtons: z.number().min(1).max(2),
  button1Text: z.string().optional(),
  button1Link: z.string().optional(),
  button2Text: z.string().optional(),
  button2Link: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.enableButtons) {
    if (!data.button1Text) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Button text is required.", path: ["button1Text"] });
    }

    if (!data.button1Link) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Button link is required.", path: ["button1Link"] });
    }

    if (data.numberOfButtons === 2) {
      if (!data.button2Text) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Button text is required.", path: ["button2Text"] });
      }

      if (!data.button2Link) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Button link is required.", path: ["button2Link"] });
      }
    }
  }
});

type BannerFormValues = z.infer<typeof bannerSchema>;

interface AddBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddBannerModal({ isOpen, onClose }: AddBannerModalProps) {
  const [desktopImageUrl, setDesktopImageUrl] = useState("");
  const [mobileImageUrl, setMobileImageUrl] = useState("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty: formIsDirty },
  } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      subTitle: "",
      paragraph: "",
      enableButtons: true,
      numberOfButtons: 2,
      button1Text: "",
      button1Link: "",
      button2Text: "",
      button2Link: "",
    },
  });

  const enableButtons = watch("enableButtons");
  const numberOfButtons = watch("numberOfButtons");

  const isDirty = formIsDirty || desktopImageUrl !== "" || mobileImageUrl !== "";

  useEffect(() => {
    if (isOpen) {
      reset({
        title: "",
        subTitle: "",
        paragraph: "",
        enableButtons: true,
        numberOfButtons: 2,
        button1Text: "",
        button1Link: "",
        button2Text: "",
        button2Link: "",
      });
      setDesktopImageUrl("");
      setMobileImageUrl("");
    }
  }, [isOpen, reset]);

  const onSubmit = (values: BannerFormValues) => {
    if (!desktopImageUrl || !mobileImageUrl) return;
    console.log("Saving banner:", { ...values, desktopImageUrl, mobileImageUrl });
    onClose();
  };

  const handleClearAll = () => {
    reset({
      title: "",
      subTitle: "",
      paragraph: "",
      enableButtons: true,
      numberOfButtons: 2,
      button1Text: "",
      button1Link: "",
      button2Text: "",
      button2Link: "",
    });
    setDesktopImageUrl("");
    setMobileImageUrl("");
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
        <DialogContent
          animateChildren={true}
          className="flex max-h-[90vh] w-[95%] max-w-[704px] flex-col gap-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between p-6 pb-4 shrink-0">
            <DialogTitle className="font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              Add New Banner
            </DialogTitle>
            <button
              onClick={handleCloseAttempt}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </motion.div>

          <div className="h-[1px] bg-[#E2E8F0] mx-6 shrink-0" />

          {/* Body */}
          <motion.form
            id="banner-form"
            onSubmit={handleSubmit(onSubmit)}
            variants={itemVariants}
            className="flex-1 overflow-y-auto p-6 pt-4 custom-scrollbar"
          >
            <div className="flex flex-col gap-4">
              {/* Title */}
              <div className="space-y-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>Title</Label>
                <Input
                  {...register("title")}
                  placeholder="Enter title"
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                />
              </div>

              {/* Sub Title */}
              <div className="space-y-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>Sub Title</Label>
                <Input
                  {...register("subTitle")}
                  placeholder="Enter sub title"
                  className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                />
              </div>

              {/* Paragraph */}
              <div className="space-y-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>Paragraph</Label>
                <Textarea
                  {...register("paragraph")}
                  placeholder="Enter paragraph text"
                  rows={4}
                  className={cn(
                    "resize-y rounded-md border border-gray-300 text-sm focus-visible:ring-[#E60076]",
                    AUTH_INPUT.placeholder
                  )}
                />
              </div>

              {/* Desktop View & Mobile View */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label className={cn(AUTH_TYPOGRAPHY.label)}>
                    Desktop View <span className="text-red-500">*</span>
                  </Label>
                  <ImageUpload
                    imageUrl={desktopImageUrl}
                    setImage={(url) => setDesktopImageUrl(url)}
                    removeImage={() => setDesktopImageUrl("")}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className={cn(AUTH_TYPOGRAPHY.label)}>
                    Mobile View <span className="text-red-500">*</span>
                  </Label>
                  <ImageUpload
                    imageUrl={mobileImageUrl}
                    setImage={(url) => setMobileImageUrl(url)}
                    removeImage={() => setMobileImageUrl("")}
                  />
                </div>
              </div>

              {/* Buttons Configuration */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className={AUTH_TYPOGRAPHY.label}>Enable Buttons</Label>
                  <div className="flex items-center gap-4">
                    {["Yes", "No"].map((opt) => (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="add-modal-enable-buttons"
                          checked={enableButtons === (opt === "Yes")}
                          onChange={() => setValue("enableButtons", opt === "Yes", { shouldDirty: true })}
                          className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                        />
                        <span className="text-sm font-medium text-[#45556C]">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label className={AUTH_TYPOGRAPHY.label}>No. of Buttons</Label>
                  <div className="flex items-center gap-4">
                    {([1, 2] as const).map((num) => (
                      <label key={num} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="add-modal-no-of-buttons"
                          checked={numberOfButtons === num}
                          onChange={() => setValue("numberOfButtons", num, { shouldDirty: true })}
                          className="h-4 w-4 cursor-pointer accent-[#0F172B]"
                        />
                        <span className="text-sm font-medium text-[#45556C]">{num}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Button Fields */}
              {enableButtons && (
                <div className="flex flex-col gap-4">
                  {/* Button 1 */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className={AUTH_TYPOGRAPHY.label}>
                        Button 1 Text <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register("button1Text")}
                        placeholder="Enter button text"
                        className={cn(
                          AUTH_INPUT.base, 
                          AUTH_INPUT.placeholder,
                          errors.button1Text && "border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                      {errors.button1Text && <p className="text-xs text-red-500">{errors.button1Text.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label className={AUTH_TYPOGRAPHY.label}>
                        Button 1 Link <span className="text-red-500">*</span>
                      </Label>
                      <div className={cn(
                        "flex h-10 items-center rounded-md border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-[#E60076] transition-all overflow-hidden",
                        errors.button1Link && "border-red-500 focus-within:ring-red-500"
                      )}>
                        <span className="border-r border-gray-300 px-3 text-sm font-medium text-[#64748B] h-full flex items-center bg-[#F8FAFC]">
                          https://
                        </span>
                        <input
                          {...register("button1Link")}
                          placeholder="your-url.com/path"
                          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic w-full"
                        />
                      </div>
                      {errors.button1Link && <p className="text-xs text-red-500">{errors.button1Link.message}</p>}
                    </div>
                  </div>

                  {/* Button 2 */}
                  {numberOfButtons === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className={AUTH_TYPOGRAPHY.label}>
                          Button 2 Text <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          {...register("button2Text")}
                          placeholder="Enter button text"
                          className={cn(
                            AUTH_INPUT.base, 
                            AUTH_INPUT.placeholder,
                            errors.button2Text && "border-red-500 focus-visible:ring-red-500"
                          )}
                        />
                        {errors.button2Text && <p className="text-xs text-red-500">{errors.button2Text.message}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label className={AUTH_TYPOGRAPHY.label}>
                          Button 2 Link <span className="text-red-500">*</span>
                        </Label>
                        <div className={cn(
                          "flex h-10 items-center rounded-md border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-[#E60076] transition-all overflow-hidden",
                          errors.button2Link && "border-red-500 focus-within:ring-red-500"
                        )}>
                          <span className="border-r border-gray-300 px-3 text-sm font-medium text-[#64748B] h-full flex items-center bg-[#F8FAFC]">
                            https://
                          </span>
                          <input
                            {...register("button2Link")}
                            placeholder="your-url.com/path"
                            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[#90A1B9] placeholder:italic w-full"
                          />
                        </div>
                        {errors.button2Link && <p className="text-xs text-red-500">{errors.button2Link.message}</p>}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.form>

          {/* Footer */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-[#E2E8F0] shrink-0"
          >
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
              form="banner-form"
              disabled={!isDirty || !desktopImageUrl || !mobileImageUrl}
              className={cn(
                BUTTON_STYLES.primary.md,
                "font-inter text-[14px] font-semibold text-white leading-5 px-6"
              )}
            >
              Create Banner
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
