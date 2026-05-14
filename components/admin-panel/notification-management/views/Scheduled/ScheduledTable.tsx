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
import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { ViewNotificationModal } from "../../modals/ViewNotificationModal";
import { EditNotificationModal } from "../../modals/EditNotificationModal";
import { useGetScheduledNotifications } from "@/hooks/api/notifications/useGetScheduledNotifications";
import { useDeleteScheduledNotification } from "@/hooks/api/notifications/useDeleteScheduledNotification";
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

interface ScheduledTableProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  channels?: string | null;
}

// ===== COMPONENT =====

export function ScheduledTable({ currentPage, onPageChange, channels }: ScheduledTableProps) {
  const [selectedView, setSelectedView] = useState<{ title: string; message: string } | null>(null);
  const [selectedEdit, setSelectedEdit] = useState<NotificationSchedule | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetScheduledNotifications({
    page: currentPage,
    size: 10,
    channels: channels ?? undefined,
  });

  const { mutate: deleteNotification, isPending: isDeleting } = useDeleteScheduledNotification();

  const rows = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / 10));

  const columns: Column<NotificationSchedule>[] = [
    {
      header: "Scheduled On",
      accessorKey: "created_at",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[200px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {format(new Date(item.created_at), "MMM dd, yyyy hh:mm a")}
        </div>
      ),
    },
    {
      header: "Scheduled For",
      accessorKey: "scheduled_at",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[200px]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#45556C] whitespace-nowrap">
          {item.scheduled_at ? format(new Date(item.scheduled_at), "MMM dd, yyyy hh:mm a") : "—"}
        </div>
      ),
    },
    {
      header: "Notification Title",
      accessorKey: "title",
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D]",
      cell: (item) => (
        <div className="text-[11px] font-medium text-[#0F172B] whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
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
      className: "px-2 py-2 text-[13px] font-semibold text-[#1D293D] w-[130px]",
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
                onClick={() => setSelectedView({ title: item.title, message: item.body })}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedEdit(item)}
                className="cursor-pointer focus:bg-[#FDF2F8]"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteId(item.id)}
                className="cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-600"
              >
                Delete
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
        isOpen={!!selectedView}
        onClose={() => setSelectedView(null)}
        notification={selectedView}
      />

      <EditNotificationModal
        isOpen={!!selectedEdit}
        onClose={() => setSelectedEdit(null)}
        notification={selectedEdit}
      />

      <DeleteConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) deleteNotification(deleteId, { onSuccess: () => setDeleteId(null) });
        }}
        title="Delete Scheduled Notification"
        description="This notification will be permanently deleted and will not be sent. This action cannot be undone."
        confirmText={isDeleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
      />
    </>
  );
}
