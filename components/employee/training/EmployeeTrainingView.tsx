"use client";

import React, { useState } from "react";
import { GraduationCap, Calendar, Clock, MapPin, Users, CheckCircle, FileText, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TrainingDetailDrawer } from "./TrainingDetailDrawer";
import { TrainingEvaluationModal } from "./TrainingEvaluationModal";
import { useMyTrainingsQuery } from "@/hooks/api/training/useTraining";
import type { TrainingItem } from "@/types/dto/training.dto";

export function EmployeeTrainingView() {
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "COMPLETED">("UPCOMING");
  const [selectedTraining, setSelectedTraining] = useState<TrainingItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEvalOpen, setIsEvalOpen] = useState(false);

  const { data: trainingsData, isLoading } = useMyTrainingsQuery({
    status: activeTab,
  });

  const list = trainingsData?.items || [];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("UPCOMING")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "UPCOMING"
              ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Upcoming Training Sessions</span>
        </button>
        <button
          onClick={() => setActiveTab("COMPLETED")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "COMPLETED"
              ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          <span>Completed & Feedback</span>
        </button>
      </div>

      {/* Training Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200/60">
                  {item.mode}
                </span>
                <StatusBadge status={item.status} />
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Calendar className="h-3.5 w-3.5 text-pink-600" />
                  <span>{item.date} · {item.startTime} - {item.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-pink-600" />
                  <span className="truncate">{item.venue}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  <span>Instructors: {item.instructors.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Bottom Row Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-400">
                Attendance: <strong className="text-slate-700 dark:text-slate-300">{item.attendanceStatus}</strong>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTraining(item);
                    setIsDetailOpen(true);
                  }}
                  className="h-8 text-xs"
                >
                  Details & Materials
                </Button>

                {activeTab === "COMPLETED" && (
                  <Button
                    size="sm"
                    disabled={item.hasEvaluated}
                    onClick={() => {
                      setSelectedTraining(item);
                      setIsEvalOpen(true);
                    }}
                    className={`h-8 text-xs gap-1 font-semibold ${
                      item.hasEvaluated
                        ? "bg-slate-100 text-slate-400 border border-slate-200"
                        : "bg-[#E60076] hover:bg-[#d0006a] text-white"
                    }`}
                  >
                    <Star className="h-3.5 w-3.5" />
                    {item.hasEvaluated ? "Evaluated" : "Evaluate"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {list.length === 0 && !isLoading && (
          <div className="col-span-2 py-16 text-center space-y-2 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <GraduationCap className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-xs font-semibold text-slate-500">
              No {activeTab.toLowerCase()} training programs currently listed.
            </p>
          </div>
        )}
      </div>

      <TrainingDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedTraining(null);
        }}
        training={selectedTraining}
      />

      <TrainingEvaluationModal
        isOpen={isEvalOpen}
        onClose={() => {
          setIsEvalOpen(false);
          setSelectedTraining(null);
        }}
        training={selectedTraining}
      />
    </div>
  );
}

