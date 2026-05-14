"use client";

import { useState } from "react";

import { format } from "date-fns";
import { MoreVertical } from "lucide-react";

import { DataTable } from "@/components/common/table/DataTable";
import type { Column } from "@/components/common/table/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewNotificationModal } from "../../modals/ViewNotificationModal";
import { useGetSentNotifications } from "@/hooks/api/notifications/useGetSentNotifications";
import type { NotificationSchedule, NotificationChannel, NotificationTargetType } from "@/types/notifications";

// ===== DISPLAY HELPERS =====

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  PUSH: "Push",
  EMAIL: "Email",
  SMS: "SMS",
};

const TARGET_LABELS: Record<NotificationTargetType, string> = {
  ALL: "All Users",
  BATCH: "Batches",
  COURSE: "Courses",
  ROLE: "By Role",
  USER_IDS: "Specific Users",
};

function formatChannels(channels: NotificationChannel[]): string {
  return channels.map((c) => CHANNEL_LABELS[c] ?? c).join(", ");
}

// ===== PROPS =====

interface SentTableProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  dateFrom?: string | null;
  dateTo?: string | null;
  channels?: string | null;
}

// ===== COMPONENT =====

export function SentTable({ currentPage, onPageChange, dateFrom, dateTo, channels }: SentTableProps) {
  const [selectedNotification, setSelectedNotification] = useState<{ title: string; message: string } | null>(null);

  const { data, isLoading, isError } = useGetSentNotifications({
    page: currentPage,
    size: 10,
    dateFrom: dateFrom ?? undefined,
    dateTo: dateTo ?? undefined,
    channels: channels ?? undefined,
  });

  const rows = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));

  const columns: Column<NotificationSchedule>[] = [
    {
      header: "Sent At",
      accessorKey: "sent_at",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[120px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C]">
          {item.sent_at ? format(new Date(item.sent_at), "hh:mm a") : "—"}
        </div>
      ),
    },
    {
      header: "Sent On",
      accessorKey: "sent_at",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[140px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C]">
          {item.sent_at ? format(new Date(item.sent_at), "MMM dd, yyyy") : "—"}
        </div>
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
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {formatChannels(item.channels)}
        </div>
      ),
    },
    {
      header: "Recipients",
      accessorKey: "target_type",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[140px]",
      cell: (item) => (
        <span className="text-[11px] font-semibold text-[#45556C]">
          {TARGET_LABELS[item.target_type] ?? item.target_type}
        </span>
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
                onClick={() => setSelectedNotification({ title: item.title, message: item.body })}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                View
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
        data={rows}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        isError={isError}
        pagination={{
          variant: "simple",
          totalCount: data?.total ?? 0,
          currentPage,
          totalPages,
          onPageChange,
        }}
      />

      <ViewNotificationModal
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        notification={selectedNotification}
      />
    </>
  );
}
