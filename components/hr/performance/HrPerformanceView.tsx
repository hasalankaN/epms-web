"use client";

import React, { useState } from "react";
import {
  Trophy,
  Award,
  Star,
  Users,
  PlusCircle,
  Search,
  Filter,
  BarChart3,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, type Column } from "@/components/common/table/DataTable";
import { AddReviewModal } from "./AddReviewModal";
import { AssignRewardModal } from "./AssignRewardModal";
import { FeedbackModal } from "./FeedbackModal";
import {
  useMyReviewsQuery,
  useDepartmentPerformanceQuery,
  useRewardsQuery,
} from "@/hooks/api/performance/usePerformance";
import type { PerformanceReviewItem, RewardRecord } from "@/types/dto/performance.dto";

export function HrPerformanceView() {
  const [activeTab, setActiveTab] = useState<"reviews" | "departments" | "rewards" | "feedback">("reviews");
  const [search, setSearch] = useState("");
  const [cycleFilter, setCycleFilter] = useState("ALL");

  // Modals state
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [isRewardOpen, setIsRewardOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Queries
  const { data: reviews = [], isLoading: isReviewsLoading } = useMyReviewsQuery();
  const { data: departments = [], isLoading: isDeptsLoading } = useDepartmentPerformanceQuery();
  const { data: rewards = [], isLoading: isRewardsLoading } = useRewardsQuery();

  const reviewColumns: Column<PerformanceReviewItem>[] = [
    {
      header: "Employee",
      accessorKey: "employeeName",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.employeeName}</p>
          <p className="text-xs text-muted-foreground">{item.employeeCode} • {item.departmentName || "Production"}</p>
        </div>
      ),
    },
    {
      header: "Appraisal Cycle",
      accessorKey: "quarter",
      cell: (item) => (
        <div>
          <span className="font-medium text-sm">{item.quarter}</span>
          <p className="text-xs text-muted-foreground">{item.date}</p>
        </div>
      ),
    },
    {
      header: "Reviewer",
      accessorKey: "reviewerName",
      cell: (item) => <span className="text-sm font-medium">{item.reviewerName}</span>,
    },
    {
      header: "Score",
      accessorKey: "rating",
      cell: (item) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < item.rating
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
          <span className="text-xs font-semibold ml-1">{item.rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      header: "Key Findings & Feedback",
      accessorKey: "comments",
      cell: (item) => (
        <div className="max-w-xs space-y-0.5">
          <p className="text-xs font-medium text-foreground line-clamp-1">{item.comments}</p>
          <p className="text-[11px] text-muted-foreground line-clamp-1">{item.feedback}</p>
        </div>
      ),
    },
    {
      header: "Compensation Impact",
      accessorKey: "compensation",
      cell: (item) => (
        item.compensation ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            {item.compensation}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )
      ),
    },
  ];

  const rewardColumns: Column<RewardRecord>[] = [
    {
      header: "Recipient Employee",
      accessorKey: "employeeName",
      cell: (item) => (
        <div>
          <p className="font-semibold text-foreground">{item.employeeName}</p>
          <p className="text-xs text-muted-foreground">{item.employeeCode} • {item.departmentName}</p>
        </div>
      ),
    },
    {
      header: "Award Category",
      accessorKey: "type",
      cell: (item) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-50 text-[#E60076] dark:bg-pink-950/40 dark:text-pink-300">
          {item.type}
        </span>
      ),
    },
    {
      header: "Amount (LKR)",
      accessorKey: "amount",
      cell: (item) => (
        <span className="font-bold text-sm text-foreground">
          {item.amount ? `Rs. ${item.amount.toLocaleString()}` : "Honorary / Non-cash"}
        </span>
      ),
    },
    {
      header: "Citation / Reason",
      accessorKey: "reason",
      cell: (item) => <p className="text-xs text-muted-foreground max-w-sm line-clamp-2">{item.reason}</p>,
    },
    {
      header: "Date Awarded",
      accessorKey: "date",
      cell: (item) => <span className="text-xs text-muted-foreground">{item.date}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Performance & Rewards Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Oversee corporate appraisals, departmental rankings, 360-degree feedback, and incentive rewards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsFeedbackOpen(true)}
          >
            <MessageSquare className="w-4 h-4" />
            360° Feedback
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsRewardOpen(true)}
          >
            <Award className="w-4 h-4 text-[#E60076]" />
            Assign Reward
          </Button>
          <Button
            className="bg-[#E60076] hover:bg-[#c40064] text-white gap-2"
            onClick={() => setIsAddReviewOpen(true)}
          >
            <PlusCircle className="w-4 h-4" />
            Record Appraisal
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "reviews"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Completed Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab("departments")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "departments"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Departmental Benchmarks ({departments.length})
        </button>
        <button
          onClick={() => setActiveTab("rewards")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "rewards"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Merit & Rewards Portfolio ({rewards.length})
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "feedback"
              ? "border-[#E60076] text-[#E60076]"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          360° Feedback Cycles
        </button>
      </div>

      {/* Tab 1: Reviews */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews by employee name or reviewer..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={cycleFilter}
              onChange={(e) => setCycleFilter(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="ALL">All Cycles</option>
              <option value="2026 Q1">2026 Q1</option>
              <option value="2025 Annual">2025 Annual</option>
            </select>
          </div>

          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={reviewColumns}
              data={reviews}
              isLoading={isReviewsLoading}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      )}

      {/* Tab 2: Departments */}
      {activeTab === "departments" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept, idx) => (
              <div key={dept.departmentId} className="p-5 rounded-xl border bg-card shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      Rank #{idx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mt-1">{dept.departmentName}</h3>
                    <p className="text-xs text-muted-foreground">{dept.headcount} active workers</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-amber-500 font-bold text-lg">
                      <Star className="w-5 h-5 fill-amber-500" />
                      <span>{dept.avgRating.toFixed(1)}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">Avg performance score</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-muted/40">
                    <span className="text-muted-foreground">Attendance Rate</span>
                    <p className="font-semibold text-foreground text-sm mt-0.5">{dept.attendancePct}%</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-muted/40">
                    <span className="text-muted-foreground">Production Target</span>
                    <p className="font-semibold text-foreground text-sm mt-0.5">{dept.productionPct}%</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Top Performers In Department:</p>
                  <div className="space-y-1.5">
                    {dept.rankings.slice(0, 3).map((r) => (
                      <div key={r.employeeId} className="flex justify-between items-center text-xs p-2 rounded bg-muted/20">
                        <span className="font-medium">{r.rank}. {r.employeeName} ({r.employeeCode})</span>
                        <span className="font-bold text-[#E60076]">{r.rating.toFixed(1)} / 5.0</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Rewards */}
      {activeTab === "rewards" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Approved incentive allocations, employee of the month rewards, and spot merit bonuses.
            </p>
          </div>
          <div className="rounded-lg border bg-card shadow-sm">
            <DataTable
              columns={rewardColumns}
              data={rewards}
              isLoading={isRewardsLoading}
              keyExtractor={(item) => item.id}
            />
          </div>
        </div>
      )}

      {/* Tab 4: 360 Feedback */}
      {activeTab === "feedback" && (
        <div className="space-y-4">
          <div className="p-6 rounded-xl border bg-card shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-foreground">Active 360° Peer Feedback Round: 2026 Q1</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Dispatched to factory floor supervisors and shift leads.</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                In Progress (72% Response Rate)
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { name: "Kavinda Perera (EMP-001)", peers: "3 of 3 submitted", status: "Complete", score: 4.8 },
                { name: "Nuwan Disanayake (EMP-002)", peers: "2 of 3 submitted", status: "Awaiting 1 Reviewer", score: 4.5 },
                { name: "Sanduni Jayawardena (EMP-003)", peers: "3 of 3 submitted", status: "Complete", score: 4.7 },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center p-3 rounded-lg border bg-muted/20">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Peer responses: {item.peers}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-amber-500">★ {item.score} Peer Score</span>
                    <p className="text-[11px] text-muted-foreground">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddReviewModal
        open={isAddReviewOpen}
        onOpenChange={setIsAddReviewOpen}
      />

      <AssignRewardModal
        open={isRewardOpen}
        onOpenChange={setIsRewardOpen}
      />

      <FeedbackModal
        open={isFeedbackOpen}
        onOpenChange={setIsFeedbackOpen}
      />
    </div>
  );
}

