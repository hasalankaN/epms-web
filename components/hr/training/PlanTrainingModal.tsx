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
  const [step, setStep] = useState(1);

  // Step 1: Basics
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState<TrainingMode>("PHYSICAL");
  const [venue, setVenue] = useState("");

  // Step 2: Schedule & Instructors
  const [date, setDate] = useState("2026-04-15");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [endTime, setEndTime] = useState("01:00 PM");
  const [instructor, setInstructor] = useState("");

  // Step 3: Participants
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([
    "EMP-001",
    "EMP-002",
    "EMP-003",
  ]);

  // Step 4: Budget
  const [budget, setBudget] = useState("85000");

  const planMutation = usePlanTrainingMutation();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    planMutation.mutate(
      {
        name,
        description,
        date,
        startTime,
        endTime,
        mode,
        venue: venue || "Main Training Hall",
        instructors: [instructor || "Senior Technical Specialist"],
        participantIds: selectedEmployees,
        budget: parseFloat(budget) || 0,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setStep(1);
          setName("");
          setDescription("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Plan Corporate Training Program (Step {step} of 4)</DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center gap-1.5 py-1">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                s <= step ? "bg-[#E60076]" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <form onSubmit={step === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-4 pt-2">
          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Training Title</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lean Garment Manufacturing & 5S Principles"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Delivery Mode</Label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as TrainingMode)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="PHYSICAL">Physical / On-site Workshop</option>
                  <option value="ONLINE">Online Webinar</option>
                  <option value="HYBRID">Hybrid (Floor & Video)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Venue / Location</Label>
                <Input
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Plant Training Center Floor 2, Zoom Room #1"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Program Description & Objectives</Label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key competencies to be gained..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Schedule & Instructors */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Start Time</Label>
                  <Input
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>End Time</Label>
                  <Input
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="01:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Lead Trainer / Instructor Name</Label>
                <Input
                  value={instructor}
                  onChange={(e) => setInstructor(e.target.value)}
                  placeholder="e.g. Mr. Bandula Jayasuriya (Certified Lean Master)"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: Participants */}
          {step === 3 && (
            <div className="space-y-3">
              <Label>Enrolled Participants ({selectedEmployees.length} Selected)</Label>
              <div className="p-3 border rounded-md max-h-48 overflow-y-auto space-y-2 text-xs">
                {[
                  { id: "EMP-001", name: "Kavinda Perera (Stitching Line A)" },
                  { id: "EMP-002", name: "Nuwan Disanayake (QA Section)" },
                  { id: "EMP-003", name: "Sanduni Jayawardena (Sewing)" },
                  { id: "EMP-004", name: "Thilina Fernando (Maintenance)" },
                  { id: "EMP-005", name: "Dilani Silva (Logistics)" },
                  { id: "EMP-006", name: "Roshan Alwis (HR Coordinator)" },
                ].map((emp) => (
                  <label key={emp.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedEmployees([...selectedEmployees, emp.id]);
                        } else {
                          setSelectedEmployees(selectedEmployees.filter((id) => id !== emp.id));
                        }
                      }}
                      className="rounded border-gray-300 text-[#E60076] focus:ring-[#E60076]"
                    />
                    <span>{emp.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">
                All selected workers will receive an in-app invite and automated attendance logging.
              </p>
            </div>
          )}

          {/* Step 4: Budget & Review */}
          {step === 4 && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Estimated Training Budget (LKR)</Label>
                <Input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  required
                />
              </div>

              <div className="p-3 bg-muted/40 rounded-lg text-xs space-y-1.5 text-muted-foreground">
                <p className="font-semibold text-foreground">Program Summary Checklist:</p>
                <p>• Title: {name || "Garment Manufacturing Workshop"}</p>
                <p>• Date & Time: {date} ({startTime} - {endTime})</p>
                <p>• Location: {venue || "Main Plant"}</p>
                <p>• Participants: {selectedEmployees.length} employees</p>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Previous
              </Button>
            )}
            {step < 4 ? (
              <Button
                type="button"
                className="bg-[#E60076] hover:bg-[#c40064] text-white"
                onClick={handleNext}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-[#E60076] hover:bg-[#c40064] text-white"
                disabled={planMutation.isPending}
              >
                {planMutation.isPending ? "Planning..." : "Confirm & Plan Session"}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

