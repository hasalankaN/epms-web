"use client";

import React from "react";

import { useParams } from "next/navigation";

import { format } from "date-fns";

import { BackButton } from "@/components/common/BackButton";
import { StaffGeneralDetails } from "@/components/admin-panel/user-management/view/staff/StaffGeneralDetails";
import { StaffAssignedCourses } from "@/components/admin-panel/user-management/view/staff/StaffAssignedCourses";
import { StaffAssignedBatches } from "@/components/admin-panel/user-management/view/staff/StaffAssignedBatches";
import { StaffReferralDetails } from "@/components/admin-panel/user-management/view/staff/StaffReferralDetails";
import { useGetStaffById } from "@/hooks/api/staff/useGetStaffById";

export default function ViewStaffPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: staffData, isLoading, isError } = useGetStaffById(id);

  const renderGeneralDetails = () => {
    if (isLoading) {
      return (
        <div
          className="flex w-full animate-pulse flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 rounded-[8px] border border-[#E2E8F0] bg-white p-6"
          style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}
        >
          <div className="flex items-center gap-6 shrink-0 md:border-r border-[#F1F5F9] md:pr-12">
            <div className="h-[108px] w-[108px] rounded-full bg-slate-200" />
            <div className="flex flex-col gap-2">
              <div className="h-6 w-32 rounded bg-slate-200" />
              <div className="h-4 w-24 rounded bg-slate-200" />
              <div className="h-5 w-20 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-5 w-24 rounded bg-slate-100" />
                <div className="h-4 w-32 rounded bg-slate-50" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isError || !staffData) {
      return (
        <div
          className="flex w-full items-center justify-center rounded-[8px] border border-[#E2E8F0] bg-white p-6"
          style={{ boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)" }}
        >
          <p className="text-[#90A1B9]">Staff details not found.</p>
        </div>
      );
    }

    const { profile } = staffData;

    return (
      <StaffGeneralDetails
        name={`${profile.first_name} ${profile.last_name}`}
        staffId={profile.public_id}
        enrolledDate={format(new Date(profile.created_at), "yyyy/MM/dd")}
        mobileNumber={profile.mobile_number}
        whatsAppNumber={profile.whatsapp_number || "-"}
        gender={profile.gender || "-"}
        emailAddress={profile.email}
        salaryType={profile.salary_type}
        profileImageUrl={profile.profile_image_url}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between px-4 pt-6 md:px-6">
        <BackButton 
            href="/admin-panel/user-management?tab=staff" 
            label="Go to User Management" 
        />
      </div>

      <div className="px-4 md:px-6 pb-10 mt-4">
        {renderGeneralDetails()}
        
        <div className="mt-6">
          <StaffAssignedCourses staffId={id} />
        </div>
        <div className="mt-6">
          <StaffAssignedBatches staffId={id} />
        </div>
        <div className="mt-6">
          <StaffReferralDetails
            commissions={(staffData?.commissionHistory as any[]) ?? []}
            commissionsSummary={staffData?.commissionsSummary}
            enquiries={(staffData?.enquiries as any[]) ?? []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
