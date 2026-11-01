"use client";

import React from "react";

import { Briefcase } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { RecruitmentOverview } from "@/types/hrDashboard";

interface RecruitmentWidgetProps {
  recruitment: RecruitmentOverview;
  onCreateVacancy?: () => void;
}

export function RecruitmentWidget({
  recruitment,
  onCreateVacancy,
}: RecruitmentWidgetProps) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Open Vacancies & Applications
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 font-semibold">
                  #60–#62
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Talent pipeline, candidate screening & interview schedules
              </p>
            </div>
          </div>

          {onCreateVacancy && (
            <button
              type="button"
              onClick={onCreateVacancy}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium inline-flex items-center gap-1"
            >
              <span>+ Post Job</span>
            </button>
          )}
        </div>

        {/* 3 Metric counters */}
        <div className="grid grid-cols-3 gap-2.5 mt-3">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
              Open Jobs
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
              {recruitment.totalOpenVacancies}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
              New Resumes
            </span>
            <span className="text-lg font-bold text-teal-600 dark:text-teal-400 font-mono">
              +{recruitment.newApplicationsThisWeek}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
              Interviews
            </span>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono">
              {recruitment.interviewsScheduledThisWeek}
            </span>
          </div>
        </div>

        {/* Vacancies list */}
        <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
          {recruitment.vacancies.slice(0, 3).map((job) => (
            <div
              key={job.id}
              className="py-2.5 flex items-center justify-between gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {job.title}
                  </span>
                  <Badge
                    variant={
                      job.status === "CLOSING_SOON"
                        ? "destructive"
                        : job.status === "INTERVIEWING"
                        ? "secondary"
                        : "outline"
                    }
                    className="text-[10px] py-0 px-1 font-normal"
                  >
                    {job.status.replace("_", " ")}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span>{job.department}</span>
                  <span>•</span>
                  <span>{job.openings} Openings</span>
                  <span>•</span>
                  <span>Deadline: {job.deadline}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
                  {job.applicationsCount} Candidates
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block font-medium">
                  {job.upcomingInterviews} Scheduled
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between mt-2">
        <span>Vacancy, Candidates, Interviews (#60–#62)</span>
        <span className="text-teal-600 hover:underline cursor-pointer">
          Applicant Tracking System (ATS)
        </span>
      </div>
    </div>
  );
}
