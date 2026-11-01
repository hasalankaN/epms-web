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

import type { UpcomingTrainingSession } from "@/types/hrDashboard";

interface PlanTrainingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTrainingAdded?: (training: UpcomingTrainingSession) => void;
}

export function PlanTrainingModal({
  open,
  onOpenChange,
  onTrainingAdded,
}: PlanTrainingModalProps) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Organization Wide");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [trainer, setTrainer] = useState("");
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState("30");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !date || !trainer) {
      toast.error("Please fill in all mandatory training details.");
      
return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newTraining: UpcomingTrainingSession = {
        id: `TRN-${Math.floor(100 + Math.random() * 900)}`,
        title,
        department,
        date,
        time: time || "09:30 AM - 12:30 PM",
        trainer,
        venueOrPlatform: venue || "Main Training Hall",
        registeredCount: 0,
        maxCapacity: parseInt(capacity) || 30,
        status: "SCHEDULED",
      };

      if (onTrainingAdded) {
        onTrainingAdded(newTraining);
      }

      toast.success("Training session successfully planned & scheduled! (#35)");
      setIsSubmitting(false);
      onOpenChange(false);

      // Reset form
      setTitle("");
      setDate("");
      setTime("");
      setTrainer("");
      setVenue("");
      setDescription("");
    }, 400);
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
              <Label className="text-xs font-semibold">Target Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Organization Wide">Organization Wide</SelectItem>
                  <SelectItem value="Engineering & IT">Engineering & IT</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                  <SelectItem value="Logistics & Store">Logistics & Store</SelectItem>
                  <SelectItem value="Supervisors & Leads">Supervisors & Leads</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              <Label htmlFor="training-time" className="text-xs font-semibold">
                Time Window
              </Label>
              <Input
                id="training-time"
                placeholder="09:00 AM - 12:00 PM"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="training-capacity" className="text-xs font-semibold">
                Max Capacity
              </Label>
              <Input
                id="training-capacity"
                type="number"
                min="5"
                max="250"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="training-venue" className="text-xs font-semibold">
              Venue / Mode
            </Label>
            <Input
              id="training-venue"
              placeholder="e.g. Auditorium / Zoom Hybrid / Plant 1 Room"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
            />
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
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isSubmitting ? "Scheduling..." : "Schedule Training"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
