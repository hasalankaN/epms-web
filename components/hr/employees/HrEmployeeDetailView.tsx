"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Clock,
  CheckCircle2,
  Calendar,
  DollarSign,
  Star,
  FileText,
  Users,
  Award,
  Edit,
  Shield,
  Trash2,
  Download,
} from "lucide-react";
import { BackButton } from "@/components/common/BackButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { useProfileQuery } from "@/hooks/api/profile/useProfile";
import { useTeamAttendanceQuery } from "@/hooks/api/attendance/useAttendance";
import { useSupervisorLeavesQuery } from "@/hooks/api/leaves/useLeaves";
import { useMySalaryQuery } from "@/hooks/api/salary/useSalary";
import { useMyReviewsQuery } from "@/hooks/api/performance/usePerformance";
import { toast } from "sonner";

interface HrEmployeeDetailViewProps {
  id: string;
}

export function HrEmployeeDetailView({ id }: HrEmployeeDetailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "experience"
    | "dependents"
    | "emergency"
    | "attendance"
    | "leave"
    | "salary"
    | "performance"
    | "documents"
  >("overview");

  const { data: profile } = useProfileQuery();
  const { data: attendanceData } = useTeamAttendanceQuery();
  const { data: leavesData } = useSupervisorLeavesQuery();
  const { data: salaryData } = useMySalaryQuery();
  const { data: reviews = [] } = useMyReviewsQuery();

  const attendanceList = attendanceData?.items || [];
  const leavesList = leavesData?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BackButton href="/hr-panel/employees" label="Back to Directory" />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Edit Employee dialog opened")}
            className="text-xs gap-1.5"
          >
            <Edit className="h-3.5 w-3.5" /> Edit Profile
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Supervisor assignment updated")}
            className="text-xs gap-1.5 text-blue-600 hover:bg-blue-50"
          >
            <User className="h-3.5 w-3.5" /> Assign Supervisor
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.success("Deactivation prompt")}
            className="text-xs gap-1.5 text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Deactivate
          </Button>
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <Avatar className="h-20 w-20 border-2 border-pink-500 shadow-sm">
            <AvatarFallback className="bg-pink-100 text-pink-700 font-extrabold text-2xl">
              NP
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {profile?.fullName || "Nuwan Pradeep Perera"}
              </h2>
              <StatusBadge status="ACTIVE" />
            </div>
            <p className="text-xs font-semibold text-pink-600 dark:text-pink-400">
              {profile?.positionName || "Senior Software Engineer"} · {profile?.departmentName || "Technology"}
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap pt-0.5">
              <span>Code: <strong className="text-slate-700 dark:text-slate-300">EMP-1042</strong></span>
              <span>•</span>
              <span>NIC: <strong className="text-slate-700 dark:text-slate-300">199418204910</strong></span>
              <span>•</span>
              <span>Supervisor: <strong className="text-slate-700 dark:text-slate-300">Kanishka Bandara</strong></span>
              <span>•</span>
              <span>EPF: <strong className="text-slate-700 dark:text-slate-300">EPF-88392</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: "overview", label: "Overview", icon: User },
          { key: "experience", label: "Work Experience", icon: Award },
          { key: "dependents", label: "Dependents", icon: Users },
          { key: "emergency", label: "Emergency Contacts", icon: Users },
          { key: "attendance", label: "Attendance Logs", icon: Clock },
          { key: "leave", label: "Leave History", icon: Calendar },
          { key: "salary", label: "Salary & Compensation", icon: DollarSign },
          { key: "performance", label: "Performance Reviews", icon: Star },
          { key: "documents", label: "Official Documents", icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                isActive
                  ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <p className="text-slate-400">Full Name</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile?.fullName}</p>
            </div>
            <div>
              <p className="text-slate-400">Official Work Email</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile?.email}</p>
            </div>
            <div>
              <p className="text-slate-400">Personal Contact Number</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile?.contactNumber}</p>
            </div>
            <div>
              <p className="text-slate-400">Date of Birth</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile?.dob}</p>
            </div>
            <div>
              <p className="text-slate-400">Gender</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile?.gender}</p>
            </div>
            <div>
              <p className="text-slate-400">Joined Date</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile?.joinDate}</p>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-slate-400">Residential Address</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {profile?.streetAddress}, {profile?.city}, {profile?.province}
              </p>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-slate-400">Academic & Professional Qualifications</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile?.qualification}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Experience */}
      {activeTab === "experience" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-5 shadow-sm overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Previous Employer</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Start Date</th>
                <th className="p-3">End Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {profile?.workExperiences?.map((w) => (
                <tr key={w.id}>
                  <td className="p-3 font-semibold">{w.companyName}</td>
                  <td className="p-3">{w.designation}</td>
                  <td className="p-3 text-slate-500">{w.startDate}</td>
                  <td className="p-3 text-slate-500">{w.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Dependents */}
      {activeTab === "dependents" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-5 shadow-sm overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Dependent Name</th>
                <th className="p-3">Relationship</th>
                <th className="p-3">Date of Birth</th>
                <th className="p-3">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {profile?.dependents?.map((d) => (
                <tr key={d.id}>
                  <td className="p-3 font-semibold">{d.name}</td>
                  <td className="p-3">{d.relationship}</td>
                  <td className="p-3 text-slate-500">{d.dob}</td>
                  <td className="p-3">{d.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 4: Emergency Contacts */}
      {activeTab === "emergency" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-5 shadow-sm overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Contact Name</th>
                <th className="p-3">Relationship</th>
                <th className="p-3">Mobile Phone</th>
                <th className="p-3">Work Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {profile?.emergencyContacts?.map((e) => (
                <tr key={e.id}>
                  <td className="p-3 font-semibold">{e.name}</td>
                  <td className="p-3">{e.relationship}</td>
                  <td className="p-3 font-mono">{e.mobilePhone}</td>
                  <td className="p-3 font-mono">{e.workPhone || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: Attendance */}
      {activeTab === "attendance" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Punch In</th>
                <th className="p-3">Punch Out</th>
                <th className="p-3">Work Hours</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {attendanceList.slice(0, 10).map((a) => (
                <tr key={a.id}>
                  <td className="p-3 font-semibold">{a.date} ({a.day})</td>
                  <td className="p-3 font-mono">{a.punchIn || "—"}</td>
                  <td className="p-3 font-mono">{a.punchOut || "—"}</td>
                  <td className="p-3 font-semibold">{a.workHours}h</td>
                  <td className="p-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 6: Leave */}
      {activeTab === "leave" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Applied On</th>
                <th className="p-3">Type</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Days</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leavesList.map((l: any) => (
                <tr key={l.id}>
                  <td className="p-3 text-slate-500">{l.appliedOn}</td>
                  <td className="p-3 font-semibold">{l.type}</td>
                  <td className="p-3">{l.fromDate} → {l.toDate}</td>
                  <td className="p-3 font-bold">{l.days}d</td>
                  <td className="p-3"><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 7: Salary */}
      {activeTab === "salary" && salaryData && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm space-y-4 text-xs">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-slate-400 font-medium">Current Monthly Package</span>
              <p className="text-xl font-bold font-mono text-[#E60076]">
                LKR {salaryData.netSalary.toLocaleString()} / month
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/hr-panel/payroll`)}
              className="text-xs"
            >
              Adjust in Payroll
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="text-slate-400">Basic Salary:</span>
              <p className="text-sm font-bold font-mono mt-1">LKR {salaryData.basicSalary.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
              <span className="text-slate-400">Total Fixed Allowances:</span>
              <p className="text-sm font-bold font-mono mt-1 text-emerald-600">
                +LKR {salaryData.totalAllowances.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Performance */}
      {activeTab === "performance" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Review Cycle</th>
                <th className="p-3">Reviewer</th>
                <th className="p-3">Score</th>
                <th className="p-3">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {reviews.map((r: any) => (
                <tr key={r.id}>
                  <td className="p-3 font-semibold">{r.quarter}</td>
                  <td className="p-3">{r.reviewerName}</td>
                  <td className="p-3 font-bold text-amber-500">{r.rating} ★</td>
                  <td className="p-3 text-slate-500 max-w-xs truncate">{r.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 9: Documents */}
      {activeTab === "documents" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm space-y-3 text-xs">
          {[
            { name: "Employment_Appointment_Letter.pdf", size: "1.2 MB", date: "2022-03-01" },
            { name: "NIC_Copy_Front_Back.pdf", size: "850 KB", date: "2022-03-01" },
            { name: "Degree_Certificate_Verified.pdf", size: "2.4 MB", date: "2022-03-01" },
            { name: "AWS_Certified_SAA_Certificate.pdf", size: "640 KB", date: "2026-08-15" },
          ].map((doc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg hover:bg-slate-50/50"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#E60076]" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{doc.name}</p>
                  <p className="text-[10px] text-slate-400">{doc.size} · Uploaded on {doc.date}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success(`Downloading ${doc.name}...`)}
                className="h-7 text-xs gap-1"
              >
                <Download className="h-3 w-3" /> Download
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

