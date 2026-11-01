"use client";

import React from "react";

import { Bell, CheckCheck, Globe, Mail } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { RecentNotificationItem } from "@/types/hrDashboard";

interface RecentNotificationsWidgetProps {
  notifications: RecentNotificationItem[];
  onSendNew?: () => void;
}

export function RecentNotificationsWidget({
  notifications,
  onSendNew,
}: RecentNotificationsWidgetProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Recent Dispatched Notifications
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Audited HR announcements, circulars & delivery receipts
              </p>
            </div>
          </div>

          {onSendNew && (
            <button
              type="button"
              onClick={onSendNew}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
            >
              <span>+ Broadcast</span>
            </button>
          )}
        </div>

        <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          {notifications.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="py-3 space-y-1.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                  {item.sentAt}
                </Badge>
              </div>

              <p className="text-[11px] text-slate-500 line-clamp-2">
                {item.message}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    To: {item.targetAudience}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {item.channel === "PORTAL" ? (
                      <Globe className="h-3 w-3 text-slate-400" />
                    ) : (
                      <Mail className="h-3 w-3 text-slate-400" />
                    )}
                    {item.channel}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[10px]">
                  <CheckCheck className="h-3.5 w-3.5" />
                  <span>{item.readRate}% Read ({item.recipientCount} sent)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mt-2">
        <span>Corporate Bulletins & Memos</span>
        <span className="font-mono text-[10px] text-slate-500">Live Delivery</span>
      </div>
    </div>
  );
}
