"use client";

import React, { useState, useEffect } from "react";

import { X } from "lucide-react";

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
import {
  AUTH_TYPOGRAPHY,
  AUTH_INPUT,
  BUTTON_STYLES,
} from "@/lib/constants/theme";
import { cn } from "@/lib/utils";

interface AddEditTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { studentName: string; content: string }) => void;
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
  const [studentName, setStudentName] = useState("");
  const [content, setContent] = useState("");

  const isEdit = !!initialData;

  // Reset or set initial data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setStudentName(initialData.studentName);
        setContent(initialData.content);
      } else {
        setStudentName("");
        setContent("");
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = () => {
    if (!studentName || !content) return;
    onSubmit({ studentName, content });
    onClose();
  };

  const handleClearAll = () => {
    setStudentName("");
    setContent("");
  };

  const isDirty = isEdit 
    ? studentName !== initialData?.studentName || content !== initialData?.content
    : !!studentName && !!content;

  const isSubmitDisabled = isEdit ? !isDirty : !studentName || !content;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] w-[95%] max-w-[450px] flex-col gap-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-0 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] outline-none [&>button]:hidden">
        
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
          className="flex flex-col gap-0"
        >
          {/* ===== HEADER ===== */}
          <motion.div variants={itemVariants} className="flex items-center justify-between p-6 pb-4 shrink-0">
            <DialogTitle className="font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              {isEdit ? "Edit Testimonial" : "Add New Testimonial"}
            </DialogTitle>
            <button
              title="Close"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-white transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </motion.div>

          <div className="h-[1px] bg-[#E2E8F0] mx-6" />

          {/* ===== FORM ===== */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6 p-6 pt-4">
            
            <div className="flex flex-col gap-4">
                {/* Student Name */}
                <div className="flex w-full flex-col gap-1.5">
                    <Label className={AUTH_TYPOGRAPHY.label}>
                      Student Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        placeholder="Lorem Ipsum"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className={cn(AUTH_INPUT.base, AUTH_INPUT.placeholder)}
                    />
                </div>

                {/* Content */}
                <div className="flex w-full flex-col gap-1.5">
                    <Label className={AUTH_TYPOGRAPHY.label}>
                      Content <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        placeholder="eg: Type your message here"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className={cn(
                          "resize-y rounded-md border border-gray-300 text-sm focus-visible:ring-[#E60076]",
                          AUTH_INPUT.placeholder
                        )}
                    />
                </div>
            </div>

            {/* ===== FOOTER ACTIONS ===== */}
            <div className="flex w-full items-center justify-end gap-3 pt-2">
              <Button
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
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className={cn(
                  BUTTON_STYLES.primary.md,
                  "font-inter text-[14px] font-semibold text-white leading-5 px-6"
                )}
              >
                {isEdit ? "Update" : "Create"}
              </Button>
            </div>

          </motion.div>
        </motion.div>

      </DialogContent>
    </Dialog>
  );
}
