"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Briefcase, CheckCircle2, Building2 } from "lucide-react";
import { useApplyJobMutation } from "@/hooks/api/jobs/useJobs";
import type { JobPosting } from "@/types/dto/job.dto";

interface JobDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPosting | null;
  hasApplied: boolean;
}

export function JobDetailDrawer({
  isOpen,
  onClose,
  job,
  hasApplied,
}: JobDetailDrawerProps) {
  const applyMutation = useApplyJobMutation();

  if (!job) return null;

  const handleApply = () => {
    applyMutation.mutate(job.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300">
              {job.department}
            </span>
            <span className="text-xs text-slate-400">Position: {job.position}</span>
          </div>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white pt-1">
            {job.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Key Dates */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-slate-400 text-[10px]">Posted On</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{job.postedDate}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px]">Application Deadline</p>
              <p className="font-semibold text-rose-600">{job.closingDate}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Role Overview</p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              {job.description}
            </p>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <p className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Key Requirements</p>
            <ul className="space-y-1.5">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-3.5 w-3.5 text-pink-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onClose} disabled={applyMutation.isPending}>
            Close
          </Button>
          <Button
            onClick={handleApply}
            disabled={hasApplied || !job.isOpen || applyMutation.isPending}
            className={`font-semibold text-xs ${
              hasApplied
                ? "bg-slate-100 text-slate-400 border border-slate-200"
                : "bg-[#E60076] hover:bg-[#d0006a] text-white"
            }`}
          >
            {hasApplied ? "Already Applied" : applyMutation.isPending ? "Submitting..." : "Apply Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

