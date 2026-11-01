"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScheduleEvaluationMeetingMutation } from "@/hooks/api/performance/usePerformance";

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleMeetingModal({ isOpen, onClose }: ScheduleMeetingModalProps) {
  const [employeeId, setEmployeeId] = useState("emp-1042");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [location, setLocation] = useState("Meeting Room 3B (Level 3)");
  const [notes, setNotes] = useState("");

  const scheduleMutation = useScheduleEvaluationMeetingMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    scheduleMutation.mutate(
      {
        employeeId,
        dateTime: `${date} ${time}`,
        location,
        notes,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
            Schedule Appraisal Meeting
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Set up an in-person or virtual 1-on-1 review session with a team member.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Team Member</label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-pink-500"
            >
              <option value="emp-1042">Nuwan Perera (Senior Software Engineer)</option>
              <option value="emp-1015">Dilani Wickramasinghe (Software Engineer)</option>
              <option value="emp-1022">Kasun Jayasuriya (QA Engineer)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Date</label>
              <Input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">Time</label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Location / Room</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300">Discussion Agenda Notes</label>
            <Textarea
              placeholder="e.g. Discuss Q3 deliverables, career advancement roadmap..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 text-xs"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={scheduleMutation.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#E60076] hover:bg-[#d0006a] text-white"
              disabled={scheduleMutation.isPending || !date}
            >
              {scheduleMutation.isPending ? "Scheduling..." : "Schedule Meeting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

