"use client";

import React, { useState } from "react";

import { toast } from "sonner";

import { GraduationCap } from "lucide-react";

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

import { usePlanTrainingMutation } from "@/hooks/api/training/useTraining";
import type { TrainingMode } from "@/types/dto/training.dto";

interface PlanTrainingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PlanTrainingModal({
  open,
  onOpenChange,
}: PlanTrainingModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:30 AM");
  const [endTime, setEndTime] = useState("12:30 PM");
  const [trainer, setTrainer] = useState("");
  const [venue, setVenue] = useState("");
  const [mode, setMode] = useState<TrainingMode>("PHYSICAL");
  const [description, setDescription] = useState("");
  const planMutation = usePlanTrainingMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !date || !trainer) {
      toast.error("Please fill in all mandatory training details.");

      return;
    }

    planMutation.mutate(
      {
        name: title,
        description,
        date,
        startTime,
        endTime,
        mode,
        venue: venue || "Main Training Hall",
        instructors: [trainer],
        participantIds: [],
        budget: 0,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setTitle("");
          setDate("");
          setStartTime("09:30 AM");
          setEndTime("12:30 PM");
          setTrainer("");
          setVenue("");
          setDescription("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Plan & Schedule Training</DialogTitle>
              <DialogDescription>
                Schedule professional development sessions & track enrollment (#35).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="training-title" className="text-xs font-semibold">
              Training Session Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="training-title"
              placeholder="e.g. Advanced Quality Assurance Standards & ISO Audit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="training-trainer" className="text-xs font-semibold">
                Trainer / Institute <span className="text-red-500">*</span>
              </Label>
              <Input
                id="training-trainer"
                placeholder="e.g. Dr. K. Silva or External Agency"
                value={trainer}
                onChange={(e) => setTrainer(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="training-date" className="text-xs font-semibold">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="training-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="training-start-time" className="text-xs font-semibold">
                Start Time
              </Label>
              <Input
                id="training-start-time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="training-end-time" className="text-xs font-semibold">
                End Time
              </Label>
              <Input
                id="training-end-time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Delivery Mode</Label>
              <Select value={mode} onValueChange={(value) => setMode(value as TrainingMode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PHYSICAL">Physical / On-site</SelectItem>
                  <SelectItem value="ONLINE">Online</SelectItem>
                  <SelectItem value="HYBRID">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="training-venue" className="text-xs font-semibold">
                Venue / Platform
              </Label>
              <Input
                id="training-venue"
                placeholder="e.g. Auditorium or Zoom"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="training-desc" className="text-xs font-semibold">
              Objectives & Syllabus Brief
            </Label>
            <Textarea
              id="training-desc"
              rows={2}
              placeholder="Key topics, prerequisites, and target skills..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              disabled={planMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {planMutation.isPending ? "Scheduling..." : "Schedule Training"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
