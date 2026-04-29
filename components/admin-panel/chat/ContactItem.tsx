"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { ChatAvatar } from "./ChatAvatar";
import type { ChatContact } from "./types";

interface ContactItemProps {
  contact: ChatContact;
  isSelected: boolean;
  onClick: () => void;
}

export function ContactItem({
  contact,
  isSelected,
  onClick,
}: ContactItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex w-full flex-col justify-center items-start gap-[2px] rounded-[6px] px-[8px] pt-[8px] pb-[6px] text-left transition-colors",
        isSelected ? "bg-[#FDF2F8]" : "bg-transparent hover:bg-[#F8FAFC]"
      )}
    >
      {contact.unreadCount && contact.unreadCount > 0 ? (
        <span className="absolute top-[8px] right-[8px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#FB2C36] px-1 text-[10px] font-semibold leading-none text-white shadow-sm">
          {contact.unreadCount > 99 ? "99+" : contact.unreadCount}
        </span>
      ) : null}

      <div className="flex items-start gap-[8px] w-full">
        <div className="shrink-0 flex items-center justify-center" style={{ width: 36, height: 36 }}>
          <ChatAvatar name={contact.name} avatar={contact.avatar} size={36} online={contact.isOnline} />
        </div>

        <div className="flex flex-1 flex-col min-w-0">
          <span
            className="overflow-hidden text-ellipsis whitespace-nowrap font-inter text-[14px] font-medium leading-[20px] text-[#314158]"
            style={{ maxWidth: 140 }}
          >
            {contact.name}
          </span>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap font-inter text-[12px] font-normal leading-[16px] text-[#62748E]">
            {contact.lastMessage}
          </span>
        </div>
      </div>

      <div className="flex w-full justify-end mt-[2px]">
        <span className="overflow-hidden text-ellipsis font-inter text-[10px] font-normal leading-[16px] text-[#90A1B9]">
          {contact.time}
        </span>
      </div>
    </button>
  );
}
