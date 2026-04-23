"use client";

import { useMemo, useState } from "react";

import { MoreVertical } from "lucide-react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewRecipientsModal } from "../../modals/ViewRecipientsModal";
import { ViewNotificationModal } from "../../modals/ViewNotificationModal";

// ===== TYPES =====

export interface SentNotificationDataType {
  id: string;
  sentAt: string;
  sentOn: string;
  title: string;
  channels: string;
  recipients: string;
}

// ===== MOCK DATA =====

const mockData: SentNotificationDataType[] = [
  {
    id: "1",
    sentAt: "10:30 AM",
    sentOn: "Jan 15, 2026",
    title: "Welcome to New Batch",
    channels: "SMS, Email, Push",
    recipients: "Students",
  },
  {
    id: "2",
    sentAt: "02:15 PM",
    sentOn: "Jan 16, 2026",
    title: "Assignment Due Reminder",
    channels: "Email, Push",
    recipients: "Students",
  },
  {
    id: "3",
    sentAt: "09:00 AM",
    sentOn: "Jan 17, 2026",
    title: "Upcoming Class Notification",
    channels: "SMS",
    recipients: "Batches",
  },
];

// ===== PROPS =====

interface SentTableProps {
  currentPage: number;
  onPageChange: (page: number) => void;
}

// ===== COMPONENT =====

export function SentTable({ currentPage, onPageChange }: SentTableProps) {
  const filteredData = useMemo(() => mockData, []);
  const totalPages = Math.max(1, Math.ceil(filteredData.length / 10));

  const handleViewRecipients = (category: string) => {
    setSelectedCategory(category);
    setIsRecipientsModalOpen(true);
  };

  const handleViewNotification = (item: SentNotificationDataType) => {
    setSelectedNotification({
      title: item.title,
      message: "Lorem ipsum dolor sit amet consectetur. Ut pharetra commodo aliquet eu sed senectus. Lorem ipsum dolor sit amet consectetur. Ut pharetra commodo aliquet eu sed senectus. Lorem ipsum dolor sit amet consectetur. Ut pharetra commodo aliquet eu sed senectus.",
    });
    setIsNotificationModalOpen(true);
  };

  const [isRecipientsModalOpen, setIsRecipientsModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<{ title: string, message: string } | null>(null);

  // Mock recipients data
  const mockRecipients = [
    { id: "1", name: "Alice Johnson", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&auto=format&fit=crop" },
    { id: "2", name: "Bob Wilson", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&auto=format&fit=crop" },
    { id: "3", name: "Carol Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&auto=format&fit=crop" },
    { id: "4", name: "David Miller", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&auto=format&fit=crop" },
    { id: "5", name: "Eva Smith", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&auto=format&fit=crop" },
    { id: "6", name: "Frank Ross", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&auto=format&fit=crop" },
    { id: "7", name: "Grace Lee", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&auto=format&fit=crop" },
    { id: "8", name: "Henry Ford", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&auto=format&fit=crop" },
  ];

  const columns: Column<SentNotificationDataType>[] = [
    {
      header: "Sent At",
      accessorKey: "sentAt",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[120px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C]">{item.sentAt}</div>
      ),
    },
    {
      header: "Sent On",
      accessorKey: "sentOn",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[140px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C]">{item.sentOn}</div>
      ),
    },
    {
      header: "Notification Title",
      accessorKey: "title",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis max-w-[240px]">
          {item.title}
        </div>
      ),
    },
    {
      header: "Channels",
      accessorKey: "channels",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[160px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">{item.channels}</div>
      ),
    },
    {
      header: "Recipients",
      accessorKey: "recipients",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[140px]",
      cell: (item) => (
        <button 
          onClick={() => handleViewRecipients(item.recipients)}
          className="text-[11px] font-semibold text-[#E60076] hover:underline"
        >
          View
        </button>
      ),
    },
    {
      header: "Action",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] text-right w-[80px]",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4 text-[#64748B]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              <DropdownMenuItem 
                onClick={() => handleViewNotification(item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-[#FDF2F8]">
                Resend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={filteredData}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={false}
        isError={false}
        pagination={{
          variant: "simple",
          totalCount: filteredData.length,
          currentPage,
          totalPages,
          onPageChange,
        }}
      />
      
      <ViewRecipientsModal
        isOpen={isRecipientsModalOpen}
        onClose={() => setIsRecipientsModalOpen(false)}
        recipients={mockRecipients}
        category={selectedCategory}
        totalCount={8}
      />

      <ViewNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notification={selectedNotification}
      />
    </>
  );
}
