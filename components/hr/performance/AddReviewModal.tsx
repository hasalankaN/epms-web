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
import { Star } from "lucide-react";
import { toast } from "sonner";

interface AddReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddReviewModal({
  open,
  onOpenChange,
  onSuccess,
}: AddReviewModalProps) {
  const [employee, setEmployee] = useState("EMP-001");
  const [quarter, setQuarter] = useState("2026 Q1");
  const [rating, setRating] = useState(4);
  const [comments, setComments] = useState("");
  const [feedback, setFeedback] = useState("");
  const [compensation, setCompensation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim() || !feedback.trim()) {
      toast.error("Please enter review comments and developmental feedback.");
      return;
    }

    toast.success(`Formal performance appraisal recorded for ${employee}!`);
    onOpenChange(false);
    setComments("");
    setFeedback("");
    setCompensation("");
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Record Formal Performance Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Employee</Label>
              <select
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="EMP-001">Kavinda Perera (EMP-001)</option>
                <option value="EMP-002">Nuwan Disanayake (EMP-002)</option>
                <option value="EMP-003">Sanduni Jayawardena (EMP-003)</option>
                <option value="EMP-004">Thilina Fernando (EMP-004)</option>
                <option value="EMP-005">Dilani Silva (EMP-005)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>Evaluation Cycle</Label>
              <select
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="2026 Q1">2026 Q1 Appraisal</option>
                <option value="2025 Annual">2025 Annual Review</option>
                <option value="Mid-Year 2026">Mid-Year 2026</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Overall Performance Score ({rating} / 5)</Label>
            <div className="flex items-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Key Achievements & Review Summary</Label>
            <textarea
              rows={3}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Exceeded sewing target volume; maintained low defect ratios..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Developmental Recommendations & Goals</Label>
            <textarea
              rows={2}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Recommended for advanced embroidery training and shift lead trial..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Compensation or Increment Recommendation (Optional)</Label>
            <Input
              value={compensation}
              onChange={(e) => setCompensation(e.target.value)}
              placeholder="e.g. +8% Merit increment or Grade step upgrade"
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
            >
              Save Review Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

