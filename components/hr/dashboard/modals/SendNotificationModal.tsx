"use client";

import React, { useState } from "react";

import { toast } from "sonner";

import { BellRing, Send } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { RecentNotificationItem } from "@/types/hrDashboard";

interface SendNotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNotificationSent?: (item: RecentNotificationItem) => void;
}

export function SendNotificationModal({
  open,
  onOpenChange,
  onNotificationSent,
}: SendNotificationModalProps) {
  const [title, setTitle] = useState("");
  const [audience, setAudience] = useState("All Employees");
  const [channel, setChannel] = useState<"PORTAL" | "EMAIL" | "ALL">("PORTAL");
  const [priority, setPriority] = useState("NORMAL");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !message) {
      toast.error("Please enter both title and message body.");
      
return;
    }

    setIsSending(true);
    setTimeout(() => {
      const newNotif: RecentNotificationItem = {
        id: `NOTIF-${Math.floor(100 + Math.random() * 900)}`,
        title,
        message,
        targetAudience: audience,
        channel,
        sentAt: "Just now",
        sentBy: "HR Department",
        recipientCount: audience === "All Employees" ? 248 : 45,
        readRate: 0,
      };

      if (onNotificationSent) {
        onNotificationSent(newNotif);
      }

      toast.success(
        `Notification "${title}" broadcasted to ${audience}! (#63)`
      );
      setIsSending(false);
      onOpenChange(false);
      setTitle("");
      setMessage("");
    }, 450);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Broadcast HR Notification</DialogTitle>
              <DialogDescription>
                Dispatch company notices, alerts, and circulars to workforce (#63, #64).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="notif-title" className="text-xs font-semibold">
              Subject / Announcement Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="notif-title"
              placeholder="e.g. Mandatory Attendance Policy Updates & Year-End Holidays"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Target Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Employees">All Employees (248)</SelectItem>
                  <SelectItem value="Supervisors & Leads">Supervisors & Leads (18)</SelectItem>
                  <SelectItem value="Production Department">Production Dept (86)</SelectItem>
                  <SelectItem value="Engineering Department">Engineering Dept (54)</SelectItem>
                  <SelectItem value="Quality Assurance">Quality Assurance (32)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Delivery Channel</Label>
              <Select
                value={channel}
                onValueChange={(val) => setChannel(val as "PORTAL" | "EMAIL" | "ALL")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PORTAL">Portal In-App Only</SelectItem>
                  <SelectItem value="EMAIL">Email Dispatch Only</SelectItem>
                  <SelectItem value="ALL">Portal + Email Broadcast</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Priority Flag</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORMAL">Normal Info</SelectItem>
                  <SelectItem value="HIGH">High Priority</SelectItem>
                  <SelectItem value="URGENT">Urgent Action</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notif-body" className="text-xs font-semibold">
              Notification Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="notif-body"
              rows={4}
              placeholder="Type the message body clearly. Include action steps, deadlines, or policy references..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
            >
              <Send className="h-4 w-4" />
              {isSending ? "Broadcasting..." : "Broadcast Notification"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
