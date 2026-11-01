"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useSubmitTrainingEvaluationMutation } from "@/hooks/api/training/useTraining";
import type { TrainingItem } from "@/types/dto/training.dto";

interface TrainingEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: TrainingItem | null;
}

export function TrainingEvaluationModal({
  isOpen,
  onClose,
  training,
}: TrainingEvaluationModalProps) {
  const [rating, setRating] = useState(5);
  const [whatWentWell, setWhatWentWell] = useState("");
  const [whatCanImprove, setWhatCanImprove] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(true);

  const evaluationMutation = useSubmitTrainingEvaluationMutation();

  if (!training) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatWentWell.trim()) return;

    evaluationMutation.mutate(
      {
        trainingId: training.id,
        rating,
        whatWentWell,
        whatCanImprove,
        wouldRecommend,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
            Post-Training Feedback & Evaluation
          </DialogTitle>
          <p className="text-xs text-slate-500">{training.name}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          {/* Star Rating */}
          <div className="space-y-1 text-center py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Overall Content & Instructor Quality:
            </span>
            <div className="flex items-center justify-center gap-1 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-400">Score: {rating} of 5 Stars</span>
          </div>

          {/* What went well */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              What went well? <span className="text-rose-500">*</span>
            </label>
            <Textarea
              placeholder="Key insights, practical exercises, good presentation points..."
              value={whatWentWell}
              onChange={(e) => setWhatWentWell(e.target.value)}
              rows={2}
              required
              className="text-xs"
            />
          </div>

          {/* What can improve */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              What could be improved?
            </label>
            <Textarea
              placeholder="Session pacing, audio quality, more code samples..."
              value={whatCanImprove}
              onChange={(e) => setWhatCanImprove(e.target.value)}
              rows={2}
              className="text-xs"
            />
          </div>

          {/* Recommend */}
          <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-lg">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Would you recommend this course to team peers?
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="recommend"
                  checked={wouldRecommend}
                  onChange={() => setWouldRecommend(true)}
                  className="accent-pink-600"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="recommend"
                  checked={!wouldRecommend}
                  onChange={() => setWouldRecommend(false)}
                  className="accent-pink-600"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={evaluationMutation.isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#E60076] hover:bg-[#d0006a] text-white"
              disabled={evaluationMutation.isPending || !whatWentWell.trim()}
            >
              {evaluationMutation.isPending ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

