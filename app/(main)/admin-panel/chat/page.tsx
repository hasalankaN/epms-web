"use client";

import React, { useState , Suspense } from "react";

import Link from "next/link";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { ChevronLeft } from "lucide-react";

import { ChatSidebar } from "@/components/admin-panel/chat/ChatSidebar";
import { ChatWindow } from "@/components/admin-panel/chat/ChatWindow";
import { StartNewChatModal } from "@/components/admin-panel/chat/modals/StartNewChatModal";
import type { ChatContact, ChatGroup } from "@/components/admin-panel/chat/types";

// ===== MOCK DATA =====

const MOCK_CONTACTS: ChatContact[] = [
  {
    id: "1",
    name: "Ayesha Noor",
    lastMessage: "I'll check the assignment soon.",
    time: "10:30 AM",
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: "2",
    name: "Eva Wells",
    lastMessage: "Yes. Here it is",
    time: "01:57 PM",
    unreadCount: 2,
    isOnline: true,
    avatar: "https://i.pravatar.cc/150?u=eva",
  },
  {
    id: "3",
    name: "John Smith",
    lastMessage: "Can we reschedule the meeting?",
    time: "Yesterday",
    unreadCount: 0,
    isOnline: true,
    avatar: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: "4",
    name: "Sarah Doe",
    lastMessage: "The project looks great!",
    time: "Yesterday",
    unreadCount: 5,
    isOnline: false,
    isMuted: true,
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: "5",
    name: "Mike Ross",
    lastMessage: "I sent the files to your email.",
    time: "Monday",
    unreadCount: 0,
    isOnline: true,
    avatar: "https://i.pravatar.cc/150?u=mike",
  },
  {
    id: "6",
    name: "Harvey Specter",
    lastMessage: "I'll see you in court.",
    time: "Monday",
    unreadCount: 0,
    isOnline: false,
    avatar: "https://i.pravatar.cc/150?u=harvey",
  },
  {
    id: "7",
    name: "Donna Paulsen",
    lastMessage: "I know everything.",
    time: "2:09 PM",
    unreadCount: 0,
    isOnline: true,
    avatar: "https://i.pravatar.cc/150?u=donna",
  },
];

const MOCK_MESSAGES: Record<string, ChatGroup[]> = {
  "2": [
    {
      date: "TODAY",
      messages: [
        {
          id: "m1",
          type: "received",
          text: "Hi, did you finish the application form?",
          time: "01:55 PM",
        },
        {
          id: "m2",
          type: "sent",
          text: "Lorem ipsum dolor sit amet consectetur. Vel feugiat amet fringilla ipsum ac pulvinar netus libero.",
          time: "01:57 PM",
        },
        {
          id: "m3",
          type: "sent",
          text: "Yes. Here it is",
          time: "01:57 PM",
          attachment: {
            name: "Application Form",
            date: "22 Jun, 2022",
            size: "238 KB",
            fileType: "pdf",
          },
        },
        {
          id: "m4",
          type: "received",
          text: "Perfect, I'll review it and get back to you.",
          time: "02:05 PM",
        },
        {
          id: "m5",
          type: "received",
          text: "By the way, do you have the latest syllabus?",
          time: "02:05 PM",
        },
      ],
    },
  ],
  "1": [
    {
      date: "YESTERDAY",
      messages: [
        {
          id: "m1-1",
          type: "received",
          text: "Hello! How are you?",
          time: "10:00 AM",
        },
        {
          id: "m1-2",
          type: "sent",
          text: "I'm good, thanks!",
          time: "10:05 AM",
        },
        {
          id: "m1-3",
          type: "sent",
          text: "I'll check the assignment soon.",
          time: "10:30 AM",
        },
      ],
    },
  ],
};

// ===== PAGE =====


function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const selectedId = searchParams.get("id");

  const [contacts, setContacts] = useState<ChatContact[]>(MOCK_CONTACTS);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const selectedContact = contacts.find((c) => c.id === selectedId) ?? null;
  const groups = selectedId ? (MOCK_MESSAGES[selectedId] ?? []) : [];
  const unreadTotal = contacts.filter((c) => (c.unreadCount ?? 0) > 0).length;

  const updateUrl = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (id) {
      params.set("id", id);
    } else {
      params.delete("id");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSelectContact = (id: string) => {
    updateUrl(id);
    setShowSidebar(false); // mobile: hide sidebar, show chat window
  };

  const handleBack = () => {
    setShowSidebar(true);
    updateUrl(null);
  };

  const handleSendMessage = (text: string, attachment?: any) => {
    console.log("Message Sent:", {
      text,
      attachment,
      recipientId: selectedId,
      timestamp: new Date().toISOString()
    });
  };

  const handleStartChat = (role: string, personId: string) => {
    console.log("Starting new chat:", { role, personId });
    
    const existing = contacts.find(c => c.id === personId);

    if (!existing) {
      const newContact: ChatContact = {
        id: personId,
        name: personId.startsWith("s") ? "Student Name" : role.charAt(0).toUpperCase() + role.slice(1) + " Name",
        lastMessage: "Start of conversation",
        time: "Just now",
        isOnline: true
      };

      setContacts(prev => [newContact, ...prev]);
    }

    updateUrl(personId);
    setShowSidebar(false);
    setIsNewChatModalOpen(false);
  };

  const handleToggleMute = (id: string) => {
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, isMuted: !c.isMuted } : c
    ));
  };

  return (
    <div className="flex h-full flex-col p-4 md:p-6">
      {/* ===== Page Header ===== */}
      <div className="flex items-center gap-[12px]">
        <Link
          href="/admin-panel/dashboard"
          className="hidden md:flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[6px] border border-[#E2E8F0] bg-transparent shadow-[0_1px_2px_0_rgba(16,24,40,0.05)] transition-colors hover:bg-[#F1F5F9]"
          aria-label="Back to dashboard"
        >
          <ChevronLeft className="h-[20px] w-[20px] shrink-0 text-[#314158]" />
        </Link>
        <h1 className="font-inter text-[24px] font-semibold leading-[38px] text-[#0F172B]">
          Chat
        </h1>
      </div>

      {/* ===== Chat Area ===== */}
      <div className="mt-[16px] flex flex-1 overflow-hidden rounded-[8px] border border-[#E2E8F0]">
        {/* Sidebar */}
        <div
          className={[
            "h-full w-full md:block md:w-[320px] md:shrink-0",
            showSidebar ? "block" : "hidden md:block",
          ].join(" ")}
        >
          <ChatSidebar
            contacts={contacts}
            selectedId={selectedId}
            onSelectContact={handleSelectContact}
            onNewChat={() => setIsNewChatModalOpen(true)}
            unreadTotal={unreadTotal}
          />
        </div>

        {/* Right: Chat window */}
        <div
          className={[
            "flex-1 h-full overflow-hidden",
            !showSidebar ? "flex md:flex" : "hidden md:flex",
          ].join(" ")}
        >
          <ChatWindow
            contact={selectedContact}
            groups={groups}
            onBack={handleBack}
            onSendMessage={handleSendMessage}
            onToggleMute={handleToggleMute}
          />
        </div>
      </div>

      <StartNewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onStartChat={handleStartChat}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[#94A3B8]">Loading chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
