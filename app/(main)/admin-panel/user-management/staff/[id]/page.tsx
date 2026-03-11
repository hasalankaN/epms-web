"use client";

import React from "react";

import { useParams } from "next/navigation";

import { BackButton } from "@/components/common/BackButton";
import { StaffGeneralDetails } from "@/components/admin-panel/user-management/view/staff/StaffGeneralDetails";
import { StaffAssignedCourses } from "@/components/admin-panel/user-management/view/staff/StaffAssignedCourses";
import { StaffAssignedBatches } from "@/components/admin-panel/user-management/view/staff/StaffAssignedBatches";
import { StaffReferralDetails } from "@/components/admin-panel/user-management/view/staff/StaffReferralDetails";

export default function ViewStaffPage() {
  const params = useParams();
  const id = params.id as string;

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
        <StaffGeneralDetails
          name="Staff Name"
          staffId={`#${id}`}
          enrolledDate="2025/01/01"
          mobileNumber="+70 XXX XXXX"
          whatsAppNumber="+70 XXX XXXX"
          gender="Male"
          emailAddress="user@gmail.com"
          paymentType="Monthly Salary"
          commissionRate="Commission per enroll 20%"
          profileImageUrl="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop"
        />
        <div className="mt-6">
          <StaffAssignedCourses />
        </div>
        <div className="mt-6">
          <StaffAssignedBatches />
        </div>
        <div className="mt-6">
          <StaffReferralDetails />
        </div>
      </div>
    </div>
  );
}
