"use client";

import React from "react";

import { useRouter } from "next/navigation";

import { ChevronLeft, User, FileText, Settings } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSession } from "@/components/providers/SessionProvider";
import { useGetLecturerProfile } from "@/hooks/api/lecturers/useGetLecturerProfile";
import { useGetLecturerDashboard } from "@/hooks/api/lecturers/useGetLecturerDashboard";

// Profile Components
import { AccountDetailsSection } from "@/components/lecturer-panel/profile/AccountDetailsSection";
import { SalaryHistorySection } from "@/components/lecturer-panel/profile/SalaryHistorySection";
import { SettingsSection } from "@/components/lecturer-panel/profile/SettingsSection";

export default function ProfilePage() {
  const router = useRouter();
  const session = useSession();
  
  const { data: lecturerProfile } = useGetLecturerProfile();
  const { data: dashboardData, isLoading: isAssignmentsLoading } = useGetLecturerDashboard();

  // Map real API data to component format
  const assignedCourses = dashboardData?.courses.map(course => ({
    name: course.name,
    category: course.categoryName || ""
  })) || [];

  const assignedBatches = dashboardData?.batches.map(batch => ({
    name: batch.name,
    category: batch.categoryName || ""
  })) || [];

  const salaryRecords = [
    { id: "1", paidDate: "2026/01/21", description: "November Salary", status: "Pending" as const, amount: "XXXX.00" },
    { id: "2", paidDate: "2026/01/21", description: "October Salary", status: "Paid" as const, amount: "XXXX.00" },
    { id: "3", paidDate: "2026/01/21", description: "September Salary", status: "Paid" as const, amount: "XXXX.00" },
    { id: "4", paidDate: "2026/01/21", description: "August Salary", status: "Paid" as const, amount: "XXXX.00" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-white px-6 py-4 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 rounded-[8px] border border-[#E2E8F0] shadow-sm hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-[#0F172B]" />
        </button>
        <h2 className="text-[24px] font-bold text-[#0F172B]">Profile</h2>
      </div>

      <Tabs defaultValue="account" className="w-full">
        <div className="mb-6">
          <TabsList className="h-10 w-auto inline-flex items-center justify-start rounded-[10px] bg-[#F1F5F9] p-1 gap-1">
            <TabsTrigger
              value="account"
              className={cn(
                "h-8 px-5 rounded-[8px] text-[13px] font-medium transition-all gap-2",
                "data-[state=active]:bg-white data-[state=active]:text-[#1D293D] data-[state=active]:shadow-sm",
                "text-[#64748B]"
              )}
            >
              <User className="w-3.5 h-3.5" />
              Account
            </TabsTrigger>
            <TabsTrigger
              value="salary"
              className={cn(
                "h-8 px-5 rounded-[8px] text-[13px] font-medium transition-all gap-2",
                "data-[state=active]:bg-white data-[state=active]:text-[#1D293D] data-[state=active]:shadow-sm",
                "text-[#64748B]"
              )}
            >
              <FileText className="w-3.5 h-3.5" />
              Salary History
            </TabsTrigger>
            <TabsTrigger
              value="setting"
              className={cn(
                "h-8 px-5 rounded-[8px] text-[13px] font-medium transition-all gap-2",
                "data-[state=active]:bg-white data-[state=active]:text-[#1D293D] data-[state=active]:shadow-sm",
                "text-[#64748B]"
              )}
            >
              <Settings className="w-3.5 h-3.5" />
              Setting
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="account">
          <AccountDetailsSection 
            initialData={lecturerProfile} 
            session={session} 
            assignedCourses={assignedCourses}
            assignedBatches={assignedBatches}
            isLoadingAssignments={isAssignmentsLoading}
          />
        </TabsContent>

        <TabsContent value="salary">
          <SalaryHistorySection 
            salaryType="Monthly Salary"
            salaryRecords={salaryRecords}
          />
        </TabsContent>

        <TabsContent value="setting">
          <SettingsSection email={session?.user?.email} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
