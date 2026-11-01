"use client";

import React from "react";

import { GraduationCap, Clock, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { UpcomingTrainingSession } from "@/types/hrDashboard";

interface UpcomingTrainingsWidgetProps {
  trainings: UpcomingTrainingSession[];
  onPlanNew?: () => void;
}

export function UpcomingTrainingsWidget({
  trainings,
  onPlanNew,
}: UpcomingTrainingsWidgetProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Upcoming Training Sessions
                </h3>
              </div>
              <p className="text-[11px] text-slate-500">
                Scheduled skill enrichment programs & participant progress
              </p>
            </div>
          </div>

          {onPlanNew && (
            <button
              type="button"
              onClick={onPlanNew}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1"
            >
              <span>+ Plan Session</span>
            </button>
          )}
        </div>

        <div className="mt-3 space-y-3">
          {trainings.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No upcoming trainings scheduled.
            </div>
          ) : (
            trainings.map((session) => {
              const capacityPct = session.maxCapacity
                ? Math.round((session.registeredCount / session.maxCapacity) * 100)
                : 0;

              
return (
                <div
                  key={session.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white">
                        {session.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {session.department ? `${session.department} • ` : ""}
                        Trainer: {session.trainer}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                      {session.date}
                    </Badge>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{session.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="truncate max-w-[150px]">{session.venueOrPlatform}</span>
                    </div>
                    <div className="flex items-center gap-1 ml-auto text-indigo-600 dark:text-indigo-400 font-medium">
                      <Users className="h-3 w-3" />
                      <span>
                        {session.maxCapacity
                          ? `${session.registeredCount} / ${session.maxCapacity} Enrolled`
                          : `${session.registeredCount} Enrolled`}
                      </span>
                    </div>
                  </div>

                  {/* Enrollment progress bar */}
                  {session.maxCapacity && (
                    <div className="mt-2">
                      <Progress value={capacityPct} className="h-1.5" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mt-2">
        <span>Corporate Training Schedule</span>
        <span className="text-indigo-600 hover:underline cursor-pointer">
          View Training Matrix
        </span>
      </div>
    </div>
  );
}
