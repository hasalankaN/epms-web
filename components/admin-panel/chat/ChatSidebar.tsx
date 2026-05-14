"use client";

import React, { useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { AUTH_INPUT } from "@/lib/constants/theme";
import { Input } from "@/components/ui/input";
import { ContactItem } from "./ContactItem";
import type { ChatContact } from "./types";

type FilterTab = "all" | "unread" | "muted";

interface ChatSidebarProps {
  contacts: ChatContact[];
  selectedId: string | null;
  onSelectContact: (id: string) => void;
  onNewChat?: () => void;
  unreadTotal?: number;
}

export function ChatSidebar({
  contacts,
  selectedId,
  onSelectContact,
  onNewChat,
  unreadTotal = 0,
}: ChatSidebarProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase());

    if (activeFilter === "unread") return matchesSearch && (c.unreadCount ?? 0) > 0;
    if (activeFilter === "muted") return matchesSearch;
    
    return matchesSearch;
  });

  const filters: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "muted", label: "Muted" },
  ];

  return (
    <div className="flex h-full w-full flex-col border-r border-[#E2E8F0] bg-white shadow-[3px_5px_12px_2px_rgba(0,0,0,0.05)] md:w-[320px] md:shrink-0">
      <div className="flex flex-1 flex-col overflow-hidden p-[12px] pt-[16px]">
        <div className="flex flex-col h-[79px]"> {/* 95 - 16 padding = 79 */}
          {/* Search bar */}
          <div className="relative h-[36px] w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#90A1B9]" />
            <Input
              type="text"
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                AUTH_INPUT.base,
                AUTH_INPUT.placeholder,
                "h-[36px] w-full border border-[#E2E8F0] pl-9 pr-3 text-[13px]"
              )}
            />
          </div>

          {/* Filter chips */}
          <div className="mt-[8px] flex w-full items-center gap-[8px]">
            {filters.map((f) => {
              const isActive = activeFilter === f.key;

              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={cn(
                    "flex flex-1 h-[28px] items-center justify-center gap-[6px] rounded-[42px] px-[4px] py-[8px] font-inter text-[12px] font-medium leading-[16px] transition-colors",
                    isActive
                      ? "border-[0.5px] border-[#EC4899] bg-gradient-to-br from-[#FFCFEA] to-[#F8FAFC] text-[#F6339A] shadow-[4px_4px_10px_0_rgba(2,17,36,0.05)]"
                      : "border-[0.5px] border-[#E2E8F0] bg-transparent text-[#45556C] hover:bg-[#F8FAFC]"
                  )}
                >
                  {f.label}
                  {f.key === "unread" && unreadTotal > 0 && (
                    <span className="flex h-[13px] w-[13px] items-center justify-center rounded-full bg-[#FB2C36] text-[9px] font-semibold text-white">
                      {unreadTotal > 9 ? "9+" : unreadTotal}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Separator */}
        <div className="h-[1px] w-full bg-[#E2E8F0]" />

        {/* Contact list */}
        <div className="mt-[12px] flex flex-1 flex-col gap-[4px] overflow-y-auto">
          {filteredContacts.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-[12px] text-[#90A1B9]"
            >
              No conversations found
            </motion.p>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <ContactItem
                    contact={contact}
                    isSelected={selectedId === contact.id}
                    onClick={() => onSelectContact(contact.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <div className="relative">
        <button
          onClick={onNewChat}
          title="New chat"
          className="absolute bottom-4 right-4 flex h-[44px] w-[44px] items-center justify-center rounded-[6px] bg-[#E60076] text-white shadow-[0_1px_2px_-1px_rgba(0,0,0,0.10),0_1px_3px_0_rgba(16,24,40,0.10)] transition-transform hover:scale-105 active:scale-95"
        >
          <i className="new-message h-[22px] w-[22px]" />
        </button>
      </div>
    </div>
  );
}
