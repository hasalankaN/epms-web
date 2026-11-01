"use client";

import React, { useState } from "react";
import { Briefcase, Calendar, CheckCircle2, Building2, Users, AlertCircle, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { JobDetailDrawer } from "./JobDetailDrawer";
import {
  useJobPostingsQuery,
  useMyApplicationsQuery,
  useCancelApplicationMutation,
} from "@/hooks/api/jobs/useJobs";
import type { JobPosting, JobApplication } from "@/types/dto/job.dto";

export function EmployeeJobsView() {
  const [activeTab, setActiveTab] = useState<"vacancies" | "applications">("vacancies");
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: vacancies = [] } = useJobPostingsQuery();
  const { data: myApplications = [] } = useMyApplicationsQuery();
  const cancelMutation = useCancelApplicationMutation();

  const appliedJobIds = new Set(myApplications.map((a) => a.jobId));

  const applicationColumns: Column<JobApplication>[] = [
    {
      header: "Opportunity",
      cell: (item) => (
        <div>
          <p className="font-bold text-xs text-slate-900 dark:text-white">{item.jobTitle}</p>
          <p className="text-[11px] text-slate-400">{item.department}</p>
        </div>
      ),
    },
    {
      header: "Applied On",
      cell: (item) => <span className="text-xs text-slate-500">{item.appliedDate}</span>,
    },
    {
      header: "Application Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Interview Schedule",
      cell: (item) => {
        if (item.interviewDate) {
          return (
            <div className="text-xs font-semibold text-pink-600 dark:text-pink-400">
              {item.interviewDate} at {item.interviewTime}
            </div>
          );
        }
        return <span className="text-xs text-slate-400">—</span>;
      },
    },
    {
      header: "Action",
      cell: (item) =>
        item.status === "APPLIED" ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => cancelMutation.mutate(item.id)}
            disabled={cancelMutation.isPending}
            className="h-7 text-xs text-rose-600 hover:text-rose-700"
          >
            Cancel
          </Button>
        ) : (
          <span className="text-[11px] text-slate-400">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("vacancies")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "vacancies"
              ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Open Internal Vacancies ({vacancies.filter((v) => v.isOpen).length})</span>
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === "applications"
              ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>My Applications ({myApplications.length})</span>
        </button>
      </div>

      {/* Vacancies Tab */}
      {activeTab === "vacancies" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vacancies.map((job) => {
            const hasApplied = appliedJobIds.has(job.id);
            return (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200/60">
                      {job.department}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        job.isOpen
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {job.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {job.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Deadline: <strong className="text-rose-600">{job.closingDate}</strong></span>
                    <span>{job.applicantCount} internal applicant{job.applicantCount === 1 ? "" : "s"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedJob(job);
                      setIsDrawerOpen(true);
                    }}
                    className={`h-8 text-xs font-semibold gap-1.5 ${
                      hasApplied
                        ? "bg-slate-100 text-slate-500 border border-slate-200"
                        : "bg-[#E60076] hover:bg-[#d0006a] text-white"
                    }`}
                  >
                    {hasApplied ? "View Details (Applied)" : "View & Apply"}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <DataTable
            data={myApplications}
            columns={applicationColumns}
            keyExtractor={(item) => item.id}
          />
        </div>
      )}

      <JobDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        hasApplied={selectedJob ? appliedJobIds.has(selectedJob.id) : false}
      />
    </div>
  );
}

