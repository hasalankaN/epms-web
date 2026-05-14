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
import { Textarea } from "@/components/ui/textarea";
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import {
  AUTH_TYPOGRAPHY,
  AUTH_INPUT,
  BUTTON_STYLES,
} from "@/lib/constants/theme";
import { cn } from "@/lib/utils";

const testimonialSchema = z.object({
  studentName: z.string().min(1, "Student name is required."),
  content: z.string().min(1, "Content is required."),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

interface AddEditTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TestimonialFormValues) => void;
  initialData?: {
    studentName: string;
    content: string;
  } | null;
}

export function AddEditTestimonialModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddEditTestimonialModalProps) {
  const isEdit = !!initialData;
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      studentName: "",
      content: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          studentName: initialData.studentName,
          content: initialData.content,
        });
      } else {
        reset({
          studentName: "",
          content: "",
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = (values: TestimonialFormValues) => {
    onSubmit(values);
    onClose();
  };

  const handleClearAll = () => {
    reset({
      studentName: "",
      content: "",
    });
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
              {isEdit ? "Edit Testimonial" : "Add New Testimonial"}
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
            id="testimonial-form"
            onSubmit={handleSubmit(handleFormSubmit)}
            variants={itemVariants}
            className="flex-1 overflow-y-auto p-6 pt-4 custom-scrollbar flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              {/* Student Name */}
              <div className="flex w-full flex-col gap-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>
                  Student Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("studentName")}
                  placeholder="Lorem Ipsum"
                  className={cn(
                    AUTH_INPUT.base, 
                    AUTH_INPUT.placeholder,
                    errors.studentName && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {errors.studentName && (
                  <p className="text-xs text-red-500">{errors.studentName.message}</p>
                )}
              </div>

              {/* Content */}
              <div className="flex w-full flex-col gap-1.5">
                <Label className={AUTH_TYPOGRAPHY.label}>
                  Content <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  {...register("content")}
                  placeholder="eg: Type your message here"
                  rows={4}
                  className={cn(
                    "resize-y rounded-md border border-[#E4E4E7] text-sm focus-visible:ring-[#E60076]",
                    AUTH_INPUT.placeholder,
                    errors.content && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {errors.content && (
                  <p className="text-xs text-red-500">{errors.content.message}</p>
                )}
              </div>
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
              form="testimonial-form"
              disabled={!isDirty}
              className={cn(
                BUTTON_STYLES.primary.md,
                "font-inter text-[14px] font-semibold text-white leading-5 px-6"
              )}
            >
              {isEdit ? "Update" : "Create"}
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
