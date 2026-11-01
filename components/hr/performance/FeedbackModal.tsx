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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [targetEmp, setTargetEmp] = useState("EMP-001");
  const [peerReviewers, setPeerReviewers] = useState<string[]>(["EMP-002", "EMP-003"]);
  const [deadline, setDeadline] = useState("2026-04-15");
  const [instructions, setInstructions] = useState(
    "Please assess teamwork, punctuality, and craftsmanship over the last operational cycle."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("360° peer feedback requests dispatched via email and notification!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Initiate 360° Peer Feedback</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label>Employee Being Reviewed</Label>
            <select
              value={targetEmp}
              onChange={(e) => setTargetEmp(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="EMP-001">Kavinda Perera (EMP-001)</option>
              <option value="EMP-002">Nuwan Disanayake (EMP-002)</option>
              <option value="EMP-003">Sanduni Jayawardena (EMP-003)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label>Requested Peer Reviewers</Label>
            <div className="p-3 border rounded-md space-y-2 text-xs">
              {[
                { id: "EMP-002", name: "Nuwan Disanayake (Quality)" },
                { id: "EMP-003", name: "Sanduni Jayawardena (Sewing)" },
                { id: "EMP-004", name: "Thilina Fernando (Maintenance)" },
              ].map((peer) => (
                <label key={peer.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={peerReviewers.includes(peer.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPeerReviewers([...peerReviewers, peer.id]);
                      } else {
                        setPeerReviewers(peerReviewers.filter((id) => id !== peer.id));
                      }
                    }}
                    className="rounded border-gray-300 text-[#E60076] focus:ring-[#E60076]"
                  />
                  <span>{peer.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Feedback Submission Deadline</Label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>Special Instructions for Peers</Label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
              Dispatch Feedback Requests
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

