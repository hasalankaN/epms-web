"use client";

import React, { useState } from "react";


import { Plus } from "lucide-react";

import { useTabNavigation } from "@/hooks/useTabNavigation";


import { cn } from "@/lib/utils";
import { TAB_STYLES, BUTTON_STYLES } from "@/lib/constants/theme";

import { StudentTab } from "@/components/admin-panel/user-management/StudentTab";
import { LecturerTab } from "@/components/admin-panel/user-management/LecturerTab";
import { StaffTab } from "@/components/admin-panel/user-management/StaffTab";

import { AddLecturerPanel } from "@/components/admin-panel/user-management/modals/lecturer/AddLecturerPanel";
import { AddStaffPanel } from "@/components/admin-panel/user-management/modals/staff/AddStaffPanel";
import { AddStudentPanel } from "@/components/admin-panel/user-management/modals/student/AddStudentPanel";

export type UserManagementTabType = "student" | "lecturers" | "staff";

const tabs = [
  { value: "student", label: "Student", mobileLabel: "Student" },
  { value: "lecturers", label: "Lecturers", mobileLabel: "Lec." },
  { value: "staff", label: "Staff", mobileLabel: "Staff" },
] as const;

export default function UserManagementPage() {
  const { activeTab, handleTabChange } = useTabNavigation<UserManagementTabType>("student", tabs.map(t => t.value));

  // ===== MODAL STATE =====
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddLecturerOpen, setIsAddLecturerOpen] = useState(false);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  return (
    <div className="space-y-3 p-4 md:p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 flex-nowrap">
        {/* Tabs */}
        <div className={TAB_STYLES.container}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={cn(
                TAB_STYLES.triggerBase,
                "w-auto px-4",
                activeTab === tab.value
                  ? TAB_STYLES.active
                  : TAB_STYLES.inactive
              )}
            >
              <span className="hidden md:inline">{tab.label}</span>
              <span className="md:hidden">{tab.mobileLabel}</span>
            </button>
          ))}
        </div>

        {/* Add New Student Button (Student Tab) */}
        {activeTab === "student" && (
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4"
            )}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">Add New Student</span>
          </button>
        )}

        {/* Add New Lecturer Button (Lecturers Tab) */}
        {activeTab === "lecturers" && (
          <button
            onClick={() => setIsAddLecturerOpen(true)}
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4"
            )}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">Add New Lecturer</span>
          </button>
        )}

        {/* Add New Member Button (Staff Tab) */}
        {activeTab === "staff" && (
          <button
            onClick={() => setIsAddStaffOpen(true)}
            className={cn(
              BUTTON_STYLES.primary.md,
              "text-sm font-semibold text-white px-3 md:px-4"
            )}
          >
            <Plus className="h-5 w-5 md:hidden" />
            <span className="hidden md:inline">Add New Member</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      {activeTab === "student" && <StudentTab />}
      {activeTab === "lecturers" && <LecturerTab />}
      {activeTab === "staff" && <StaffTab />}

      {/* Slide-over Panels */}
      <AddStudentPanel
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
      />

      <AddLecturerPanel
        isOpen={isAddLecturerOpen}
        onClose={() => setIsAddLecturerOpen(false)}
      />
      
      <AddStaffPanel 
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
      />
    </div>
  );
}
