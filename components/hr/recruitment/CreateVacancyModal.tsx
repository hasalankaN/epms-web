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
import { useCreateVacancyMutation } from "@/hooks/api/jobs/useJobs";

interface CreateVacancyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateVacancyModal({
  open,
  onOpenChange,
}: CreateVacancyModalProps) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Production");
  const [position, setPosition] = useState("");
  const [closingDate, setClosingDate] = useState("2026-04-30");
  const [description, setDescription] = useState("");
  const [reqText, setReqText] = useState("");

  const createMutation = useCreateVacancyMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !position.trim() || !description.trim()) {
      return;
    }

    const requirements = reqText
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    createMutation.mutate(
      {
        title,
        department,
        position,
        requirements: requirements.length > 0 ? requirements : ["Relevant factory experience"],
        description,
        closingDate,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          setTitle("");
          setPosition("");
          setDescription("");
          setReqText("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Post New Internal or Factory Vacancy</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Vacancy Job Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Sewing Operator, Assistant Line Supervisor"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Department</Label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Production">Production & Line Ops</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Cutting & Sewing">Cutting & Sewing</option>
                <option value="Warehouse & Logistics">Warehouse & Logistics</option>
                <option value="Maintenance">Maintenance & Engineering</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>Designation / Position</Label>
              <Input
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Technician II"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Closing Date</Label>
            <Input
              type="date"
              value={closingDate}
              onChange={(e) => setClosingDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Job Description</Label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Primary responsibilities, shift hours, line duties..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Key Requirements (One per line)</Label>
            <textarea
              rows={3}
              value={reqText}
              onChange={(e) => setReqText(e.target.value)}
              placeholder="Minimum 2 years experience in garment production&#10;Knowledge of automated flatlock machines&#10;High attention to detail"
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
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Publishing..." : "Publish Vacancy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

