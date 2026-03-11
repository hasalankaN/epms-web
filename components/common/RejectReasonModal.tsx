import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { BUTTON_STYLES, AUTH_TYPOGRAPHY, AUTH_INPUT } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";

interface RejectReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  description: string;
}

export function RejectReasonModal({
  isOpen,
  onClose,
  onConfirm,
  description,
}: RejectReasonModalProps) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
    onClose();
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent 
        className="flex w-[95%] max-w-[451px] flex-col items-start gap-4 rounded-[8px] border border-[#E4E4E7] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] outline-none [&>button]:hidden"
      >
        <div className="flex flex-col items-start gap-2 self-stretch">
          <DialogTitle className="self-stretch font-inter text-[18px] font-semibold leading-[30px] text-[#0F172B]">
            Confirm Action
          </DialogTitle>
          <p className="self-stretch font-inter text-[14px] font-normal leading-[20px] text-[#62748E]">
            {description}
          </p>
        </div>

        <div className="flex flex-col items-start gap-1.5 self-stretch w-full">
          <label className={cn(AUTH_TYPOGRAPHY.label, "font-inter")}>
            Add Rejection Reason <span className={AUTH_TYPOGRAPHY.required}>*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="eg: Type your message here"
            className={cn(
               "flex min-h-[100px] w-full rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-sm text-[#0F172B] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E60076] disabled:cursor-not-allowed disabled:opacity-50 resize-none font-inter",
               AUTH_INPUT.placeholder
            )}
          />
        </div>

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={handleClose}
            className={cn(
                "flex-1 justify-center whitespace-nowrap",
                BUTTON_STYLES.secondary.md, 
                "text-[14px] font-semibold leading-[20px] text-[#0F172B] bg-[#F1F5F9] hover:bg-[#E2E8F0]"
            )}
          >
            Go Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className={cn(
              "flex h-[40px] flex-[1_0_0] items-center justify-center gap-2 rounded-[6px] px-4 py-2 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]",
              "whitespace-nowrap text-[14px] font-semibold leading-[20px] text-white disabled:opacity-50",
              "bg-[#FB2C36] hover:bg-[#D9262E]" 
            )}
          >
            Reject Payment
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
