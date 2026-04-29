"use client";

import React from "react";

import { CheckCheck, Download } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ChatMessage } from "./types";

// ===== FILE ICON HELPER =====

function FileIcon({ type }: { type: "pdf" | "image" | "doc" | "other" }) {
  const colors: Record<string, string> = {
    pdf: "bg-[#F43F5E]",
    image: "bg-[#6366F1]",
    doc: "bg-[#3B82F6]",
    other: "bg-[#6B7280]",
  };

  const labels: Record<string, string> = {
    pdf: "PDF",
    image: "IMG",
    doc: "DOC",
    other: "FILE",
  };

  return (
    <div
      className={cn(
        "flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded text-white",
        colors[type]
      )}
      style={{ fontSize: 8, fontWeight: 700 }}
    >
      {labels[type]}
    </div>
  );
}

// ===== RECEIVED BUBBLE =====

export function ReceivedBubble({
  msg,
  avatar,
  contactName,
  hideHeader = false,
}: {
  msg: ChatMessage;
  avatar?: string;
  contactName: string;
  hideHeader?: boolean;
}) {
  return (
    <div className="flex items-start gap-[8px]">
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full border border-[#D4D4D4] bg-[#F1F5F9] overflow-hidden transition-all h-[24px] w-[24px]",
          hideHeader ? "invisible" : "visible"
        )}
      >
        {avatar ? (
          <img src={avatar} alt={contactName} className="h-full w-full object-cover" />
        ) : (
          <i className="user-icon h-3.5 w-3.5 text-[#90A1B9]" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-[2px]">
        {!hideHeader && (
          <span className="font-inter text-[12px] font-normal leading-[16px] text-[#90A1B9]">
            {msg.time}
          </span>
        )}
        <div
          className={cn(
            "bg-[#EFEFEF] px-[16px] py-[8px] font-inter text-[14px] font-normal leading-[20px] text-[#0F172B]",
            hideHeader ? "rounded-[16px]" : "rounded-[0_16px_16px_16px]"
          )}
          style={{ maxWidth: 320 }}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
}

// ===== SENT BUBBLE =====

export function SentBubble({
  msg,
  hideHeader = false,
}: {
  msg: ChatMessage;
  hideHeader?: boolean;
}) {
  return (
    <div className="flex flex-col items-end gap-[4px]">
      {!hideHeader && (
        <div className="flex items-center gap-[8px]">
          <CheckCheck className="h-[16px] w-[16px] shrink-0 text-[#3B82F6]" />
          <span className="font-inter text-[12px] font-normal leading-[16px] text-[#90A1B9]">
            {msg.time}
          </span>
          <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[#0F172B] bg-[#F1F5F9] p-[4px]">
            <i className="user-icon text-[#0F172B]" style={{ width: 14.129, height: 14.129 }} />
          </div>
        </div>
      )}

      {msg.text && !msg.attachment && (
        <div
          className={cn(
            "bg-[#5D0EC0] px-[16px] py-[8px] font-inter text-[14px] font-normal leading-[20px] text-white",
            hideHeader ? "rounded-[16px]" : "rounded-[16px_0_16px_16px]"
          )}
          style={{ maxWidth: 320 }}
        >
          {msg.text}
        </div>
      )}

      {msg.attachment && (
        <div
          className={cn(
            "flex flex-col items-start gap-[4px] bg-[#5D0EC0] pb-[12px] pl-[13px] pr-[13px] pt-[8px] w-full max-w-[311px]",
            hideHeader ? "rounded-[16px]" : "rounded-[16px_0_16px_16px]"
          )}
        >
          {msg.text && (
            <span className="font-inter text-[14px] font-normal leading-[20px] text-white">
              {msg.text}
            </span>
          )}
          <div className="flex w-full items-center gap-[8px] rounded-[5px] bg-white p-[8px]">
            <FileIcon type={msg.attachment.fileType} />
            <div className="flex flex-1 flex-col min-w-0">
              <span className="self-stretch truncate font-inter text-[12px] font-normal leading-[20px] text-[#475569]">
                {msg.attachment.name}
              </span>
              <span className="font-poppins text-[10px] font-normal leading-[16px] text-[#94A3B8]">
                {msg.attachment.date} • {msg.attachment.size}
              </span>
            </div>
            <button
              aria-label="Download"
              className="flex shrink-0 cursor-pointer items-center justify-center"
              onClick={() => console.log("Download")}
            >
              <Download
                className="text-[#0A2689]"
                style={{ width: 20, height: 20, strokeWidth: 2 }}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
