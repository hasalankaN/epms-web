"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Users,
  Calendar,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { CreateVacancyModal } from "./CreateVacancyModal";
import { ScheduleInterviewModal } from "./ScheduleInterviewModal";
import {
  useHrVacanciesQuery,
  useHrCandidatesQuery,
  useInterviewsQuery,
  useUpdateCandidateStatusMutation,
} from "@/hooks/api/jobs/useJobs";
import type { JobPosting, JobApplication, InterviewSchedule, ApplicationStatus } from "@/types/dto/job.dto";

export function HrRecruitmentView() {
  const [activeTab, setActiveTab] = useState<"vacancies" | "candidates" | "interviews">("vacancies");
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");

  // Modals state
  const [isVacancyOpen, setIsVacancyOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<JobApplication | null>(null);

  // Queries
  const { data: vacancies = [], isLoading: isVacanciesLoading } = useHrVacanciesQuery();
  const { data: candidates = [], isLoading: isCandidatesLoading } = useHrCandidatesQuery();
  const { data: interviews = [], isLoading: isInterviewsLoading } = useInterviewsQuery();

  const updateStageMutation = useUpdateCandidateStatusMutation();

  const handleStageChange = (id: string, status: ApplicationStatus) => {
    updateStageMutation.mutate({ id, status });
  };

  const vacancyColumns: Column<JobPosting>[] = [
    {
      header: "Position / Vacancy",
      accessorKey: "title",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.department} • {item.position}</p>
        </div>
      ),
    },
    {
      header: "Posted Date",
      accessorKey: "postedDate",
      cell: (item) => <span className="text-xs text-muted-foreground">{item.postedDate}</span>,
    },
    {
      header: "Application Deadline",
      accessorKey: "closingDate",
      cell: (item) => <span className="text-xs font-medium">{item.closingDate}</span>,
    },
    {
      header: "Total Candidates",
      accessorKey: "applicantCount",
      cell: (item) => (
        <span className="font-semibold text-sm px-2.5 py-0.5 rounded bg-muted">
          {item.applicantCount} applicants
        </span>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
  ];

  const candidateColumns: Column<JobApplication>[] = [
    {
      header: "Candidate Name",
      accessorKey: "candidateName",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.candidateName}</p>
          <p className="text-xs text-muted-foreground">{item.candidatePhone || item.candidateEmail || "Internal Candidate"}</p>
        </div>
      ),
    },
    {
      header: "Applied Position",
      accessorKey: "jobTitle",
      cell: (item) => (
        <div>
          <p className="text-sm font-medium">{item.jobTitle}</p>
          <p className="text-xs text-muted-foreground">{item.department}</p>
        </div>
      ),
    },
    {
      header: "Application Date",
      accessorKey: "appliedDate",
      cell: (item) => <span className="text-xs text-muted-foreground">{item.appliedDate}</span>,
    },
    {
      header: "Current Stage",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      header: "Recruitment Actions",
      accessorKey: "id",
      cell: (item) => (
        <div className="flex items-center gap-1.5">
          <select
            value={item.status}
            onChange={(e) => handleStageChange(item.id, e.target.value as ApplicationStatus)}
            className="h-8 px-2 rounded border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="APPLIED">Applied</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="SELECTED">Selected</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {item.status === "SHORTLISTED" && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs text-[#E60076]"
              onClick={() => {
                setSelectedCandidate(item);
                setIsScheduleOpen(true);
              }}
            >
              Interview
            </Button>
          )}
        </div>
      ),
    },
  ];

  const interviewColumns: Column<InterviewSchedule>[] = [
    {
      header: "Candidate",
      accessorKey: "candidateName",
      cell: (item) => <span className="font-semibold text-foreground text-sm">{item.candidateName}</span>,
    },
    {
      header: "Job Role",
      accessorKey: "vacancyTitle",
      cell: (item) => <span className="text-xs font-medium">{item.vacancyTitle}</span>,
    },
    {
      header: "Scheduled Time",
      accessorKey: "dateTime",
      cell: (item) => (
        <span className="text-xs font-semibold text-[#E60076]">
          {new Date(item.dateTime).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Interviewer",
      accessorKey: "interviewerName",
      cell: (item) => <span className="text-xs text-muted-foreground">{item.interviewerName}</span>,
    },
    {
      header: "Interview Status",
      accessorKey: "status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Recruitment & Talent Acquisition
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage factory vacancies, candidate screening pipeline, interview slots and selection decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="bg-[#E60076] hover:bg-[#c40064] text-white gap-2"
            onClick={() => setIsVacancyOpen(true)}
          >
            <PlusCircle className="w-4 h-4" />
            Post New Vacancy
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("vacancies")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "vacancies"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Job Vacancies ({vacancies.length})
        </button>
        <button
          onClick={() => setActiveTab("candidates")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "candidates"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Applicants Pipeline ({candidates.length})
        </button>
        <button
          onClick={() => setActiveTab("interviews")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "interviews"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Interview Schedules ({interviews.length})
        </button>
      </div>

      {/* Tab 1: Vacancies */}
      {activeTab === "vacancies" && (
        <div className="space-y-4">
          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={vacancyColumns}
              data={vacancies}
              isLoading={isVacanciesLoading}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Candidates */}
      {activeTab === "candidates" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates by name or position..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">All Stages</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="INTERVIEW">Interview Scheduled</option>
              <option value="SELECTED">Selected / Hired</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={candidateColumns}
              data={candidates}
              isLoading={isCandidatesLoading}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      )}

      {/* Tab 3: Interviews */}
      {activeTab === "interviews" && (
        <div className="space-y-4">
          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={interviewColumns}
              data={interviews}
              isLoading={isInterviewsLoading}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateVacancyModal
        open={isVacancyOpen}
        onOpenChange={setIsVacancyOpen}
      />

      <ScheduleInterviewModal
        open={isScheduleOpen}
        onOpenChange={setIsScheduleOpen}
        application={selectedCandidate}
      />
    </div>
  );
}

