"use client";

import React, { useState, useTransition } from "react";

import { Check, BellOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NotificationDataType } from "@/types/notifications";
import NotificationItem from "./NotificationItem";

interface NotificationsListProps {

  /** Initial notifications array coming from the server page */
  initialNotifications: NotificationDataType[];

  /** Short description shown under the page title */
  subtitle?: string;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  initialNotifications,
  subtitle = "Your latest updates and alerts.",
}) => {
  const [notifications, setNotifications] =
    useState<NotificationDataType[]>(initialNotifications);

  const [isPending, startTransition] = useTransition();

  /* ── helpers ── */
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markRead = (id: string) => {
    startTransition(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    });
  };

  const markAllRead = () => {
    startTransition(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    });
  };

  /* ── split into unread / read groups ── */
  const unread = notifications.filter((n) => !n.isRead);
  const read   = notifications.filter((n) =>  n.isRead);

  return (
    <div className="flex h-full flex-col px-6 py-6">
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        </div>

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={markAllRead}
            className="flex-shrink-0 gap-1.5 text-xs font-medium text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            <Check className="h-3.5 w-3.5" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* ── Card wrapper — fills remaining height, rows scroll inside ── */}
      <div className="flex flex-1 flex-col rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden min-h-0">

        {notifications.length === 0 ? (

          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-neutral-400">
            <BellOff className="h-10 w-10 opacity-40" />
            <p className="text-sm font-medium">No notifications yet</p>
            <p className="text-xs">We&apos;ll let you know when something arrives.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Unread section */}
            {unread.length > 0 && (
              <section>
                <div className="flex items-center gap-2 px-5 py-3 border-b border-neutral-100 bg-neutral-50/60 sticky top-0 z-10">
                  <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                    Inbox
                  </span>
                  <span
                    className={cn(
                      "ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5",
                      "bg-blue-600 text-[10px] font-semibold text-white leading-none"
                    )}
                  >
                    {unread.length}
                  </span>
                  <span className="text-xs text-neutral-400 ml-0.5">unread</span>
                </div>
                {unread.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onMarkRead={markRead}
                  />
                ))}
              </section>
            )}

            {/* Read section */}
            {read.length > 0 && (
              <section>
                {unread.length > 0 && (
                  <div className="px-5 py-3 border-b border-neutral-100 bg-neutral-50/40 sticky top-0 z-10">
                    <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                      Earlier
                    </span>
                  </div>
                )}
                {read.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onMarkRead={markRead}
                  />
                ))}
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsList;
