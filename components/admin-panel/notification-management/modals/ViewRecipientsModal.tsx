"use client";

import React from "react";

import Image from "next/image";

import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  motion,
  itemVariants,
} from "@/components/ui/dialog";

interface Recipient {
  id: string;
  name: string;
  avatar?: string;
}

interface ViewRecipientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Recipient[];
  category: string;
  totalCount: number;
}

export function ViewRecipientsModal({
  isOpen,
  onClose,
  recipients,
  category,
  totalCount,
}: ViewRecipientsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        animateChildren={true}
        className="flex max-h-[90vh] w-[95%] max-w-[440px] flex-col gap-4 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-4px_rgba(16,24,40,0.10),0_10px_15px_-3px_rgba(0,0,0,0.10)] [&>button]:hidden"
      >
        {/* ===== STATIC HEADER ===== */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4 shrink-0">
          {/* Title */}
          <div className="flex items-center justify-between">
            <DialogTitle className="flex-1 font-inter text-lg font-semibold leading-[30px] text-[#0F172B]">
              View Recipients
            </DialogTitle>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-slate-50"
            >
              <X className="h-4 w-4 text-[#64748B]" />
            </button>
          </div>

          {/* Separator */}
          <div className="border-b border-[#E2E8F0]" />

          {/* Selected Count */}
          <div className="text-sm font-normal leading-5 font-inter">
            <span className="text-[#90A1B9]">Selected </span>
            <span className="text-xs font-normal leading-4 text-[#F6339A]">{recipients.length}</span>
            <span className="text-[#90A1B9]">/{totalCount}</span>
          </div>

          {/* Category Chip (Matching FilterModal's selected chips) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center justify-center gap-1 rounded-[40px] bg-[#F1F5F9] px-3 py-1 text-sm font-medium leading-5 text-black shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
              {category}
            </span>
          </div>

          <div className="border-b border-[#CAD5E2]" />
        </motion.div>

        {/* ===== SCROLLABLE BODY ===== */}
        <motion.div variants={itemVariants} className="flex-1 overflow-y-auto custom-scrollbar pt-4">
          <div className="flex flex-col gap-1">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className="flex w-full min-w-[300px] items-center gap-2 rounded-md bg-transparent px-2 py-1.5 transition-colors hover:bg-slate-50"
              >
                <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-slate-200 aspect-square">
                  {recipient.avatar ? (
                    <Image
                      src={recipient.avatar}
                      alt={recipient.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#F1F5F9] text-[8px] font-semibold text-[#64748B]">
                      {recipient.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="font-inter text-[12px] font-normal leading-4 text-[#314158] overflow-hidden text-ellipsis whitespace-nowrap">
                  {recipient.name}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
