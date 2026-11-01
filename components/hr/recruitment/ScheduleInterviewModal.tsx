"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useScheduleInterviewMutation } from "@/hooks/api/jobs/useJobs";
import type { JobApplication } from "@/types/dto/job.dto";

interface ScheduleInterviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: JobApplication | null;
}

export function ScheduleInterviewModal({
  open,
  onOpenChange,
  application,
}: ScheduleInterviewModalProps) {
  const [dateTime, setDateTime] = useState("2026-04-10T10:00");
  const [interviewerName, setInterviewerName] = useState("Chandana Gunasekara");
  const [notes, setNotes] = useState("");

  const scheduleMutation = useScheduleInterviewMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!application) return;

    scheduleMutation.mutate(
      {
        applicationId: application.id,
        dateTime,
        interviewerName,
        notes,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setNotes("");
        },
      }
    );
  };

  if (!application) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Candidate Interview</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Applicant</Label>
            <Input
              value={`${application.candidateName} — ${application.jobTitle}`}
              disabled
            />
          </div>

          <div className="space-y-1.5">
            <Label>Interview Date & Time</Label>
            <Input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Interviewer / Panel Lead</Label>
            <Input
              value={interviewerName}
              onChange={(e) => setInterviewerName(e.target.value)}
              placeholder="e.g. Production Manager / Senior HR Exec"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Interview Room / Location & Notes</Label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Plant Floor QA Room 2, practical machine test included..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
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
              className="bg-[#E60076] hover:bg-[#c40064] text-white"
              disabled={scheduleMutation.isPending}
            >
              {scheduleMutation.isPending ? "Scheduling..." : "Confirm Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

