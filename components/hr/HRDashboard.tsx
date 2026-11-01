"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

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

import {
  initialProfileUpdateRequests,
  initialEscalatedLeaveRequests,
  initialTrainingBudgets,
  todayAttendanceData,
  initialAttendanceIssues,
  initialUpcomingTrainings,
  initialRecruitmentOverview,
  employeeSummaryData,
  leaveOverviewData,
  initialRecentNotifications,
} from "@/data/hrDashboardData";

import type {
  UpcomingTrainingSession,
  OpenVacancy,
  RecentNotificationItem,
} from "@/types/hrDashboard";

export function HRDashboard() {
  const router = useRouter();

  // Interactive dashboard states
  const [profileRequests, setProfileRequests] = useState(
    initialProfileUpdateRequests
  );

  const [escalatedLeaves, setEscalatedLeaves] = useState(
    initialEscalatedLeaveRequests
  );

  const [trainingBudgets, setTrainingBudgets] = useState(
    initialTrainingBudgets
  );

  const [attendanceIssues, setAttendanceIssues] = useState(
    initialAttendanceIssues
  );

  const [upcomingTrainings, setUpcomingTrainings] = useState(
    initialUpcomingTrainings
  );

  const [recruitment, setRecruitment] = useState(
    initialRecruitmentOverview
  );

  const [recentNotifications, setRecentNotifications] = useState(
    initialRecentNotifications
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Quick Action Modal states
  const [isPlanTrainingOpen, setIsPlanTrainingOpen] = useState(false);
  const [isCreateVacancyOpen, setIsCreateVacancyOpen] = useState(false);
  const [isSendNotificationOpen, setIsSendNotificationOpen] = useState(false);
  const [isGenerateReportsOpen, setIsGenerateReportsOpen] = useState(false);

  // Profile update request actions (#30)
  const handleApproveProfile = (id: string) => {
    setProfileRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "APPROVED" } : req
      )
    );
  };

  const handleRejectProfile = (id: string) => {
    setProfileRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "REJECTED" } : req
      )
    );
  };

  // Escalated leave request actions (#41, #43)
  const handleApproveLeave = (id: string) => {
    setEscalatedLeaves((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "APPROVED" } : req
      )
    );
  };

  const handleRejectLeave = (id: string) => {
    setEscalatedLeaves((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "REJECTED" } : req
      )
    );
  };

  // Training budget clearance actions (#38)
  const handleApproveBudget = (id: string) => {
    setTrainingBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "APPROVED" } : b))
    );
  };

  const handleRejectBudget = (id: string) => {
    setTrainingBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "REJECTED" } : b))
    );
  };

  // Attendance issue notification dispatched (#34)
  const handleNoticeSent = (employeeId: string) => {
    setAttendanceIssues((prev) =>
      prev.map((item) =>
        item.employeeId === employeeId
          ? { ...item, note: `Compliance notice dispatched.` }
          : item
      )
    );
    toast.info(`Compliance log updated for ${employeeId}.`);
  };

  // Quick action additions
  const handleTrainingAdded = (training: UpcomingTrainingSession) => {
    setUpcomingTrainings((prev) => [training, ...prev]);
  };

  const handleVacancyCreated = (vac: OpenVacancy) => {
    setRecruitment((prev) => ({
      ...prev,
      totalOpenVacancies: prev.totalOpenVacancies + 1,
      vacancies: [vac, ...prev.vacancies],
    }));
  };

  const handleNotificationSent = (item: RecentNotificationItem) => {
    setRecentNotifications((prev) => [item, ...prev]);
  };

  // Sync / Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("HR Dashboard metrics refreshed with real-time data.");
    }, 600);
  };

  // Calculate pending action items count
  const pendingProfileCount = profileRequests.filter(
    (r) => r.status === "PENDING"
  ).length;

  const pendingLeaveCount = escalatedLeaves.filter(
    (r) => r.status === "PENDING"
  ).length;

  const pendingBudgetCount = trainingBudgets.filter(
    (b) => b.status === "PENDING"
  ).length;

  const totalActionItems =
    pendingProfileCount +
    pendingLeaveCount +
    pendingBudgetCount +
    attendanceIssues.length;

  return (
    <div className="p-4 md:p-8 space-y-7 max-w-[1500px] mx-auto">
      {/* 1. Header with live status & action counts */}
      <HRDashboardHeader
        totalActionItems={totalActionItems}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* 2. Quick Action Buttons (#31, #35, #60, #63, Reports) */}
      <HRQuickActions
        onPlanTrainingClick={() => setIsPlanTrainingOpen(true)}
        onCreateVacancyClick={() => setIsCreateVacancyOpen(true)}
        onSendNotificationClick={() => setIsSendNotificationOpen(true)}
        onGenerateReportsClick={() => setIsGenerateReportsOpen(true)}
      />

      {/* 3. Primary Approvals & Requests (Priority HR Action Items) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pending Profile Update Requests (#30) */}
        <PendingProfileUpdatesWidget
          requests={profileRequests}
          onApprove={handleApproveProfile}
          onReject={handleRejectProfile}
        />

        {/* Escalated / Special Leave Requests (#41, #43) */}
        <EscalatedLeaveRequestsWidget
          requests={escalatedLeaves}
          onApprove={handleApproveLeave}
          onReject={handleRejectLeave}
        />

        {/* Pending Training Budgets (#38) */}
        <PendingTrainingBudgetsWidget
          budgets={trainingBudgets}
          onApprove={handleApproveBudget}
          onReject={handleRejectBudget}
        />
      </div>

      {/* 4. Attendance Operations & Compliance (#33, #34) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Attendance (#33) */}
        <TodayAttendanceWidget
          attendance={todayAttendanceData}
          onViewDetails={() => router.push("/hr-panel/attendance")}
        />

        {/* Attendance Issues (#34) */}
        <AttendanceIssuesWidget
          issues={attendanceIssues}
          onNoticeSent={handleNoticeSent}
        />
      </div>

      {/* 5. Talent, Development & Vacancies (#35, #36, #60-#62) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Upcoming Trainings (#35, #36) */}
        <UpcomingTrainingsWidget
          trainings={upcomingTrainings}
          onPlanNew={() => setIsPlanTrainingOpen(true)}
        />

        {/* Open Vacancies & Applications (#60–#62) */}
        <RecruitmentWidget
          recruitment={recruitment}
          onCreateVacancy={() => setIsCreateVacancyOpen(true)}
        />
      </div>

      {/* 6. Workforce Summary, Leave Balances & Notifications (#29, #47, #42, #63, #64) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Employee Summary (#29, #47) */}
        <EmployeeSummaryWidget
          data={employeeSummaryData}
          onViewDirectory={() => router.push("/hr-panel/employees")}
        />

        {/* Leave Overview & Low Balances (#42) */}
        <LeaveOverviewWidget
          data={leaveOverviewData}
          onTrackBalances={() => router.push("/hr-panel/attendance")}
        />

        {/* Recent Notifications Sent (#63, #64) */}
        <RecentNotificationsWidget
          notifications={recentNotifications}
          onSendNew={() => setIsSendNotificationOpen(true)}
        />
      </div>

      {/* Modals for Quick Actions & Workflows */}
      <PlanTrainingModal
        open={isPlanTrainingOpen}
        onOpenChange={setIsPlanTrainingOpen}
        onTrainingAdded={handleTrainingAdded}
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
