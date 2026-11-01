"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { HRDashboardHeader } from "./dashboard/HRDashboardHeader";
import { HRQuickActions } from "./dashboard/HRQuickActions";
import { TodayAttendanceWidget } from "./dashboard/TodayAttendanceWidget";
import { AttendanceIssuesWidget } from "./dashboard/AttendanceIssuesWidget";
import { PendingProfileUpdatesWidget } from "./dashboard/PendingProfileUpdatesWidget";
import { EscalatedLeaveRequestsWidget } from "./dashboard/EscalatedLeaveRequestsWidget";
import { PendingTrainingBudgetsWidget } from "./dashboard/PendingTrainingBudgetsWidget";
import { UpcomingTrainingsWidget } from "./dashboard/UpcomingTrainingsWidget";
import { RecruitmentWidget } from "./dashboard/RecruitmentWidget";
import { EmployeeSummaryWidget } from "./dashboard/EmployeeSummaryWidget";
import { LeaveOverviewWidget } from "./dashboard/LeaveOverviewWidget";
import { RecentNotificationsWidget } from "./dashboard/RecentNotificationsWidget";

import { PlanTrainingModal } from "./dashboard/modals/PlanTrainingModal";
import { CreateVacancyModal } from "./dashboard/modals/CreateVacancyModal";
import { SendNotificationModal } from "./dashboard/modals/SendNotificationModal";
import { GenerateReportsModal } from "./dashboard/modals/GenerateReportsModal";
import { useHrTrainingsQuery } from "@/hooks/api/training/useTraining";
import { useHrVacanciesQuery } from "@/hooks/api/jobs/useJobs";
import { employeeService, type HrEmployeeRecord } from "@/lib/api/employee.service";

import type {
  OpenVacancy,
  RecentNotificationItem,
  ProfileUpdateRequest,
  EscalatedLeaveRequest,
  TrainingBudgetRequest,
  AttendanceIssueEmployee,
  RecruitmentOverview,
  EmployeeSummaryData,
  TodayAttendanceSummary,
  LeaveOverviewData,
} from "@/types/hrDashboard";

export function HRDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Interactive dashboard states (initialized clean, no fake seed data)
  const [profileRequests, setProfileRequests] = useState<ProfileUpdateRequest[]>([]);
  const [escalatedLeaves, setEscalatedLeaves] = useState<EscalatedLeaveRequest[]>([]);
  const [trainingBudgets, setTrainingBudgets] = useState<TrainingBudgetRequest[]>([]);
  const [attendanceIssues, setAttendanceIssues] = useState<AttendanceIssueEmployee[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<RecentNotificationItem[]>([]);
  const [employeeRecords, setEmployeeRecords] = useState<HrEmployeeRecord[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Quick Action Modal states
  const [isPlanTrainingOpen, setIsPlanTrainingOpen] = useState(false);
  const [isCreateVacancyOpen, setIsCreateVacancyOpen] = useState(false);
  const [isSendNotificationOpen, setIsSendNotificationOpen] = useState(false);
  const [isGenerateReportsOpen, setIsGenerateReportsOpen] = useState(false);

  // Fetch HR Trainings from Backend
  const { data: trainingData, refetch: refetchTrainings } = useHrTrainingsQuery({
    page: 1,
    pageSize: 5,
    status: "UPCOMING",
  });

  // Fetch HR Vacancies from Backend
  const { data: hrVacancies = [], refetch: refetchVacancies } = useHrVacanciesQuery();

  // Load real employees from directory
  const loadEmployees = () => {
    employeeService
      .getHrEmployees()
      .then((data) => setEmployeeRecords(data || []))
      .catch(() => setEmployeeRecords([]));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const upcomingTrainings = (trainingData?.items || []).map((training) => ({
    id: training.id,
    title: training.name,
    department: (training as any).department || "Operations",
    date: training.date,
    time: `${training.startTime} - ${training.endTime}`,
    trainer: training.instructors[0] || "Senior Trainer",
    venueOrPlatform: training.venue,
    registeredCount: training.participantsCount || 0,
    maxCapacity: (training as any).maxCapacity || 30,
    status:
      training.status === "COMPLETED"
        ? ("COMPLETED" as const)
        : training.status === "ONGOING"
          ? ("IN_PROGRESS" as const)
          : ("SCHEDULED" as const),
  }));

  const recruitmentOverview: RecruitmentOverview = useMemo(() => {
    const mappedVacancies: OpenVacancy[] = (hrVacancies || []).map((v) => ({
      id: v.id,
      title: v.title,
      department: v.department || "General",
      type: v.employmentType || "Full-Time",
      openings: 1,
      applicationsCount: v.applicantCount || 0,
      upcomingInterviews: 0,
      deadline: v.deadline || v.closingDate || "",
      status: v.isOpen ? "OPEN" : "CLOSING_SOON",
    }));

    return {
      totalOpenVacancies: (hrVacancies || []).filter((v) => v.isOpen).length,
      newApplicationsThisWeek: (hrVacancies || []).reduce(
        (acc, curr) => acc + (curr.applicantCount || 0),
        0
      ),
      interviewsScheduledThisWeek: 0,
      vacancies: mappedVacancies,
    };
  }, [hrVacancies]);

  const employeeSummary: EmployeeSummaryData = useMemo(() => {
    if (employeeRecords.length > 0) {
      const deptMap = new Map<string, number>();
      employeeRecords.forEach((emp) => {
        const d = emp.department || "General";
        deptMap.set(d, (deptMap.get(d) || 0) + 1);
      });

      const depts = Array.from(deptMap.entries()).map(([department, count]) => ({
        department,
        count,
        color: "#E60076",
      }));

      return {
        totalEmployees: employeeRecords.length,
        activeEmployees: employeeRecords.filter((e) => e.status === "ACTIVE").length,
        onProbation: employeeRecords.filter(
          (e) => e.role?.toLowerCase()?.includes("intern") || e.status === "ON_LEAVE"
        ).length,
        contractEmployees: 0,
        departments: depts,
        newJoinersThisMonth: employeeRecords.slice(0, 4).map((e) => ({
          id: e.id,
          name: e.name,
          role: e.position,
          department: e.department,
          avatarInitials: e.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase(),
          joinDate: e.joinDate || "Recent",
        })),
      };
    }

    return {
      totalEmployees: 0,
      activeEmployees: 0,
      onProbation: 0,
      contractEmployees: 0,
      departments: [],
      newJoinersThisMonth: [],
    };
  }, [employeeRecords]);

  const todayAttendance: TodayAttendanceSummary = useMemo(() => {
    const total = employeeRecords.length;
    const active = employeeRecords.filter((e) => e.status === "ACTIVE").length;
    const onLeave = employeeRecords.filter((e) => e.status === "ON_LEAVE").length;

    return {
      date: new Date().toISOString().split("T")[0],
      totalEmployees: total,
      present: active,
      late: 0,
      absent: Math.max(0, total - active - onLeave),
      earlyDeparture: 0,
      onTimeRate: total > 0 ? Math.round((active / total) * 100) : 100,
    };
  }, [employeeRecords]);

  const leaveOverview: LeaveOverviewData = useMemo(() => {
    return {
      onLeaveToday: employeeRecords
        .filter((e) => e.status === "ON_LEAVE")
        .map((e) => ({
          id: e.id,
          employeeName: e.name,
          department: e.department,
          leaveType: "Approved Leave",
          returnDate: "Next Shift",
        })),
      lowBalanceEmployees: [],
    };
  }, [employeeRecords]);

  // Actions
  const handleApproveProfile = (id: string) => {
    setProfileRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "APPROVED" } : req))
    );
    toast.success("Profile update approved.");
  };

  const handleRejectProfile = (id: string) => {
    setProfileRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "REJECTED" } : req))
    );
    toast.info("Profile update rejected.");
  };

  const handleApproveLeave = (id: string) => {
    setEscalatedLeaves((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "APPROVED" } : req))
    );
    toast.success("Escalated leave approved.");
  };

  const handleRejectLeave = (id: string) => {
    setEscalatedLeaves((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "REJECTED" } : req))
    );
    toast.info("Escalated leave rejected.");
  };

  const handleApproveBudget = (id: string) => {
    setTrainingBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "APPROVED" } : b))
    );
    toast.success("Training budget cleared.");
  };

  const handleRejectBudget = (id: string) => {
    setTrainingBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "REJECTED" } : b))
    );
    toast.info("Training budget rejected.");
  };

  const handleNoticeSent = (employeeId: string) => {
    setAttendanceIssues((prev) =>
      prev.map((item) =>
        item.employeeId === employeeId
          ? { ...item, note: "Compliance notice dispatched." }
          : item
      )
    );
    toast.info(`Compliance log updated for ${employeeId}.`);
  };

  const handleVacancyCreated = () => {
    refetchVacancies();
  };

  const handleNotificationSent = (item: RecentNotificationItem) => {
    setRecentNotifications((prev) => [item, ...prev]);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries(),
        refetchTrainings(),
        refetchVacancies(),
      ]);
      loadEmployees();
      toast.success("HR Dashboard refreshed with real-time data.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const pendingProfileCount = profileRequests.filter((r) => r.status === "PENDING").length;
  const pendingLeaveCount = escalatedLeaves.filter((r) => r.status === "PENDING").length;
  const pendingBudgetCount = trainingBudgets.filter((b) => b.status === "PENDING").length;

  const totalActionItems =
    pendingProfileCount + pendingLeaveCount + pendingBudgetCount + attendanceIssues.length;

  return (
    <div className="p-4 md:p-8 space-y-7 max-w-[1500px] mx-auto">
      {/* 1. Header with live status & action counts */}
      <HRDashboardHeader
        totalActionItems={totalActionItems}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 2. Quick Action Buttons */}
      <HRQuickActions
        onPlanTrainingClick={() => setIsPlanTrainingOpen(true)}
        onCreateVacancyClick={() => setIsCreateVacancyOpen(true)}
        onSendNotificationClick={() => setIsSendNotificationOpen(true)}
        onGenerateReportsClick={() => setIsGenerateReportsOpen(true)}
      />

      {/* 3. Primary Approvals & Requests (Priority HR Action Items) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <PendingProfileUpdatesWidget
          requests={profileRequests}
          onApprove={handleApproveProfile}
          onReject={handleRejectProfile}
        />

        <EscalatedLeaveRequestsWidget
          requests={escalatedLeaves}
          onApprove={handleApproveLeave}
          onReject={handleRejectLeave}
        />

        <PendingTrainingBudgetsWidget
          budgets={trainingBudgets}
          onApprove={handleApproveBudget}
          onReject={handleRejectBudget}
        />
      </div>

      {/* 4. Attendance Operations & Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TodayAttendanceWidget
          attendance={todayAttendance}
          onViewDetails={() => router.push("/hr-panel/attendance")}
        />

        <AttendanceIssuesWidget
          issues={attendanceIssues}
          onNoticeSent={handleNoticeSent}
        />
      </div>

      {/* 5. Talent, Development & Vacancies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <UpcomingTrainingsWidget
          trainings={upcomingTrainings}
          onPlanNew={() => setIsPlanTrainingOpen(true)}
        />

        <RecruitmentWidget
          recruitment={recruitmentOverview}
          onCreateVacancy={() => setIsCreateVacancyOpen(true)}
        />
      </div>

      {/* 6. Workforce Summary, Leave Balances & Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <EmployeeSummaryWidget
          data={employeeSummary}
          onViewDirectory={() => router.push("/hr-panel/employees")}
        />

        <LeaveOverviewWidget
          data={leaveOverview}
          onTrackBalances={() => router.push("/hr-panel/attendance")}
        />

        <RecentNotificationsWidget
          notifications={recentNotifications}
          onSendNew={() => setIsSendNotificationOpen(true)}
        />
      </div>

      {/* Modals for Quick Actions & Workflows */}
      <PlanTrainingModal
        open={isPlanTrainingOpen}
        onOpenChange={setIsPlanTrainingOpen}
      />
      <CreateVacancyModal
        open={isCreateVacancyOpen}
        onOpenChange={setIsCreateVacancyOpen}
        onVacancyCreated={handleVacancyCreated}
      />
      <SendNotificationModal
        open={isSendNotificationOpen}
        onOpenChange={setIsSendNotificationOpen}
        onNotificationSent={handleNotificationSent}
      />
      <GenerateReportsModal
        open={isGenerateReportsOpen}
        onOpenChange={setIsGenerateReportsOpen}
      />
    </div>
  );
}

export default HRDashboard;
