"use client";

import React, { useRef, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";



import { cn } from "@/lib/utils";

import { ReceivedBubble, SentBubble } from "./MessageBubbles";
import { ChatHeader } from "./ChatHeader";
import { ChatFooter } from "./ChatFooter";
import type { ChatContact, ChatGroup } from "./types";

interface ChatWindowProps {
  contact: ChatContact | null;
  groups: ChatGroup[];
  onBack?: () => void;
  onSendMessage?: (text: string, attachment?: any) => void;
  onToggleMute?: (id: string) => void;
}

export function ChatWindow({ contact, groups, onBack, onSendMessage, onToggleMute }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [groups]);

  if (!contact) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-white p-6 relative">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeIn" }}
          className="flex w-full max-w-[486px] flex-col items-center gap-[16px]"
        >
          <div className="flex h-[96px] w-[96px] items-center justify-center text-[#90A1B9]">
            <i className="chat-text" style={{ width: 96, height: 96 }} />
          </div>
          <div className="flex flex-col items-center self-stretch text-center">
            <p className="font-inter text-[14px] font-medium leading-[20px] text-[#90A1B9]">
              Important updates from the registrar or Lecturers, <br />
              Inquires from students will be delivered here. <br />
              You&apos;re currently all caught up.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-r-[8px] bg-white">
      <ChatHeader 
        contact={contact} 
        onBack={onBack} 
      />

      {/* ===== MESSAGE AREA ===== */}
      <div className="flex flex-1 flex-col gap-[16px] overflow-y-auto px-[24px] py-[16px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={contact.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-[16px]"
          >
            {groups.map((group) => (
              <div key={group.date} className="flex flex-col gap-[12px]">
                {/* Date indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="sticky top-0 z-10 flex justify-center py-2"
                >
                  <div className="flex items-center justify-center gap-[10px] rounded-[30px] border border-white/20 bg-white/40 backdrop-blur-xl px-[16px] py-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)] ring-1 ring-black/5">
                    <span className="font-inter text-center text-[12px] font-semibold uppercase tracking-wider text-[#303030]/80">
                      {group.date}
                    </span>
                  </div>
                </motion.div>

                {/* Messages */}
                <div className="flex flex-col gap-[12px]">
                  {group.messages.map((msg, idx) => {
                    const prevMsg = group.messages[idx - 1];

                    const isSameSenderAndTime =
                      prevMsg &&
                      prevMsg.type === msg.type &&
                      prevMsg.time === msg.time;

                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, x: msg.type === "sent" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(isSameSenderAndTime ? "-mt-[8px]" : "")}
                      >
                        {msg.type === "received" ? (
                          <ReceivedBubble
                            msg={msg}
                            avatar={contact.avatar}
                            contactName={contact.name}
                            hideHeader={isSameSenderAndTime}
                          />
                        ) : (
                          <SentBubble
                            msg={msg}
                            hideHeader={isSameSenderAndTime}
                          />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <ChatFooter 
        onSendMessage={onSendMessage ?? (() => {})} 
        isMuted={contact.isMuted}
        onToggleMute={() => onToggleMute?.(contact.id)}
      />
    </div>
  );
}
