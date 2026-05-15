import React from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BUTTON_STYLES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isDeleting?: boolean;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "destructive" | "primary";

  /** When true, cancel button becomes primary (pink) and confirm becomes secondary */
  cancelAsPrimary?: boolean;

  /** When true, shows a mandatory reason textarea before confirming */
  requiresReason?: boolean;
  reason?: string;
  onReasonChange?: (reason: string) => void;
  reasonPlaceholder?: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this enquiry? This action cannot be undone.",
  isDeleting = false,
  confirmText = "Confirm Delete",
  cancelText = "Go Back",
  confirmVariant = "destructive",
  cancelAsPrimary = false,
  requiresReason = false,
  reason = "",
  onReasonChange,
  reasonPlaceholder = "Enter a reason (required)...",
}: DeleteConfirmationModalProps) {
  const isConfirmDisabled =
    isDeleting || (requiresReason && reason.trim().length < 5);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex w-[95%] max-w-[451px] flex-col items-start gap-4 rounded-[8px] border border-[#E4E4E7] bg-white p-4 sm:p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] sm:rounded-[8px] outline-none [&>button]:hidden">
        <div className="flex flex-col items-start gap-2 self-stretch">
          <DialogTitle className="self-stretch font-inter text-[18px] font-semibold leading-[30px] text-[#0F172B]">
            {title}
          </DialogTitle>
          <p className="self-stretch font-inter text-[14px] font-normal leading-[20px] text-[#62748E]">
            {description}
          </p>
        </div>

        {requiresReason && (
          <div className="w-full">
            <Textarea
              value={reason}
              onChange={(e) => onReasonChange?.(e.target.value)}
              placeholder={reasonPlaceholder}
              rows={3}
              className="w-full resize-none border border-[#E2E8F0] text-[13px] text-[#0F172B] placeholder:text-[#90A1B9] focus-visible:ring-1 focus-visible:ring-[#E60076]"
            />
            {reason.trim().length > 0 && reason.trim().length < 5 && (
              <p className="mt-1 text-[12px] text-red-500">
                Reason must be at least 5 characters.
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={cancelAsPrimary ? onConfirm : onClose}
            disabled={isDeleting}
            className={cn(
              "flex-1 justify-center whitespace-nowrap",
              BUTTON_STYLES.secondary.md,
              "text-[14px] font-semibold leading-[20px] text-[#0F172B] bg-[#F1F5F9] hover:bg-[#E2E8F0]",
            )}
          >
            {cancelAsPrimary ? confirmText : cancelText}
          </button>
          <button
            onClick={cancelAsPrimary ? onClose : onConfirm}
            disabled={isConfirmDisabled}
            className={cn(
              "flex h-[40px] flex-[1_0_0] items-center justify-center gap-2 rounded-[6px] px-4 py-2 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]",
              "whitespace-nowrap text-[14px] font-semibold leading-[20px] text-white disabled:opacity-50",
              cancelAsPrimary
                ? "bg-[#E60076] hover:bg-[#F6339A]"
                : confirmVariant === "destructive"
                  ? "bg-[#FB2C36] hover:bg-[#D9262E]"
                  : "bg-[#E60076] hover:bg-[#F6339A]",
            )}
          >
            {cancelAsPrimary
              ? cancelText
              : isDeleting
                ? "Processing..."
                : confirmText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
