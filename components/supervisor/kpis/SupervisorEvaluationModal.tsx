"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useSubmitSupervisorEvaluationMutation } from "@/hooks/api/performance/usePerformance";
import type { SelfEvaluation } from "@/types/dto/performance.dto";

interface SupervisorEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluation: SelfEvaluation | null;
}

export function SupervisorEvaluationModal({
  isOpen,
  onClose,
  evaluation,
}: SupervisorEvaluationModalProps) {
  const [supervisorRating, setSupervisorRating] = useState(4.5);
  const [supervisorComments, setSupervisorComments] = useState("");
  const [strengths, setStrengths] = useState("");
  const [areasToImprove, setAreasToImprove] = useState("");
  const [recommendation, setRecommendation] = useState<
    "NONE" | "REWARD" | "TRAINING" | "PROMOTION"
  >("REWARD");

  const submitMutation = useSubmitSupervisorEvaluationMutation();

  if (!evaluation) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(
      {
        evalId: evaluation.id,
        payload: {
          supervisorRating,
          supervisorFeedback: supervisorComments,
          supervisorComments,
          strengths,
          areasToImprove,
          recommendation,
        },
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
            Conduct Performance Appraisal: {evaluation.employeeName}
          </DialogTitle>
          <p className="text-xs text-slate-500">
            Cycle: {evaluation.period} · Review self-assessment ratings and provide formal supervisor evaluation.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2 text-xs">
          {/* Left Column: Read-Only Self Evaluation */}
          <div className="space-y-4 border-r border-slate-200 dark:border-slate-800 pr-0 md:pr-4">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
              <span className="font-bold text-slate-700 dark:text-slate-300">Employee Self Rating</span>
              <span className="font-extrabold text-[#E60076] text-sm">
                {evaluation.overallRating} / 5.0
              </span>
            </div>

            <div className="space-y-3">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400">
                Self Rating Criteria Breakdown
              </span>
              {evaluation.criteria?.map((c, i) => (
                <div key={i} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/40 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{c.criterion}</span>
                    <span className="text-amber-500">{c.score} ★</span>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">"{c.comment}"</p>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-1">
              <p className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">Self-Reported Achievements:</p>
              <p className="text-slate-600 dark:text-slate-400">{evaluation.achievements}</p>
            </div>
          </div>

          {/* Right Column: Supervisor Scoring Form */}
          <div className="space-y-4">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Overall Supervisor Rating (1 to 5)
              </label>
              <div className="flex items-center gap-2 pt-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSupervisorRating(star)}
                    className="p-1 text-amber-400"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= supervisorRating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="font-bold text-slate-800 dark:text-slate-200 ml-2">
                  {supervisorRating} Stars
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Key Strengths & Commendations <span className="text-rose-500">*</span>
              </label>
              <Textarea
                placeholder="Observed technical depth, punctuality, leadership..."
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                rows={2}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Areas for Development & Training Focus
              </label>
              <Textarea
                placeholder="Skills to improve in next quarterly cycle..."
                value={areasToImprove}
                onChange={(e) => setAreasToImprove(e.target.value)}
                rows={2}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Executive Supervisor Recommendation
              </label>
              <select
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value as any)}
                className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-pink-500"
              >
                <option value="NONE">Standard Retention (No Special Action)</option>
                <option value="REWARD">Performance Bonus / Merit Award</option>
                <option value="PROMOTION">Recommend for Role Promotion</option>
                <option value="TRAINING">Mandatory Upskilling Program</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Supervisor Feedback Summary <span className="text-rose-500">*</span>
              </label>
              <Textarea
                placeholder="Formal feedback notes to be shared with employee..."
                value={supervisorComments}
                onChange={(e) => setSupervisorComments(e.target.value)}
                rows={3}
                required
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={submitMutation.isPending}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#E60076] hover:bg-[#d0006a] text-white"
                disabled={submitMutation.isPending || !strengths.trim() || !supervisorComments.trim()}
              >
                {submitMutation.isPending ? "Submitting..." : "Finalize Appraisal"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

