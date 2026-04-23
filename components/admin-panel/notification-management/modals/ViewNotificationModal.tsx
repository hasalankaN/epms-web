"use client";

import React from "react";

import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";

interface ViewNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: {
    title: string;
    message: string;
  } | null;
}

export function ViewNotificationModal({
  isOpen,
  onClose,
  notification,
}: ViewNotificationModalProps) {
  if (!notification) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        animateChildren={true}
        className="flex max-h-[90vh] w-[95%] max-w-[704px] flex-col gap-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
      >
        {/* ===== STATIC HEADER ===== */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              View Notification
            </DialogTitle>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>

          <div className="border-b border-[#E2E8F0] mb-4" />
        </motion.div>

        {/* ===== BODY ===== */}
        <motion.div variants={itemVariants} className="flex flex-col gap-2 pt-0 overflow-y-auto custom-scrollbar">
          <h4 className="font-inter text-sm font-semibold leading-5 text-[#1D293D] self-stretch">
            {notification.title}
          </h4>
          <p className="font-inter text-sm font-normal leading-5 text-[#62748E] whitespace-pre-wrap">
            {notification.message}
          </p>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
