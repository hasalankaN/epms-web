"use client";

import React from "react";

import {
  Bell,
  CheckCircle,
  ClipboardList,
  DollarSign,
  GraduationCap,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { NotificationDataType, NotificationType } from "@/types/notifications";

const ICON_MAP: Record<
  NotificationType,
  { icon: React.ElementType; bg: string; color: string }
> = {
  leave:    { icon: CheckCircle,    bg: "bg-emerald-50",  color: "text-emerald-600" },
  task:     { icon: ClipboardList,  bg: "bg-blue-50",     color: "text-blue-600"    },
  training: { icon: GraduationCap,  bg: "bg-violet-50",   color: "text-violet-600"  },
  salary:   { icon: DollarSign,     bg: "bg-amber-50",    color: "text-amber-600"   },
  profile:  { icon: User,           bg: "bg-neutral-100", color: "text-neutral-600" },
  system:   { icon: Bell,           bg: "bg-rose-50",     color: "text-rose-600"    },
  general:  { icon: Bell,           bg: "bg-neutral-100", color: "text-neutral-500" },
};


interface NotificationItemProps {
  notification: NotificationDataType;
  onMarkRead?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
}) => {
  const { id, title, message, type = "general", createdAt, isRead } = notification;
  const { icon: Icon, bg, color } = ICON_MAP[type] ?? ICON_MAP.general;

  return (
    <div
      onClick={() => !isRead && onMarkRead?.(id)}
      className={cn(
        "group flex items-start gap-4 px-5 py-4 transition-colors duration-150 cursor-pointer",
        "border-b border-neutral-100 last:border-b-0",
        isRead
          ? "hover:bg-neutral-50/60"
          : "bg-blue-50/30 hover:bg-blue-50/50"
      )}
    >
      {/* Icon pill */}
      <div
        className={cn(
          "flex-shrink-0 mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl",
          bg
        )}
      >
        <Icon className={cn("h-4 w-4", color)} strokeWidth={1.75} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm leading-snug truncate",
            isRead ? "font-normal text-neutral-700" : "font-semibold text-neutral-900"
          )}
        >
          {title}
        </p>
        <p className="mt-0.5 text-xs text-neutral-500 line-clamp-2 leading-relaxed">
          {message}
        </p>
      </div>

      {/* Timestamp + unread dot */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1.5 ml-2">
        {createdAt && (
          <span className="text-xs text-neutral-400 whitespace-nowrap">{createdAt}</span>
        )}
        {!isRead && (
          <span className="h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
