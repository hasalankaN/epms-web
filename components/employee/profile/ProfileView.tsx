"use client";

import React, { useState } from "react";
import { User, Phone, Mail, Calendar, Shield, MapPin, Award, Users, FileEdit, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { RequestProfileUpdateModal } from "./RequestProfileUpdateModal";
import { useProfileQuery } from "@/hooks/api/profile/useProfile";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export function ProfileView() {
  const { data: profile, isLoading } = useProfileQuery();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "personal" | "experience" | "emergency" | "dependents" | "requests"
  >("personal");

  if (isLoading || !profile) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-pink-500 shadow-md">
              <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
              <AvatarFallback className="bg-pink-100 text-pink-700 font-bold text-xl">
                {profile.fullName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {profile.fullName}
                </h1>
                <StatusBadge status={profile.status} />
              </div>
              <p className="text-xs font-semibold text-pink-600 dark:text-pink-400">
                {profile.positionName} Â· {profile.departmentName}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span>Code: <strong className="text-slate-700 dark:text-slate-300">{profile.employeeCode}</strong></span>
                <span>â€¢</span>
                <span>Supervisor: <strong className="text-slate-700 dark:text-slate-300">{profile.supervisorName}</strong></span>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setIsUpdateModalOpen(true)}
            className="bg-[#E60076] hover:bg-[#d0006a] text-white gap-2 text-xs font-medium self-start sm:self-auto"
          >
            <FileEdit className="h-4 w-4" />
            Request Profile Update
          </Button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { key: "personal", label: "Personal Details", icon: User },
          { key: "experience", label: "Work Experience", icon: Award },
          { key: "emergency", label: "Emergency Contacts", icon: Phone },
          { key: "dependents", label: "Dependents", icon: Users },
          { key: "requests", label: `My Requests (${profile.updateRequests?.length || 0})`, icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all shrink-0 ${
                isActive
                  ? "bg-pink-50 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 shadow-sm border border-pink-200/60 dark:border-pink-800/60"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Details */}
      {activeTab === "personal" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            General Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Full Name</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile.fullName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Work Email</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile.email}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Contact Number</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile.contactNumber}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">NIC / Identification No</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile.nic}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Date of Birth</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile.dob}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Gender</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile.gender}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">EPF Number</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile.epfNo}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Joined Date</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile.joinDate}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Residential Address</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                {profile.streetAddress}, {profile.city}, {profile.province}
              </p>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-slate-400 font-medium">Educational & Professional Qualifications</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{profile.qualification}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Work Experience */}
      {activeTab === "experience" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Employment Background
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Company</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3">Start Date</th>
                  <th className="p-3">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {profile.workExperiences.map((exp) => (
                  <tr key={exp.id}>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{exp.companyName}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{exp.designation}</td>
                    <td className="p-3 text-slate-500">{exp.startDate}</td>
                    <td className="p-3 text-slate-500">{exp.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Emergency Contacts */}
      {activeTab === "emergency" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Emergency Contacts
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Relationship</th>
                  <th className="p-3">Mobile Phone</th>
                  <th className="p-3">Work Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {profile.emergencyContacts.map((cnt) => (
                  <tr key={cnt.id}>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{cnt.name}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{cnt.relationship}</td>
                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{cnt.mobilePhone}</td>
                    <td className="p-3 text-slate-500">{cnt.workPhone || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Dependents */}
      {activeTab === "dependents" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Dependents Information
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Relationship</th>
                  <th className="p-3">Date of Birth</th>
                  <th className="p-3">Contact Phone</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {profile.dependents.map((dep) => (
                  <tr key={dep.id}>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{dep.name}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">{dep.relationship}</td>
                    <td className="p-3 text-slate-500">{dep.dob}</td>
                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{dep.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: My Requests */}
      {activeTab === "requests" && (
        <div className="rounded-xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
            Profile Update Requests History
          </h3>
          <div className="space-y-3">
            {profile.updateRequests.map((req) => (
              <div
                key={req.id}
                className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs text-slate-400 font-medium">Requested: {req.requestedAt}</span>
                  <StatusBadge status={req.status} />
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {req.summary}
                </p>
                <p className="text-xs text-slate-500">
                  <strong>Reason:</strong> {req.reason}
                </p>
                {req.decisionComment && (
                  <div className="rounded bg-slate-50 dark:bg-slate-800 p-2 text-xs text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-700 dark:text-slate-200">HR Feedback:</strong> {req.decisionComment}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <RequestProfileUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        profile={profile}
      />
    </div>
  );
}

