"use client";

import React, { useState } from "react";
import { Star, Award, CheckCircle2, Clock, Calendar, ShieldAlert, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import {
  useCurrentSelfEvaluationQuery,
  useMyReviewsQuery,
  useSaveSelfEvaluationMutation,
} from "@/hooks/api/performance/usePerformance";
import type { PerformanceReviewItem, CriterionRating } from "@/types/dto/performance.dto";

export function EmployeePerformanceView() {
  const [activeTab, setActiveTab] = useState<"self" | "reviews">("self");
  const { data: currentEval } = useCurrentSelfEvaluationQuery();
  const { data: reviews = [] } = useMyReviewsQuery();
  const saveMutation = useSaveSelfEvaluationMutation();

  const [criteria, setCriteria] = useState<CriterionRating[]>([]);
  const [achievements, setAchievements] = useState("");
  const [goals, setGoals] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);

  // Sync state once data loads
  if (currentEval && !hasInitialized) {
    setCriteria(currentEval.criteria || []);
    setAchievements(currentEval.achievements || "");
    setGoals(currentEval.goals || "");
    setHasInitialized(true);
  }

  const isReadOnly = currentEval?.status !== "DRAFT";

  // Auto compute overall rating average
  const computedAverage = criteria.length
    ? (criteria.reduce((acc, c) => acc + c.score, 0) / criteria.length).toFixed(1)
    : "0.0";

  const handleScoreChange = (index: number, newScore: number) => {
    if (isReadOnly) return;
    const copy = [...criteria];
    copy[index].score = newScore;
    setCriteria(copy);
  };

  const handleCommentChange = (index: number, newComment: string) => {
    if (isReadOnly) return;
    const copy = [...criteria];
    copy[index].comment = newComment;
    setCriteria(copy);
  };

  const handleSave = (isSubmit: boolean) => {
    saveMutation.mutate({
      payload: {
        criteria,
        achievements,
        goals,
        overallRating: parseFloat(computedAverage),
      },
      isSubmit,
    });
  };

  const reviewColumns: Column<PerformanceReviewItem>[] = [
    {
      header: "Evaluation Period",
      cell: (item) => (
        <div>
          <p className="font-bold text-xs text-slate-900 dark:text-white">{item.quarter}</p>
          <p className="text-[11px] text-slate-400">{item.date}</p>
        </div>
      ),
    },
    {
      header: "Reviewer",
      cell: (item) => <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.reviewerName}</span>,
    },
    {
      header: "Final Rating",
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-xs text-slate-900 dark:text-white">{item.rating.toFixed(1)}</span>
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.round(item.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      header: "Supervisor Comments",
      cell: (item) => (
        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate" title={item.comments}>
          {item.comments}
        </p>
      ),
    },
    {
      header: "Reward / Recognition",
      cell: (item) => (
        <span className="text-xs font-semibold text-[#E60076]">
          {item.compensation || "Standard Merit"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("self")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "self"
              ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Star className="h-4 w-4" />
          <span>Self Appraisal Form</span>
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "reviews"
              ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Award className="h-4 w-4" />
          <span>Formal Review Archive ({reviews.length})</span>
        </button>
      </div>

      {activeTab === "self" && currentEval && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {currentEval.period} Appraisal Cycle
                </h2>
                <StatusBadge status={currentEval.status} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Submission Deadline: <strong className="text-rose-600">{currentEval.deadline}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/50 p-3 rounded-xl">
              <div>
                <p className="text-[10px] uppercase font-bold text-pink-600 dark:text-pink-400">
                  Overall Self Score (Auto)
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {computedAverage} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
                </p>
              </div>
            </div>
          </div>

          {/* Criteria Evaluation List */}
          <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Core Performance Criteria & Competencies
            </h3>

            <div className="space-y-5">
              {criteria.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-slate-100 dark:border-slate-800/80 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {idx + 1}. {item.criterion}
                    </span>

                    {/* 1-5 selector */}
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          disabled={isReadOnly}
                          onClick={() => handleScoreChange(idx, star)}
                          className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                            item.score === star
                              ? "bg-[#E60076] text-white shadow-sm"
                              : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-pink-400"
                          }`}
                        >
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Textarea
                    placeholder="Provide specific examples, deliverables, or metrics supporting this rating..."
                    value={item.comment}
                    disabled={isReadOnly}
                    onChange={(e) => handleCommentChange(idx, e.target.value)}
                    rows={2}
                    className="text-xs bg-white dark:bg-slate-900"
                  />
                </div>
              ))}
            </div>

            {/* Achievements & Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Key Achievements & Major Deliverables
                </label>
                <Textarea
                  placeholder="Outline projects delivered, bugs fixed, mentoring initiatives completed..."
                  value={achievements}
                  disabled={isReadOnly}
                  onChange={(e) => setAchievements(e.target.value)}
                  rows={4}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Goals & Growth Focus for Next Period
                </label>
                <Textarea
                  placeholder="Certifications, new technical competencies, leadership skills..."
                  value={goals}
                  disabled={isReadOnly}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={4}
                  className="text-xs"
                />
              </div>
            </div>

            {/* Supervisor feedback (if finalized/reviewed) */}
            {currentEval.supervisorFeedback && (
              <div className="rounded-xl border border-pink-200 dark:border-pink-900 bg-pink-50/40 dark:bg-pink-950/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-pink-700 dark:text-pink-300">
                    Supervisor Feedback & Review Notes
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Supervisor Rating: {currentEval.supervisorRating} / 5.0
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">{currentEval.supervisorFeedback}</p>
                {currentEval.recommendation && (
                  <p className="text-[11px] font-semibold text-pink-600 dark:text-pink-400">
                    Recommendation: {currentEval.recommendation}
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {!isReadOnly && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  onClick={() => handleSave(false)}
                  disabled={saveMutation.isPending}
                  className="text-xs font-semibold"
                >
                  Save Draft
                </Button>
                <Button
                  onClick={() => handleSave(true)}
                  disabled={saveMutation.isPending}
                  className="bg-[#E60076] hover:bg-[#d0006a] text-white text-xs font-semibold"
                >
                  {saveMutation.isPending ? "Submitting..." : "Submit to Supervisor"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <DataTable
            data={reviews}
            columns={reviewColumns}
            keyExtractor={(item) => item.id}
          />
        </div>
      )}
    </div>
  );
}

