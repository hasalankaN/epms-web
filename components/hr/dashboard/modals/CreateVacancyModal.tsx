"use client";

import React, { useState } from "react";

import { toast } from "sonner";

import { Briefcase } from "lucide-react";

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

import { useCreateVacancyMutation } from "@/hooks/api/jobs/useJobs";
import type { OpenVacancy } from "@/types/hrDashboard";

interface CreateVacancyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVacancyCreated?: (vacancy: OpenVacancy) => void;
}

export function CreateVacancyModal({
  open,
  onOpenChange,
  onVacancyCreated,
}: CreateVacancyModalProps) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [type, setType] = useState("Full-Time");
  const [openings, setOpenings] = useState("1");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  const createVacancyMutation = useCreateVacancyMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !deadline) {
      toast.error("Please fill in the job title and deadline date.");
      return;
    }

    createVacancyMutation.mutate(
      {
        title,
        department,
        position: title,
        requirements: ["Experience in apparel / operations"],
        description: description || "Job opening created via HR Portal.",
        closingDate: deadline,
      },
      {
        onSuccess: (data: any) => {
          if (onVacancyCreated) {
            onVacancyCreated({
              id: data?.id || `VAC-${Date.now()}`,
              title,
              department,
              type,
              openings: parseInt(openings) || 1,
              applicationsCount: 0,
              upcomingInterviews: 0,
              deadline,
              status: "OPEN",
            });
          }
          onOpenChange(false);
          setTitle("");
          setDeadline("");
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
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>Create New Vacancy</DialogTitle>
              <DialogDescription>
                Publish job openings for candidate application tracking (#60).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="vacancy-title" className="text-xs font-semibold">
              Position Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="vacancy-title"
              placeholder="e.g. Senior Embedded Firmware Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                  <SelectItem value="Logistics & Store">Logistics</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                  <SelectItem value="Finance & Sales">Finance & Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Employment Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-Time">Full-Time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Part-Time">Part-Time</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="openings-count" className="text-xs font-semibold">
                Open Slots
              </Label>
              <Input
                id="openings-count"
                type="number"
                min="1"
                max="20"
                value={openings}
                onChange={(e) => setOpenings(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="application-deadline" className="text-xs font-semibold">
              Application Deadline <span className="text-red-500">*</span>
            </Label>
            <Input
              id="application-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vacancy-desc" className="text-xs font-semibold">
              Job Summary & Core Requirements
            </Label>
            <Textarea
              id="vacancy-desc"
              rows={3}
              placeholder="Outline candidate qualification criteria, required experience, and key duties..."
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
              disabled={createVacancyMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {createVacancyMutation.isPending ? "Publishing..." : "Post Vacancy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
