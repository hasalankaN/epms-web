"use client";

import React from "react";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, MoreHorizontal } from "lucide-react";

import { ChatAvatar } from "./ChatAvatar";
import type { ChatContact } from "./types";

interface ChatHeaderProps {
  contact: ChatContact;
  onBack?: () => void;
}

export function ChatHeader({ contact, onBack }: ChatHeaderProps) {
  return (
    <div className="flex h-[80px] md:h-[96px] shrink-0 items-center justify-between border-b border-[#E2E8F0] px-4 md:px-[24px] py-[16px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={contact.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="flex flex-1 items-center justify-between min-w-0"
        >
          <div className="flex items-center gap-3 md:gap-[16px] min-w-0">
            <button
              onClick={onBack}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-[#E2E8F0] bg-transparent shadow-sm transition-colors hover:bg-[#F1F5F9] md:hidden"
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5 text-[#314158]" />
            </button>

            <ChatAvatar
              name={contact.name}
              avatar={contact.avatar}
              size={40}
              className="md:hidden"
              online={contact.isOnline}
            />
            <ChatAvatar
              name={contact.name}
              avatar={contact.avatar}
              size={48}
              className="hidden md:block"
              online={contact.isOnline}
            />

            <div className="flex flex-col justify-center min-w-0">
              <span className="truncate font-inter text-[15px] md:text-[16px] font-semibold leading-tight md:leading-[24px] text-[#0F172B]">
                {contact.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-inter text-[11px] md:text-[12px] font-normal leading-tight md:leading-[16px] text-[#62748E]">
                  Student
                </span>
                <span className="md:hidden font-inter text-[10px] text-[#90A1B9] before:content-['•'] before:mr-2">
                  Last seen recently
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-[24px] shrink-0">
            <div className="hidden md:flex items-center justify-center gap-[4px] rounded-[40px] bg-[#F1F5F9] px-[12px] py-[4px] shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]">
              <span className="font-inter text-[13px] md:text-[14px] font-medium leading-normal text-black whitespace-nowrap">
                Last seen recently
              </span>
            </div>
            <button aria-label="More options" className="p-1">
              <MoreHorizontal className="h-5 w-5 md:h-6 md:w-6 text-[#314158]" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
